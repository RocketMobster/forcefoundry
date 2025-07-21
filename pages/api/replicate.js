// ===================================================================
// TEMPORARILY DISABLED: AI PORTRAIT GENERATION
// ===================================================================
// This API endpoint is currently disabled due to issues with the Replicate API
// and associated costs. The feature may be re-enabled in a future update.
//
// Original issues:
// - AI image generation is broken due to Replicate API/version requirements for official models
// - The Node.js client returns empty output, and the HTTP API requires a hidden version hash
// - Additional expenses related to API usage
//
// The code is preserved for future restoration if needed.
// ===================================================================

import fetch from "node-fetch";

export default async function handler(req, res) {
  // Return disabled message regardless of request method
  return res.status(503).json({ 
    error: "AI portrait generation is temporarily disabled", 
    message: "This feature is currently disabled due to API limitations and associated costs. It may be restored in a future update."
  });

  // Original implementation preserved below
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
  const REPLICATE_MODEL = "google/imagen-4-fast";

  // Accept extra params for flexibility
  let { prompt, aspect_ratio, seed, image_reference_url, style_reference_url, image_reference_weight, style_reference_weight, character_reference_url } = req.body;
  if (!prompt) {
    prompt = "A portrait of a person, professional character art, space opera style";
  }
  // Remove 'Star Wars' (case-insensitive) from the prompt
  prompt = prompt.replace(/star\s*wars/gi, '').replace(/\s{2,}/g, ' ').trim();
  // Build input for google/imagen-4-fast
  const input = {
    prompt,
    aspect_ratio: aspect_ratio && typeof aspect_ratio === 'string' ? aspect_ratio : '1:1',
    output_format: 'jpg',
    safety_filter_level: 'block_only_high'
  };

  try {
    // Use Replicate HTTP API endpoint
    const url = `https://api.replicate.com/v1/predictions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: undefined, // Let Replicate use the default version
        input,
        model: REPLICATE_MODEL
      })
    });
    const prediction = await response.json();
    console.log("Replicate API input:", JSON.stringify(input));
    console.log("Replicate API prediction (initial):", JSON.stringify(prediction));
    // If the initial prediction has an error, return it
    if (prediction.error || prediction.detail || prediction.message) {
      return res.status(500).json({ error: prediction.error || prediction.detail || prediction.message, prediction });
    }
    // Poll for completion if needed
    let output = prediction.output;
    let status = prediction.status;
    let predictionId = prediction.id;
    let pollCount = 0;
    while ((!output || output.length === 0) && status !== 'failed' && status !== 'canceled' && pollCount < 20) {
      await new Promise(r => setTimeout(r, 1500));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { "Authorization": `Token ${REPLICATE_API_TOKEN}` }
      });
      const pollData = await pollRes.json();
      console.log(`Replicate API pollData (poll #${pollCount + 1}):`, JSON.stringify(pollData));
      if (pollData.error || pollData.detail || pollData.message) {
        return res.status(500).json({ error: pollData.error || pollData.detail || pollData.message, pollData });
      }
      output = pollData.output;
      status = pollData.status;
      pollCount++;
    }
    if (typeof output === 'string' && output.startsWith('http')) {
      return res.status(200).json({ imageUrl: output, rawOutput: output });
    } else {
      console.error("Replicate API returned unexpected output", { input, output, prediction });
      return res.status(500).json({ error: "Image generation failed: Unexpected output from Replicate API.", rawOutput: output, prediction });
    }
  } catch (error) {
    console.error("Replicate API error", { input, error: error.message, stack: error.stack });
    return res.status(500).json({ error: error.message || "Unknown error", details: error.stack });
  }
}
