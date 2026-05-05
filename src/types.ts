/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Career' | 'Travel' | 'Personal Growth' | 'Relationships' | 'Abundance' | 'Creative';

export interface Wish {
  id: string;
  title: string;
  description: string;
  category: Category;
  target_date: string;
  progress: number; // 0 to 100
  isManifested: boolean;
  imageUrl?: string;
  createdAt: number;
}
