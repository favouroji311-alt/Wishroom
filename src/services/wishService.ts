/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabase } from '../lib/supabase';
import { Wish } from '../types';

const TABLE_NAME = 'wishes';

export const wishService = {
  async fetchWishes(): Promise<Wish[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wishes:', error);
      return [];
    }

    // Map DB snake_case back to frontend camelCase if necessary
    // Here I'll assume standard SQL structure and map fields
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      target_date: item.target_date,
      progress: item.progress,
      isManifested: item.is_manifested,
      imageUrl: item.image_url,
      createdAt: new Date(item.created_at).getTime(),
    }));
  },

  async addWish(wish: Omit<Wish, 'id' | 'isManifested' | 'createdAt'>): Promise<Wish | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([{
        title: wish.title,
        description: wish.description,
        category: wish.category,
        target_date: wish.target_date,
        progress: wish.progress,
        image_url: wish.imageUrl,
        is_manifested: false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding wish:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      target_date: data.target_date,
      progress: data.progress,
      isManifested: data.is_manifested,
      imageUrl: data.image_url,
      createdAt: new Date(data.created_at).getTime(),
    };
  },

  async updateWish(id: string, updates: Partial<Wish>): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    // Map frontend fields to DB snake_case
    const dbUpdates: any = {};
    if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
    if (updates.isManifested !== undefined) dbUpdates.is_manifested = updates.isManifested;
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.imageUrl) dbUpdates.image_url = updates.imageUrl;

    const { error } = await supabase
      .from(TABLE_NAME)
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating wish:', error);
      return false;
    }
    return true;
  },

  async deleteWish(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting wish:', error);
      return false;
    }
    return true;
  }
};
