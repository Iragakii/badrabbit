package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class ApillonService {

    @Value("${apillon.api.key}")
    private String apiKey;

    @Value("${apillon.api.secret}")
    private String apiSecret;

    @Value("${apillon.bucket.uuid}")
    private String bucketUuid;

    public String uploadFile(String fileName, String contentType, byte[] fileBytes) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        // Step 1: Create upload session
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String auth = apiKey + ":" + apiSecret;
        headers.set("Authorization", "Basic " + Base64.getEncoder().encodeToString(auth.getBytes()));

        String uploadInitUrl = "https://api.apillon.io/storage/buckets/" + bucketUuid + "/upload";
        Map<String, Object> body = Map.of(
            "files", new Object[] {
                Map.of("fileName", fileName, "contentType", contentType)
            }
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> initResponse = restTemplate.postForEntity(uploadInitUrl, request, Map.class);

        if (!initResponse.getStatusCode().is2xxSuccessful()) {
            throw new Exception("Failed to initialize upload");
        }

        Map<String, Object> responseBody = initResponse.getBody();
        Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
        String sessionUuid = (String) data.get("sessionUuid");
        
        List<Map<String, Object>> files = (List<Map<String, Object>>) data.get("files");
        Map<String, Object> fileInfo = files.get(0);
        
        String uploadUrl = (String) fileInfo.get("url");
        String fileUuid = (String) fileInfo.get("fileUuid");

        // Step 2: Upload to S3 using HttpURLConnection
        URL s3Url = new URL(uploadUrl);
        HttpURLConnection connection = (HttpURLConnection) s3Url.openConnection();
        connection.setDoOutput(true);
        connection.setRequestMethod("PUT");
        connection.setRequestProperty("Content-Type", contentType);
        connection.setRequestProperty("Content-Length", String.valueOf(fileBytes.length));
        
        try (OutputStream os = connection.getOutputStream()) {
            os.write(fileBytes);
        }
        
        if (connection.getResponseCode() != 200) {
            throw new Exception("Failed to upload to S3: " + connection.getResponseCode());
        }

        // Step 3: End session
        String endSessionUrl = "https://api.apillon.io/storage/buckets/" + bucketUuid + "/upload/" + sessionUuid + "/end";
        HttpEntity<Void> endRequest = new HttpEntity<>(headers);
        restTemplate.postForEntity(endSessionUrl, endRequest, Map.class);

        // Step 4: Poll for file CID (files are processed asynchronously)
        String cid = null;
        int maxAttempts = 15; // Increased attempts
        
        System.out.println("Starting to poll for CID. Looking for file: " + fileName);
        
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            Thread.sleep(2000);
            System.out.println("Attempt " + attempt + " of " + maxAttempts);
            
            try {
                String listFilesUrl = "https://api.apillon.io/storage/buckets/" + bucketUuid + "/files?limit=100";
                HttpEntity<Void> listRequest = new HttpEntity<>(headers);
                ResponseEntity<Map> listResponse = restTemplate.exchange(listFilesUrl, HttpMethod.GET, listRequest, Map.class);
                
                System.out.println("Response status: " + listResponse.getStatusCode());
                
                if (listResponse.getStatusCode().is2xxSuccessful() && listResponse.getBody() != null) {
                    Map<String, Object> listData = (Map<String, Object>) listResponse.getBody().get("data");
                    if (listData != null && listData.containsKey("items")) {
                        List<Map<String, Object>> items = (List<Map<String, Object>>) listData.get("items");
                        System.out.println("Found " + items.size() + " items in bucket");
                        
                        for (Map<String, Object> item : items) {
                            String itemName = (String) item.get("name");
                            String itemCid = (String) item.get("CID");
                            
                            System.out.println("  - File: " + itemName + " | CID: " + itemCid);
                            
                            if (fileName.equals(itemName) && itemCid != null && !itemCid.isEmpty()) {
                                // FIXED: Removed status check since it's always null
                                System.out.println("SUCCESS! Found CID: " + itemCid);
                                return "https://ipfs.io/ipfs/" + itemCid;
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error on attempt " + attempt + ": " + e.getMessage());
            }
        }

        System.out.println("Failed to get CID after all attempts. Falling back to fileUuid (may not work).");
        throw new Exception("File uploaded but CID not available after " + maxAttempts + " attempts. File UUID: " + fileUuid);
    }
}