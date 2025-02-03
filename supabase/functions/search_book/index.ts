import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { DOMParser } from "jsr:@b-fuze/deno-dom";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GutenbergMetadata {
    author?: string;
    title?: string;
    notes?: string[];
    summary?: string;
    language?: string;
    locClass?: string;
    subjects?: string[];
    category?: string;
    ebookNo?: string;
    releaseDate?: string;
    lastUpdated?: string;
    copyrightStatus?: string;
    downloads?: number;
    readingEase?: number;
    [key: string]: string | string[] | number | undefined;
}

async function scrapeGutenbergMetadata(html: string): Promise<GutenbergMetadata> {
    const metadata: GutenbergMetadata = {
        notes: [],
        subjects: []
    };

    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    const aboutSection = Array.from(doc.querySelectorAll('h2')).find(
        el => el.textContent?.includes('About this eBook')
    );
    
    if (!aboutSection) {
        throw new Error('Could not find About this eBook section');
    }

    let currentElement = aboutSection.nextElementSibling;
    while (currentElement && currentElement.tagName !== 'TABLE') {
        currentElement = currentElement.nextElementSibling;
    }

    if (!currentElement) {
        throw new Error('Could not find metadata table');
    }

    const metadataTable = currentElement;
    const rows = metadataTable.querySelectorAll('tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length >= 2) {
            let key = cells[0].textContent?.trim() || '';
            const value = cells[1].textContent?.trim() || '';

            key = key.replace(/[\*:]/g, '').trim();

            key = key.toLowerCase()
                .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
                    index === 0 ? letter.toLowerCase() : letter.toUpperCase())
                .replace(/\s+/g, '');

            switch (key) {
                case 'author':
                    metadata[key] = value.trim();
                    break;

                case 'note':
                    (metadata.notes as string[]).push(value);
                    
                    const readingEaseMatch = value.match(/Reading ease score: ([\d.]+)/);
                    if (readingEaseMatch) {
                        metadata.readingEase = parseFloat(readingEaseMatch[1]);
                    }
                    break;

                case 'subject':
                    (metadata.subjects as string[]).push(value);
                    break;

                case 'downloads':
                    const downloadsMatch = value.match(/(\d+)/);
                    metadata[key] = downloadsMatch ? parseInt(downloadsMatch[0]) : 0;
                    break;

                case 'locClass':
                    metadata.locClass = value;
                    break;

                case 'ebookNo':
                    metadata.ebookNo = value;
                    break;

                case 'releaseDate':
                    metadata.releaseDate = value;
                    break;

                case 'lastUpdated':
                    metadata.lastUpdated = value;
                    break;

                case 'copyrightStatus':
                    metadata.copyrightStatus = value;
                    break;

                case 'summary':
                    metadata.summary = value.trim();
                    break;

                default:
                    metadata[key] = value;
            }
        }
    });

    return metadata;
}

export async function fetchAndScrapeGutenberg(ebookId: string | number): Promise<GutenbergMetadata> {
    const url = `https://www.gutenberg.org/ebooks/${ebookId}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ebook: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        return await scrapeGutenbergMetadata(html);
        
    } catch (error) {
        throw new Error(`Failed to fetch metadata: ${error.message}`);
    }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const body = await req.json()
  const data = await fetchAndScrapeGutenberg(body.book_id);

  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})
