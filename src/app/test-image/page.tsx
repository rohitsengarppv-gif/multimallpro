'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function TestImagePage() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<{ main: string; gallery: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setImages(null);

      const response = await fetch('/api/ai/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to generate images');
      }

      setImages(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate images');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Image Generator Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test the Hugging Face Stable Diffusion image generation
          </p>

          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your prompt
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g., Wireless Bluetooth Headphones"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                  loading || !prompt.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Images'
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              💡 Tip: Be specific! e.g., "Professional product photo of wireless headphones, white background, studio lighting"
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">❌ Error: {error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse">
                <div className="text-6xl mb-4">🎨</div>
                <p className="text-xl font-semibold text-gray-700">
                  Generating your images...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This may take 10-30 seconds
                </p>
              </div>
            </div>
          )}

          {/* Images Display */}
          {images && !loading && (
            <div className="space-y-8">
              {/* Main Image */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Main Product Image
                </h2>
                <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
                  <img
                    src={images.main}
                    alt="Main generated product"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    style={{ maxHeight: '500px' }}
                  />
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Gallery Images
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {images.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 rounded-xl p-4 flex items-center justify-center"
                    >
                      <img
                        src={img}
                        alt={`Gallery image ${idx + 1}`}
                        className="max-w-full h-auto rounded-lg shadow-lg"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Section */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  ✨ <strong>Success!</strong> Images generated successfully. You can right-click on any image to save it.
                </p>
              </div>
            </div>
          )}

          {/* Initial State */}
          {!images && !loading && !error && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-8xl mb-4">🖼️</div>
              <p className="text-xl">Enter a prompt above to generate images</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            How it works
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">1.</span>
              <span>Enter a product description or prompt</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">2.</span>
              <span>Click "Generate Images" to create 4 AI-generated product photos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">3.</span>
              <span>Uses Hugging Face Stable Diffusion 2.1 (free tier)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">4.</span>
              <span>Falls back to placeholder images if API key is not configured</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
