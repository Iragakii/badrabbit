package com.example.backend.utils;

import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.math.BigInteger;

public class SignatureUtils {

    public static boolean verify(String address, String message, String signatureHex) {
        try {
            // 1️⃣ Compute Ethereum message hash (adds prefix internally)
            byte[] msgHash = Sign.getEthereumMessageHash(message.getBytes());

            // 2️⃣ Convert signature to bytes
            byte[] signatureBytes = Numeric.hexStringToByteArray(signatureHex);
            if (signatureBytes.length != 65) {
                System.err.println("Invalid signature length: " + signatureBytes.length);
                return false;
            }

            // 3️⃣ Split signature into r, s, v
            byte[] r = new byte[32];
            byte[] s = new byte[32];
            System.arraycopy(signatureBytes, 0, r, 0, 32);
            System.arraycopy(signatureBytes, 32, s, 0, 32);
            byte v = signatureBytes[64];
            if (v < 27) v += 27; // ✅ normalize for 0/1

            // 4️⃣ Create SignatureData
            Sign.SignatureData sigData = new Sign.SignatureData(v, r, s);
            System.out.println("Signature v: " + sigData);

            // 5️⃣ Recover the signer address
            BigInteger publicKey = Sign.signedMessageHashToKey(msgHash, sigData);
            String recoveredAddress = "0x" + Keys.getAddress(publicKey);

            System.out.println("Recovered address: " + recoveredAddress);
            System.out.println("Expected address:  " + address);

            // 6️⃣ Compare
            return recoveredAddress.equalsIgnoreCase(address);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
