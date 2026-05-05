/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
}

export const imageSearchService = {
  async searchImages(query: string): Promise<UnsplashImage[]> {
    if (!ACCESS_KEY) {
      console.warn('Unsplash Access Key is missing.');
      return [];
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${ACCESS_KEY}&per_page=12`
      );
      
      if (!response.ok) throw new Error('Unsplash search failed');
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Image search error:', error);
      return [];
    }
  }
};
