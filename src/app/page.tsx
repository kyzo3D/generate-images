"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

const tabs = [
  { name: 'Semi-realista', endpoint: 'https://automation.civersia.com/webhook/0a2d9853-6796-47fd-b69a-3b473c43527e' },
  { name: 'Dibujo', endpoint: 'https://automation.civersia.com/webhook/07d5a34d-9bc5-4355-b78d-119b676e149b' },
  { name: 'Realista', endpoint: 'https://automation.civersia.com/webhook/e1ffd3cd-63e4-40ab-a6ad-13faf6ff1d7d' },
  { name: 'Old', endpoint: 'https://automation.civersia.com/webhook/0a2d9853-6796-47fd-b69a-3b473c43527e' },
];

function TabContent({ endpoint }: { endpoint: string }) {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await axios.post(endpoint, { prompt });
      setGeneratedImage(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error al generar la imagen: ${err.response?.data || err.message}`);
      } else {
        setError(`Error al generar la imagen: ${err instanceof Error ? err.message : String(err)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ingrese su prompt aquí..."
            className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 bg-white rounded-lg hover:bg-gray-300 text-black transition duration-300 flex items-center justify-center"
        >
          {isLoading ? 'Generando...' : 'Generar Imagen'}
          {!isLoading && <Send className="ml-2" size={18} />}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-center break-words">{error}</p>
      )}

      {generatedImage && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Imagen Generada:</h2>
          <img src={generatedImage} alt="Imagen generada" className="w-full rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}

function HomePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center">Generador de Imágenes</h1>

        <div className="flex space-x-2 mb-4">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-lg ${activeTab === index ? 'bg-blue-600' : 'bg-gray-700'
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <TabContent endpoint={tabs[activeTab].endpoint} />
      </div>
    </div>
  );
}

export default HomePage;
