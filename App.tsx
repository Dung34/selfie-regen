import React, { useState, useEffect } from 'react';
import { HEADSHOT_STYLES } from './constants';
import { StyleOption, ProcessingState } from './types';
import { generateHeadshot, editImageWithPrompt, generateRemixHeadshot } from './services/geminiService';
import { Button } from './components/Button';
import { FileUpload } from './components/FileUpload';

// Icons
const UploadIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const MagicIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const CheckIcon = () => <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const RefreshIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;

type GenerationMode = 'preset' | 'remix';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [remixImage, setRemixImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('preset');
  const [processing, setProcessing] = useState<ProcessingState>({ status: 'idle' });
  const [editPrompt, setEditPrompt] = useState<string>("");
  
  // Convert File to Base64 (Selfie)
  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setGeneratedImage(null); // Reset generated on new upload
      setProcessing({ status: 'idle' });
    };
    reader.readAsDataURL(file);
  };

  // Convert File to Base64 (Remix/Style Reference)
  const handleRemixFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setRemixImage(reader.result as string);
      // We don't necessarily need to reset generated image here unless user wants to
    };
    reader.readAsDataURL(file);
  };

  // Generate Headshot
  const handleGenerate = async () => {
    if (!originalImage) return;
    
    // Validation based on mode
    if (generationMode === 'preset' && !selectedStyle) return;
    if (generationMode === 'remix' && !remixImage) return;

    setProcessing({ 
      status: 'generating', 
      message: generationMode === 'preset' ? 'Analyzing facial features...' : 'Blending images...' 
    });

    try {
      let result;
      if (generationMode === 'preset' && selectedStyle) {
        result = await generateHeadshot(originalImage, selectedStyle.promptModifier);
      } else if (generationMode === 'remix' && remixImage) {
        result = await generateRemixHeadshot(originalImage, remixImage);
      }

      if (result) {
        setGeneratedImage(result);
        setProcessing({ status: 'success' });
      } else {
        throw new Error("No image returned");
      }
    } catch (error) {
      setProcessing({ status: 'error', message: 'Generation failed. Please try again.' });
    }
  };

  // Edit Image with Text Prompt
  const handleEdit = async () => {
    if (!generatedImage || !editPrompt.trim()) return;

    setProcessing({ status: 'editing', message: 'Applying edits...' });
    try {
      // Use the generated image as the base for editing
      const result = await editImageWithPrompt(generatedImage, editPrompt);
      setGeneratedImage(result);
      setEditPrompt(""); // Clear input
      setProcessing({ status: 'success' });
    } catch (error) {
      setProcessing({ status: 'error', message: 'Edit failed. Please try again.' });
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setRemixImage(null);
    setGeneratedImage(null);
    setSelectedStyle(null);
    setProcessing({ status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <span className="font-semibold text-lg text-gray-900 tracking-tight">HeadshotPro <span className="text-gray-400 font-normal">Enterprise</span></span>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">System Status: Online</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Step 1: Upload */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 className="font-medium text-gray-900">1. Source Image</h2>
                {originalImage && <button onClick={handleReset} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear</button>}
              </div>
              <div className="p-5">
                {!originalImage ? (
                  <FileUpload onFileSelect={handleFileSelect} title="Upload Selfie" />
                ) : (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-square">
                    <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 text-center">
                      Original Source
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Style Selection */}
            <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-opacity duration-300 ${!originalImage ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="border-b border-gray-100 bg-gray-50">
                 <div className="flex">
                    <button 
                      onClick={() => setGenerationMode('preset')}
                      className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${generationMode === 'preset' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                      2. Preset Styles
                    </button>
                    <button 
                      onClick={() => setGenerationMode('remix')}
                      className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${generationMode === 'remix' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                      2. Image Remix
                    </button>
                 </div>
              </div>
              
              <div className="p-5">
                {generationMode === 'preset' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {HEADSHOT_STYLES.map((style) => (
                      <div 
                        key={style.id}
                        onClick={() => setSelectedStyle(style)}
                        className={`cursor-pointer border rounded-md p-3 transition-all ${selectedStyle?.id === style.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                      >
                        <div className={`h-8 w-full rounded mb-2 ${style.thumbnailClass}`}></div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-gray-900 leading-tight">{style.name}</h3>
                          {selectedStyle?.id === style.id && <CheckIcon />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{style.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Upload a reference image (e.g., a specific office background, a specific pose, or a style you want to copy). We will blend your selfie into this style.</p>
                    
                    {!remixImage ? (
                      <FileUpload 
                        onFileSelect={handleRemixFileSelect} 
                        title="Upload Reference Image" 
                        compact 
                      />
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-video group">
                        <img src={remixImage} alt="Remix Ref" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="secondary" onClick={() => setRemixImage(null)}>Change Image</Button>
                         </div>
                         <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Style Reference</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button 
                  onClick={handleGenerate} 
                  disabled={
                    processing.status === 'generating' || 
                    (generationMode === 'preset' && !selectedStyle) || 
                    (generationMode === 'remix' && !remixImage)
                  }
                  isLoading={processing.status === 'generating'}
                  className="w-full"
                >
                  {processing.status === 'generating' ? 'Processing...' : 'Generate Headshot'}
                </Button>
              </div>
            </div>

          </div>

          {/* Right Column: Result & Refinement */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[600px] flex flex-col">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 className="font-medium text-gray-900">3. Result Preview</h2>
                {generatedImage && (
                  <Button variant="outline" size="sm" onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedImage;
                      link.download = `headshot-${Date.now()}.jpg`;
                      link.click();
                  }}>
                    Download HD
                  </Button>
                )}
              </div>
              
              <div className="flex-1 p-8 flex items-center justify-center bg-gray-100/50">
                {!generatedImage ? (
                  <div className="text-center text-gray-400 max-w-sm">
                    {processing.status === 'generating' ? (
                      <div className="flex flex-col items-center">
                         <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-600 font-medium">Generating your headshot...</p>
                        <p className="text-sm text-gray-400 mt-2">{processing.message}</p>
                      </div>
                    ) : processing.status === 'error' ? (
                        <div className="text-red-500">
                            <p className="font-medium">Error Occurred</p>
                            <p className="text-sm">{processing.message}</p>
                        </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                           <UploadIcon />
                        </div>
                        <p>Upload a selfie and {generationMode === 'remix' ? 'a style reference' : 'select a style'} to generate your professional headshot.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full max-w-md shadow-lg rounded-lg overflow-hidden group">
                     <img src={generatedImage} alt="Generated Headshot" className="w-full h-auto" />
                     {processing.status === 'editing' && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <p className="text-sm font-medium text-blue-900 mt-2">Refining image...</p>
                            </div>
                        </div>
                     )}
                  </div>
                )}
              </div>

              {/* Nano Banana Editing Feature */}
              {generatedImage && (
                <div className="border-t border-gray-200 bg-white p-5">
                   <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                     <MagicIcon />
                     AI Refinement (Gemini Flash Image)
                   </h3>
                   <div className="flex gap-2">
                     <input 
                        type="text" 
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="E.g., 'Add a retro filter', 'Make the background brighter', 'Remove glasses'"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                     />
                     <Button 
                        onClick={handleEdit}
                        disabled={!editPrompt.trim() || processing.status === 'editing'}
                        variant="secondary"
                     >
                        Apply Edit
                     </Button>
                   </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;