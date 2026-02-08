export interface StyleOption {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  thumbnailClass: string;
}

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'generating' | 'editing' | 'success' | 'error';
  message?: string;
}

export interface GeneratedImage {
  id: string;
  dataUrl: string; // Base64 full string with mime type
  prompt: string;
  timestamp: number;
}