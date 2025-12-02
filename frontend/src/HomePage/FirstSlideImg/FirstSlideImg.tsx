import { useState, useEffect } from "react";
import { getApiUrl, normalizeImageUrl } from "../../config/api";

interface FeaturedCollection {
  id: string;
  collectionId: string;
  name: string;
  image: string;
  bannerImage?: string;
  chain?: string;
}

const FirstSlideImg = () => {
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollection[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured collections from backend
    fetch(getApiUrl("api/featured-collections"))
      .then((res) => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((col) => ({
            id: col.id || col._id,
            collectionId: col.collectionId,
            name: col.name,
            image: col.image,
            bannerImage: col.bannerImage || col.image,
            chain: col.chain,
          }));
          setFeaturedCollections(formatted);
        } else {
          // Fallback: fetch all collections and take first 5
          fetch(getApiUrl("api/collections"))
            .then((res) => res.json())
            .then((allCollections: any[]) => {
              if (Array.isArray(allCollections) && allCollections.length > 0) {
                const first5 = allCollections.slice(0, 5).map((col) => ({
                  id: col.id || col._id,
                  collectionId: col.id || col._id,
                  name: col.name,
                  image: col.image,
                  bannerImage: col.bannerImage || col.image,
                  chain: col.chain,
                }));
                setFeaturedCollections(first5);
              }
            })
            .catch((err) => console.error("Error fetching fallback collections:", err));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured collections:", err);
        setLoading(false);
      });
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredCollections.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCollections.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [featuredCollections.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredCollections.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredCollections.length) % featuredCollections.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-[50vh] bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (featuredCollections.length === 0) {
    return (
      <div className="w-full h-[50vh] bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
        <div className="text-white text-lg">No featured collections</div>
      </div>
    );
  }

  const currentCollection = featuredCollections[currentIndex];
  const imageUrl = currentCollection?.bannerImage 
    ? normalizeImageUrl(currentCollection.bannerImage) 
    : normalizeImageUrl(currentCollection?.image) || "/default-banner.jpg";

  return (
    <div className="w-full h-[50vh] relative overflow-hidden">
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {featuredCollections.map((collection, index) => {
          const isActive = index === currentIndex;
          const slideImageUrl = collection.bannerImage 
            ? normalizeImageUrl(collection.bannerImage) 
            : normalizeImageUrl(collection.image) || "/default-banner.jpg";
          
          return (
            <div
              key={collection.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slideImageUrl})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundColor: "#1a1a1a", // Add background color to fill empty space
                }}
              >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-4xl font-bold mb-2">{collection.name}</h2>
                  <p className="text-lg text-gray-300">Featured Collection</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {featuredCollections.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-gray-700 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-gray-700 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {featuredCollections.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {featuredCollections.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#3DB6B1] w-8"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FirstSlideImg;

