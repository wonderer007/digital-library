'use server'
 
import { supabase } from '../lib/supabase';

export async function searchBook(bookId: string) {
  try {
      const { data, error } = await supabase.functions.invoke('search_book', {
        body: { book_id: bookId }
      });

    if (error || !data)
      return null;

    return data;
  } catch (error) {
    console.error('Error fetching book:', error);
    return null
  }
}
