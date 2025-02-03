import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

async function fetchBookContent(book_id: number) {
  const url = `https://www.gutenberg.org/files/${book_id}/${book_id}-0.txt`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SupabaseFunction/1.0)" }
    });

    if (!response.ok) throw new Error(`Failed to fetch book. Status: ${response.status}`);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/plain")) {
      throw new Error(`Unexpected content type: ${contentType}`);
    }

    const content = await response.text();

    const { error } = await supabase
      .from("books")
      .update({ content })
      .eq("gutenberg_id", book_id);

    if (error) throw new Error(`Error updating book: ${error.message}`);

    return new Response(JSON.stringify({ success: true, book_id }), { status: 200 });

  } catch (error) {
    console.error("Fetch error:", error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

Deno.serve(async (req) => {
  try {
    const { record } = await req.json(); 
    if (!record || !record.gutenberg_id) throw new Error('Invalid request data');

    return await fetchBookContent(record.gutenberg_id);
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
});
