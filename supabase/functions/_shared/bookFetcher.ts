export async function fetchBookContentFromURL(book_id: number) {
  const url = `https://www.gutenberg.org/cache/epub/${book_id}/pg${book_id}.txt`

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
    return content;
  } catch (error) {
    console.error("Fetch error:", error.message);
    return null;
  }
}