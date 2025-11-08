import { NextRequest, NextResponse } from "next/server";

const MODEL = "gemini-2.5-flash";

function buildPrompt(title: string, description: string) {
  return `You are an e-commerce product content generator. Generate a valid JSON object for a product form.

CRITICAL RULES:
- Return ONLY valid JSON, no markdown, no code blocks, no explanations
- No trailing commas in arrays or objects
- All strings must be properly escaped
- Use double quotes for all keys and string values

Return JSON with this exact structure:
{
  "name": string,
  "shortDescription": string,
  "longDescription": [
    { "id": number, "type": "text", "content": string },
    { "id": number, "type": "feature", "content": string }
  ],
  "price": string,
  "comparePrice": string,
  "sku": string,
  "brand": string,
  "tags": string[],
  "seo": { "title": string, "description": string, "slug": string },
  "inventory": { "quantity": string, "lowStockThreshold": string, "trackQuantity": boolean },
  "shipping": { "weight": string, "dimensions": { "length": string, "width": string, "height": string }, "requiresShipping": boolean },
  "specifications": [ { "id": number, "key": string, "value": string } ]
}

Constraints:
- price, comparePrice, weight, dimensions are numeric strings.
- longDescription must include 2-6 blocks. Use incremental numeric ids starting at 1.
- specifications length 3-10. Use incremental numeric ids starting at 1.
- slug must be URL-friendly kebab-case from name.

Input Title: ${title}
Input Description: ${description}`;
}

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;
    
    console.log('API Key exists:', !!apiKey);
    console.log('Title:', title);
    console.log('Description:', description);
    
    if (!apiKey) {
      console.error('GOOGLE_API_KEY is missing from environment variables');
      return NextResponse.json({ success: false, message: "Server missing GOOGLE_API_KEY" }, { status: 500 });
    }

    const prompt = buildPrompt(String(title || "").slice(0, 200), String(description || "").slice(0, 1200));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Gemini API error:', resp.status, txt);
      return NextResponse.json({ success: false, message: "Gemini API error", detail: txt }, { status: 500 });
    }

    const data = await resp.json();
    console.log('Gemini response received');
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log('Extracted text length:', text.length);
    
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```json\n?/i, '');
    cleaned = cleaned.replace(/^```\n?/, '');
    cleaned = cleaned.replace(/\n?```$/, '');
    cleaned = cleaned.trim();

    let parsed: any = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError: any) {
      console.error('First parse attempt failed:', parseError.message);
      try {
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        }
      } catch (secondError: any) {
        console.error('Second parse attempt failed:', secondError.message);
        console.error('Raw text:', text.substring(0, 500));
      }
    }

    if (!parsed) {
      console.error('Failed to parse AI response. Text:', text.substring(0, 300));
      return NextResponse.json({ 
        success: false, 
        message: "Failed to parse AI response", 
        rawText: text.substring(0, 500) 
      }, { status: 500 });
    }

    console.log('Successfully generated product data');
    return NextResponse.json({ success: true, data: parsed }, { status: 200 });
  } catch (e: any) {
    console.error('Route error:', e);
    return NextResponse.json({ success: false, message: e?.message || "Server error", stack: e?.stack }, { status: 500 });
  }
}
