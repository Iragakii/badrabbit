import { useState, useEffect } from "react";
import { getApiUrl, normalizeImageUrl } from "../../config/api";

interface NewsItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  source: string;
  link?: string;
}

const TempNewsTrending = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(getApiUrl("api/news"));
        if (res.ok) {
          const data: NewsItem[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setNewsItems(data);
            
            // Preload images with delay to avoid race conditions (silent preload)
            data.forEach((news, index) => {
              if (news.image) {
                const imageUrl = news.image.startsWith('http://') || news.image.startsWith('https://') 
                  ? news.image 
                  : (normalizeImageUrl(news.image) || "/defaultnews.gif");
                
                // Add small delay for each image to avoid overwhelming the browser
                setTimeout(() => {
                  const img = new Image();
                  let timeout: NodeJS.Timeout;
                  
                  img.onload = () => {
                    if (timeout) clearTimeout(timeout);
                    // Silent success - images are loading fine
                  };
                  img.onerror = () => {
                    if (timeout) clearTimeout(timeout);
                    // Silent error - let the actual render handle it
                  };
                  
                  // Set timeout for preload (10 seconds - more lenient)
                  timeout = setTimeout(() => {
                    // Silent timeout - just let it continue
                  }, 10000);
                  
                  img.src = imageUrl;
                }, index * 200); // Stagger preloads by 200ms
              }
            });
          } else {
            setNewsItems([]);
          }
        } else {
          console.error("Error fetching news:", res.status);
          setNewsItems([]);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-white text-lg">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-6">
      <div className="container mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Temp News Trending</h2>
          <p className="text-[#aaabac] font-bold text-lg">Latest updates from the NFT and crypto world</p>
        </div>

        {newsItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No news available. Admin can add news items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsItems.map((news, index) => {
              const newsId = news.id || news._id || `news-${index}`;
              // For external URLs (https://), use directly. For relative URLs, use normalizeImageUrl
              let imageUrl = "/defaultnews.gif";
              if (news.image) {
                if (news.image.startsWith('http://') || news.image.startsWith('https://')) {
                  imageUrl = news.image;
                } else {
                  const normalized = normalizeImageUrl(news.image);
                  imageUrl = normalized || "/defaultnews.gif";
                }
              }
              
              // Use the image URL directly - don't rely on preload errors
              const finalImageUrl = imageUrl;
              
              return (
                <div
                  key={newsId}
                  className="bg-[#212121] rounded-xl overflow-hidden border border-gray-800 hover:border-[#3DB6B1] transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
                  onClick={() => news.link && window.open(news.link, '_blank')}
                >
                  {/* Image */}
                  <div className="w-full aspect-video relative overflow-hidden bg-gray-900">
                    <img
                      src={finalImageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        // Only set fallback if we haven't already tried
                        if (!target.src.includes("defaultnews") && !target.dataset.retried) {
                          target.dataset.retried = "true";
                          // Try once more with the same URL (might be a temporary network issue)
                          setTimeout(() => {
                            if (!target.src.includes("defaultnews")) {
                              target.src = imageUrl;
                            }
                          }, 2000);
                        } else if (!target.src.includes("defaultnews")) {
                          // Final fallback to default news gif
                          target.src = "/defaultnews.gif";
                        }
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#3DB6B1] text-xs font-semibold">{news.source}</span>
                      <span className="text-gray-500 text-xs">{news.date}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-3">
                      {news.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TempNewsTrending;

