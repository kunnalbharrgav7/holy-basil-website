import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();

  // Create a dynamic storage key based on user ID (or 'guest' if logged out)
  const storageKey = user
    ? `hba_wishlist_${user.id || user._id}`
    : "hba_wishlist_guest";

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Whenever user changes (login or logout), reload their specific wishlist
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch {
      setWishlist([]);
    }
  }, [user, storageKey]);

  // Save to user-specific storage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    } catch (err) {
      console.error("Failed to save wishlist", err);
    }
  }, [wishlist, storageKey]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const isAlreadyInWishlist = prev.some((item) => item._id === product._id);
      if (isAlreadyInWishlist) {
        return prev.filter((item) => item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
