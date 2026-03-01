import React, { createContext, useState, useEffect, useContext } from "react";
import { FavoritesAPI } from "../api/endpoints";
import { AuthContext } from "./AuthContext";

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    if (user) loadFavorites();
    else setFavorites([]);
  }, [user]);

  const loadFavorites = async () => {
    try {
      const res = await FavoritesAPI.get();
      setFavorites(res.data.data || []);
    } catch (e) {
      console.error("Favorites load error:", e);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some((f) => f._id === productId || f === productId);
  };

  const toggleFavorite = async (productId) => {
    try {
      if (isFavorite(productId)) {
        await FavoritesAPI.remove(productId);
      } else {
        await FavoritesAPI.add(productId);
      }
      await loadFavorites();
      return { success: true };
    } catch (e) {
      return { success: false, message: "Favori işlemi başarısız" };
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        refreshFavorites: loadFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
