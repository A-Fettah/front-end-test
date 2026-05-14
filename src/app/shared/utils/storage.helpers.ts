import { environment } from '../../../environments/environment';


export function setCacheItem<T>(key: string, data: T): void {
  const cacheData = {
    timestamp: Date.now(),
    data
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
}


export function getCacheItem<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const cache = JSON.parse(item);
  const isExpired = Date.now() - cache.timestamp > environment.cacheTime;

  if (isExpired) {
    localStorage.removeItem(key);
    return null;
  }
  return cache.data;
}
