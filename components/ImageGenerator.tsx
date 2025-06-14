import React, { useState, useCallback } from 'react';
// Assuming generateImageFromPrompt is updated to accept the API key
import { generateImageFromPrompt, ImageAspectRatio } from '../services/geminiService'; 
import LoadingSpinner from './LoadingSpinner';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { ImageIcon } from './icons/ImageIcon';
import { DownloadIcon } from './icons/DownloadIcon';

// Define the expected environment variable name
const GEMINI_API_KEY_ENV_VAR = process.env.REACT_APP_GEMINI_API_KEY; // Access key from .env.local


const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('1:1');

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate image(s).');
      return;
    }

    // --- Updated API Key Check ---
    if (!GEMINI_API_KEY_ENV_VAR) {
      setError('Gemini API key is not configured. Ensure REACT_APP_GEMINI_API_KEY is set in your .env.local file.');
      // No need to setIsloading(false) here as it's not set to true yet
      return;
    }
    // ----------------------------

    setIsLoading(true);
    setError(null);
    setImageUrls(null);

    try {
      // --- Pass API key to the service function ---
      // You MUST update '../services/geminiService.ts' to accept this key
      const generatedImageUrls = await generateImageFromPrompt(
        GEMINI_API_KEY_ENV_VAR, // Pass the key
        prompt,
        numberOfImages,
        aspectRatio
      );
      // --------------------------------------------

      setImageUrls(generatedImageUrls);
    } catch (err) {
      console.error('Image generation failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, numberOfImages, aspectRatio]); // Dependencies are correct

  // --- Updated Download Logic to infer Extension ---
  const handleDownloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;

    // Try to determine extension from data URL MIME type
    let extension = '.jpeg'; // Default or fallback
    const mimeMatch = imageUrl.match(/^data:image\/(\w+);base64,/);
    if (mimeMatch && mimeMatch[1]) {
      extension = '.' + mimeMatch[1].toLowerCase();
      // Simple mapping for common types if needed (e.g., jpg -> jpeg)
      if (extension === '.jpg') extension = '.jpeg'; 
    } else {
        // Fallback for non-data URLs if necessary, could parse URL path
        // or default to .jpeg
        console.warn("Could not determine file extension from image URL, defaulting to .jpeg");
    }

    // Sanitize prompt for filename (improved regex)
    const safePrompt = prompt
      .substring(0, 40) // Take a bit more of the prompt, adjust as needed
      .replace(/[^\w\s-]/g, '') // Remove characters not word, space, or hyphen
      .trim() // Trim leading/trailing spaces
      .replace(/\s+/g, '_'); // Replace spaces with underscores
      
    // Ensure filename isn't empty after sanitization
    const finalSafePrompt = safePrompt.length > 0 ? safePrompt : 'generated';

    link.download = `ai_image_${index + 1}_${finalSafePrompt}${extension}`;

    // Append to body, click, and remove - standard download method
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // --------------------------------------------------


  return (
    <div className="flex flex-col items-center space-y-6 h-full min-h-screen py-8 px-4"> {/* Added padding and min-h */}
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-lg font-medium text-slate-300 mb-2">
            Enter your creative prompt:
          </label>
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A futuristic cityscape at sunset, neon lights, flying cars"
            className="w-full p-4 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow shadow-sm placeholder-slate-400 disabled:opacity-70 disabled:cursor-not-allowed" // Added disabled styles
            disabled={isLoading}
            aria-label="Creative prompt for image generation"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="numberOfImages" className="block text-sm font-medium text-slate-300 mb-1">
              Number of Images:
            </label>
            <input
              type="number"
              id="numberOfImages"
              value={numberOfImages}
              // Clamp value between 1 and 4
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setNumberOfImages(Math.max(1, Math.min(4, isNaN(value) ? 1 : value)));
              }}
              min="1"
              max="4"
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed" // Added disabled styles
              disabled={isLoading}
              aria-label="Number of images to generate (1-4)"
            />
          </div>
          <div>
            <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-300 mb-1">
              Aspect Ratio:
            </label>
            <select
              id="aspectRatio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as ImageAspectRatio)}
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 shadow-sm appearance-none bg-no-repeat bg-right pr-8 disabled:opacity-70 disabled:cursor-not-allowed" // Added disabled styles
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em' }}
              disabled={isLoading}
              aria-label="Aspect ratio for generated images"
            >
              <option value="1:1">Square (1:1)</option>
              <option value="9:16">Portrait (9:16)</option>
              <option value="16:9">Landscape (16:9)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerateImage}
        disabled={isLoading || !prompt.trim() || !GEMINI_API_KEY_ENV_VAR} // Disable if API key is missing
        className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 min-w-[200px]" // Added min-width
        aria-label={`Generate ${numberOfImages} image${numberOfImages > 1 ? 's' : ''} based on prompt and settings`} // More specific ARIA label
      >
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <MagicWandIcon className="w-6 h-6 mr-2" />
        )}
        {isLoading ? 'Generating...' : `Generate Image${numberOfImages > 1 ? 's' : ''}`} {/* Button text changes while loading */}
      </button>

      {error && (
        <div role="alert" className="mt-4 p-4 bg-red-800/50 border border-red-700 text-red-200 rounded-lg w-full max-w-2xl text-center">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && !imageUrls && ( // Only show if loading and no images are loaded yet
         <div role="status" aria-live="polite" className="mt-6 flex flex-col items-center justify-center text-slate-400 w-full max-w-4xl p-6 bg-slate-700/50 rounded-xl shadow-inner">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-lg text-center">Generating your masterpiece{numberOfImages > 1 ? 's' : ''}...</p>
         </div>
      )}

      {imageUrls && imageUrls.length > 0 && !error && (
        <div className="mt-6 w-full max-w-4xl">
          <h3 className="text-xl font-semibold text-slate-200 mb-4 text-center">Generated Image{imageUrls.length > 1 ? 's' : ''}:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group bg-slate-700/30 p-2 rounded-lg shadow-md overflow-hidden"> {/* Added overflow-hidden */}
                <img
                  src={url}
                  alt={`Generated AI image ${index + 1} from prompt: ${prompt}`}
                  // Adjusted aspect ratio class based on state
                  className={`rounded-md w-full h-auto object-cover ${
                    aspectRatio === '1:1' ? 'aspect-square' :
                    aspectRatio === '9:16' ? 'aspect-[9/16]' :
                    'aspect-[16/9]' // Default to 16:9 if something unexpected happens
                  }`}
                  loading="lazy" // Improve performance for multiple images
                />
                <button
                  onClick={() => handleDownloadImage(url, index)}
                  className="absolute top-3 right-3 p-2 bg-slate-800/70 hover:bg-sky-600 text-white rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10" // Added z-index
                  title="Download image"
                  aria-label={`Download image ${index + 1}`}
                >
                  <DownloadIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && (!imageUrls || imageUrls.length === 0) && !error && ( // Only show when not loading, no images, and no error
        <div className="mt-6 flex flex-col items-center justify-center text-slate-500 w-full max-w-2xl aspect-video bg-slate-700/30 rounded-xl shadow-inner border-2 border-dashed border-slate-600 p-6 text-center"> {/* Added text-center */}
            <ImageIcon className="w-20 h-20 text-slate-600 mb-4" />
            <p className="text-lg">Your generated image{numberOfImages > 1 ? 's' : ''} will appear here.</p>
         </div>
      )}

    </div>
  );
};

export default ImageGenerator;