// Next.js API route for Replicate SDXL image generation
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
  const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
  const REPLICATE_MODEL_VERSION = 'a9758cb8e1e6e0e2e3e1e7e1e7e1e7e1e7e1e7e1e7e1e7e1e7e1e7e1e7e1e7';

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    // Start prediction
    const predictionRes = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: REPLICATE_MODEL_VERSION,
        input: { prompt },
      }),
    });
    if (!predictionRes.ok) {
      const errorText = await predictionRes.text();
      return res.status(predictionRes.status).json({ error: errorText });
    }
    let prediction = await predictionRes.json();

    // Poll for completion
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(r => setTimeout(r, 2000));
      const pollRes = await fetch(`${REPLICATE_API_URL}/${prediction.id}`, {
        headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` },
      });
      prediction = await pollRes.json();
    }

    if (prediction.status === 'succeeded') {
      return res.status(200).json({ imageUrl: prediction.output[0] });
    } else {
      return res.status(500).json({ error: 'Image generation failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
