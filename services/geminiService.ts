
import { GoogleGenAI, GenerateImagesResponse, GeneratedImage } from "@google/genai";

// API_KEY is expected to be available in the environment (e.g., via build tool injection for client-side)
// as per the Gemini API guidelines.
const apiKey = process.env.API_KEY; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey }); // Correct: Pass apiKey as an object property
} else {
  console.warn(
    "API_KEY is not available. Image generation will not work. Ensure process.env.API_KEY is set and accessible."
  );
}

// Define supported aspect ratios for type safety, matching typical API values
export type ImageAspectRatio = '1:1' | '9:16' | '16:9';

export const generateImageFromPrompt = async (
  prompt: string,
  numberOfImages: number,
  aspectRatio: ImageAspectRatio
): Promise<string[]> => {
  if (!ai) {
    // This error will be thrown if API_KEY was not available during initialization
    throw new Error(
      "Gemini API client is not initialized. API_KEY might be missing or not configured correctly in your environment."
    );
  }

  try {
    const requestedMimeType = 'image/jpeg'; // Define requested MIME type for fallback
    const response: GenerateImagesResponse = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002', 
      prompt: prompt,
      config: { 
        numberOfImages: numberOfImages,
        outputMimeType: requestedMimeType,
        aspectRatio: aspectRatio, // Added aspect ratio
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map((img: GeneratedImage) => {
        if (img.image?.imageBytes) {
          // Correctly access mimeType from img.image.mimeType
          // Fallback to requestedMimeType if img.image.mimeType is not available
          const mimeType = img.image?.mimeType || requestedMimeType;
          return `data:${mimeType};base64,${img.image.imageBytes}`;
        }
        // This case should ideally not happen if generatedImages has entries,
        // but it's good practice to handle potential malformed entries.
        console.warn("An image entry was found without imageBytes.");
        return ""; // Or throw an error for this specific image
      }).filter(url => url !== ""); // Filter out any empty URLs from malformed entries
    } else {
      throw new Error("No image data received from API. The response might be empty or malformed.");
    }
  } catch (error) {
    console.error("Error generating image via Gemini API:", error);
    if (error instanceof Error) {
        // More specific error handling based on potential API responses
        if (error.message.toLowerCase().includes('api key not valid') || error.message.toLowerCase().includes('permission denied')) {
             throw new Error("API key is invalid or missing required permissions. Please check your Google AI Studio API key settings.");
        }
        if (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('rate limit')) {
            throw new Error("API request limit reached. Please try again later or check your quota.");
        }
         throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};