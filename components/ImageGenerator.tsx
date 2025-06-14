
import React, { useState, useCallback } from 'react';
import { generateImageFromPrompt, ImageAspectRatio } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { ImageIcon } from './icons/ImageIcon';
import { DownloadIcon } from './icons/DownloadIcon'; // New Icon

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('1:1'); // Updated initial state

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate image(s).');
      return;
    }
    if (!process.env.API_KEY) { 
      setError('API_KEY is not configured. Please set it in your environment.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrls(null);

    try {
      const generatedImageUrls = await generateImageFromPrompt(prompt, numberOfImages, aspectRatio);
      setImageUrls(generatedImageUrls);
    } catch (err) {
      console.error('Image generation failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, numberOfImages, aspectRatio]);

  const handleDownloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    // Sanitize prompt for filename
    const safePrompt = prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_').replace(/_{2,}/g, '_');
    link.download = `ai_image_${index + 1}_${safePrompt}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center space-y-6 h-full">
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
            className="w-full p-4 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow shadow-sm placeholder-slate-400"
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
              onChange={(e) => setNumberOfImages(Math.max(1, Math.min(4, parseInt(e.target.value, 10) || 1)))}
              min="1"
              max="4" // Updated max to 4
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
              disabled={isLoading}
              aria-label="Number of images to generate (1-4)" // Updated ARIA label
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
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 shadow-sm appearance-none bg-no-repeat bg-right pr-8"
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
        disabled={isLoading || !prompt.trim()}
        className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
        aria-label="Generate images based on prompt and settings"
      >
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <MagicWandIcon className="w-6 h-6 mr-2" />
        )}
        Generate Image{numberOfImages > 1 ? 's' : ''}
      </button>

      {error && (
        <div role="alert" className="mt-4 p-4 bg-red-800/50 border border-red-700 text-red-200 rounded-lg w-full max-w-2xl text-center">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && !imageUrls && (
         <div className="mt-6 flex flex-col items-center justify-center text-slate-400 w-full max-w-4xl p-6 bg-slate-700/50 rounded-xl shadow-inner">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-lg">Generating your masterpiece{numberOfImages > 1 ? 's' : ''}...</p>
         </div>
      )}

      {imageUrls && imageUrls.length > 0 && !error && (
        <div className="mt-6 w-full max-w-4xl">
          <h3 className="text-xl font-semibold text-slate-200 mb-4 text-center">Generated Image{imageUrls.length > 1 ? 's' : ''}:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group bg-slate-700/30 p-2 rounded-lg shadow-md">
                <img
                  src={url}
                  alt={`Generated AI image ${index + 1} from prompt: ${prompt}`}
                  className="rounded-md w-full h-auto object-contain aspect-square"
                />
                <button
                  onClick={() => handleDownloadImage(url, index)}
                  className="absolute top-3 right-3 p-2 bg-slate-800/70 hover:bg-sky-600 text-white rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
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

      {!isLoading && (!imageUrls || imageUrls.length === 0) && !error && (
        <div className="mt-6 flex flex-col items-center justify-center text-slate-500 w-full max-w-2xl aspect-video bg-slate-700/30 rounded-xl shadow-inner border-2 border-dashed border-slate-600 p-6">
            <ImageIcon className="w-20 h-20 text-slate-600 mb-4" />
            <p className="text-lg text-center">Your generated image{numberOfImages > 1 ? 's' : ''} will appear here.</p>
         </div>
      )}

    </div>
  );
};

export default ImageGenerator;