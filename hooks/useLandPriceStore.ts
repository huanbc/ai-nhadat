import { useState, useEffect, useCallback } from 'react';
import { LandPrice } from '../types';

const STORAGE_KEY = 'AI_CONTRACT_DRAFTER_CUSTOM_LAND_PRICES';

export const useLandPriceStore = () => {
  const [customLandPrices, setCustomLandPrices] = useState<LandPrice[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setCustomLandPrices(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load custom land prices from storage:", error);
      setCustomLandPrices([]);
    }
  }, []);

  const saveToStorage = (prices: LandPrice[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
    } catch (error) {
      console.error("Failed to save custom land prices to storage:", error);
    }
  };

  const addCustomLandPrices = useCallback((newPrices: LandPrice[]) => {
    setCustomLandPrices(prevPrices => {
      const pricesToAdd = newPrices.map(p => ({
        ...p,
        id: `custom-${Date.now()}-${Math.random()}`
      }));
      const updatedPrices = [...prevPrices, ...pricesToAdd];
      saveToStorage(updatedPrices);
      return updatedPrices;
    });
  }, []);

  const upsertCustomLandPrice = useCallback((priceToSave: LandPrice) => {
    setCustomLandPrices(prevPrices => {
      const existingIndex = prevPrices.findIndex(p => p.id === priceToSave.id);
      let newCustomPrices;
      if (existingIndex > -1) {
        // Update an existing custom price
        newCustomPrices = [...prevPrices];
        newCustomPrices[existingIndex] = priceToSave;
      } else {
        // Add a new custom price (this happens when editing an *initial* price for the first time)
        newCustomPrices = [...prevPrices, { ...priceToSave, id: `custom-${Date.now()}-${Math.random()}` }];
      }
      saveToStorage(newCustomPrices);
      return newCustomPrices;
    });
  }, []);

  return { customLandPrices, addCustomLandPrices, upsertCustomLandPrice };
};
