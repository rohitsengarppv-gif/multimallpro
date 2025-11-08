import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    
    console.log('Image generation request for:', prompt);
    
    if (!hfApiKey) {
      console.warn('HUGGINGFACE_API_KEY is missing, using placeholder images');
      const seedBase = encodeURIComponent(String(prompt || "product"));
      const main = `https://picsum.photos/seed/${seedBase}-main/900/900`;
      const gallery = [
        `https://picsum.photos/seed/${seedBase}-g1/800/800`,
        `https://picsum.photos/seed/${seedBase}-g2/800/800`,
        `https://picsum.photos/seed/${seedBase}-g3/800/800`
      ];
      return NextResponse.json({ success: true, data: { main, gallery } }, { status: 200 });
    }

    const imagePrompts = [
      `Professional product photography of ${prompt}, main hero shot, white background, high quality, 4k, studio lighting`,
      `${prompt} product image, side angle view, studio lighting, white background, commercial photography`,
      `${prompt} product detail shot, close-up view, professional photography, white background`,
      `${prompt} lifestyle product photo, in use context, natural lighting, professional`
    ];

    const imageUrls: string[] = [];
    const MODEL_ID = "stabilityai/stable-diffusion-2-1";

    for (const imgPrompt of imagePrompts) {
      try {
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${MODEL_ID}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hfApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: imgPrompt,
              parameters: {
                negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy",
                num_inference_steps: 30,
                guidance_scale: 7.5,
              }
            })
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const buffer = await blob.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          imageUrls.push(`data:image/jpeg;base64,${base64}`);
          console.log(`Generated image ${imageUrls.length}/4`);
        } else {
          const errorText = await response.text();
          console.error('Image generation failed:', response.status, errorText);
          const seedBase = encodeURIComponent(String(prompt || "product"));
          imageUrls.push(`https://picsum.photos/seed/${seedBase}-${imageUrls.length}/800/800`);
        }
      } catch (imgError) {
        console.error('Error generating image:', imgError);
        const seedBase = encodeURIComponent(String(prompt || "product"));
        imageUrls.push(`https://picsum.photos/seed/${seedBase}-${imageUrls.length}/800/800`);
      }
    }

    const [main, ...gallery] = imageUrls;
    console.log('Generated images:', imageUrls.length);
    
    return NextResponse.json({ 
      success: true, 
      data: { main, gallery } 
    }, { status: 200 });
    
  } catch (e: any) {
    console.error('Route error:', e);
    return NextResponse.json({ success: false, message: e?.message || "Server error" }, { status: 500 });
  }
}
