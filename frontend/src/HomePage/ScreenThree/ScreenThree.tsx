import { useState, useEffect } from "react";

interface LearningCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  link?: string;
}

const ScreenThree = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learningCards, setLearningCards] = useState<LearningCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Default learning cards
    const defaultCards: LearningCard[] = [
      {
        id: "1",
        title: "What are NFTs?",
        description: "Non-Fungible Tokens (NFTs) are unique digital assets stored on a blockchain, representing ownership of digital or physical items.",
        icon: "🎨",
      },
      {
        id: "2",
        title: "Understanding Web3",
        description: "Web3 is the next generation of the internet, built on decentralized technologies like blockchain, enabling user ownership and control.",
        icon: "🌐",
      },
      {
        id: "3",
        title: "Blockchain Basics",
        description: "Learn about blockchain technology, how it works, and why it's revolutionizing digital ownership and transactions.",
        icon: "⛓️",
      },
      {
        id: "4",
        title: "NFT Marketplaces",
        description: "Discover how NFT marketplaces work, how to buy and sell NFTs, and what makes each marketplace unique.",
        icon: "🏪",
      },
      {
        id: "5",
        title: "Digital Ownership",
        description: "Understand how blockchain technology enables true digital ownership and what rights come with owning an NFT.",
        icon: "🔐",
      },
    ];

    // Try to fetch from backend (if you create an endpoint later)
    // For now, use default cards
    setLearningCards(defaultCards);
    setLoading(false);
    
    // Future: Fetch from API
    // fetch(getApiUrl("api/learning-content"))
    //   .then(res => res.json())
    //   .then(data => {
    //     if (Array.isArray(data) && data.length > 0) {
    //       setLearningCards(data);
    //     } else {
    //       setLearningCards(defaultCards);
    //     }
    //   })
    //   .catch(() => setLearningCards(defaultCards))
    //   .finally(() => setLoading(false));
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (learningCards.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % learningCards.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [learningCards.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % learningCards.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + learningCards.length) % learningCards.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full py-12 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="container mx-auto text-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (learningCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">NFT 101</h2>
          <p className="text-gray-400 text-lg">Learn about NFTs, Web3, and more</p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-gray-800 shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-6xl mb-6">{learningCards[currentIndex].icon}</div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {learningCards[currentIndex].title}
                </h3>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  {learningCards[currentIndex].description}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-gray-700 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-gray-700 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {learningCards.map((_, index) => (
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

          {/* Auto-play indicator */}
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">
              {currentIndex + 1} of {learningCards.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenThree;

