import AsyncStorage from "@react-native-async-storage/async-storage";
import { BrainItem } from "./types";

const STORAGE_KEY = "second-brain-items-v1";

export async function loadItems(): Promise<BrainItem[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveItems(items: BrainItem[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
