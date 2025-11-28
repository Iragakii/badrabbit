import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

interface User {
  id?: string;
  _id?: string;
  walletAddress?: string;
  username?: string;
  profileImageUrl?: string;
}

interface ModalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const ModalSearch = ({ isOpen, onClose, initialQuery = "" }: ModalSearchProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "collections" | "tokens" | "items" | "wallets">("all");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setUsers([]);
      return;
    }

    if (initialQuery) {
      setSearchQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/user/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch(searchQuery);
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleUserClick = (user: User) => {
    if (user.walletAddress) {
      navigate(`/${user.walletAddress}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[5000] flex items-start justify-center pt-20"
      onClick={onClose}
    >
      {/* Search Modal */}
      <div
        className="w-full max-w-4xl mx-4 bg-[#0C0C0C] rounded-2xl shadow-2xl border border-[#181C14] overflow-hidden z-[5100]"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Search Input */}
          <div className="p-4 border-b border-[#181C14] relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search OpenSea"
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full bg-[#181C14] text-white placeholder-gray-400 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F7D53] text-lg"
            />
            <button
              onClick={onClose}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer p-1"
              title="Close (ESC)"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Categories */}
          <div className="flex border-b border-[#181C14]">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-6 py-3 font-medium transition cursor-pointer ${
                activeCategory === "all"
                  ? "text-white border-b-2 border-white bg-[#181C14]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory("collections")}
              className={`px-6 py-3 font-medium transition cursor-pointer ${
                activeCategory === "collections"
                  ? "text-white border-b-2 border-white bg-[#181C14]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveCategory("tokens")}
              className={`px-6 py-3 font-medium transition cursor-pointer ${
                activeCategory === "tokens"
                  ? "text-white border-b-2 border-white bg-[#181C14]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Tokens
            </button>
            <button
              onClick={() => setActiveCategory("items")}
              className={`px-6 py-3 font-medium transition cursor-pointer ${
                activeCategory === "items"
                  ? "text-white border-b-2 border-white bg-[#181C14]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Items
            </button>
            <button
              onClick={() => setActiveCategory("wallets")}
              className={`px-6 py-3 font-medium transition cursor-pointer ${
                activeCategory === "wallets"
                  ? "text-white border-b-2 border-white bg-[#181C14]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Wallets
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto modal-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Searching...</div>
            ) : searchQuery.length >= 2 ? (
              activeCategory === "wallets" || activeCategory === "all" ? (
                users.length > 0 ? (
                  <div className="p-4 space-y-2">
                    <div className="text-gray-400 text-xs uppercase mb-2">Wallets</div>
                    {users.map((user) => (
                      <div
                        key={user.id || user._id || user.walletAddress}
                        onClick={() => handleUserClick(user)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#181C14] cursor-pointer transition"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#1F7D53] flex items-center justify-center overflow-hidden">
                          {user.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt={user.username || "User"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-sm">
                              {(user.username || user.walletAddress || "U")[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">
                            {user.username || "Unnamed User"}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs">WALLET</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">No users found</div>
                )
              ) : (
                <div className="p-8 text-center text-gray-400">Coming soon</div>
              )
            ) : (
              <div className="p-8 text-center text-gray-400">
                {searchQuery.length === 0 ? "Start typing to search..." : "Type at least 2 characters"}
              </div>
            )}
          </div>
        </div>
      </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModalSearch;

