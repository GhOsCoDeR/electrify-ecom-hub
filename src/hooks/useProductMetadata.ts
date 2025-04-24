
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ProductMetadata {
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
  isLoading: boolean;
  error: Error | null;
}

export const useProductMetadata = (): ProductMetadata => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          supabase.from('product_categories').select('*').order('name'),
          supabase.from('product_brands').select('*').order('name')
        ]);

        if (categoriesResponse.error) throw categoriesResponse.error;
        if (brandsResponse.error) throw brandsResponse.error;

        setCategories(categoriesResponse.data);
        setBrands(brandsResponse.data);
      } catch (err) {
        console.error('Error fetching product metadata:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch product metadata'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return { categories, brands, isLoading, error };
};
