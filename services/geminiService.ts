import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to extract mime type from base64 string
const getMimeType = (base64: string): string => {
  const match = base64.match(/^data:(.*);base64,/);
  return match ? match[1] : 'image/jpeg';
};

// Helper to strip base64 prefix if present
const stripBase64Prefix = (base64: string): string => {
  if (base64.includes('base64,')) {
    return base64.split('base64,')[1];
  }
  return base64;
};

export const generateHeadshot = async (
  originalImageBase64: string,
  stylePrompt: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';
    
    const mimeType = getMimeType(originalImageBase64);
    const cleanBase64 = stripBase64Prefix(originalImageBase64);

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: `Transform this casual selfie into a professional headshot. Maintain the person's facial identity and features strictly. Style instructions: ${stylePrompt}. Output only the image.`
          }
        ]
      }
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const outputMimeType = part.inlineData.mimeType || 'image/jpeg';
          return `data:${outputMimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error('No image generated in response');

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const generateRemixHeadshot = async (
  selfieBase64: string,
  styleReferenceBase64: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';
    
    // Prepare Selfie
    const selfieMime = getMimeType(selfieBase64);
    const selfieData = stripBase64Prefix(selfieBase64);
    
    // Prepare Style Ref
    const styleMime = getMimeType(styleReferenceBase64);
    const styleData = stripBase64Prefix(styleReferenceBase64);

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: selfieMime,
              data: selfieData
            }
          },
          {
            inlineData: {
              mimeType: styleMime,
              data: styleData
            }
          },
          {
            text: `Generate a professional headshot. 
            Instructions:
            1. Use the FACE, HAIR, and IDENTITY from the FIRST image (selfie).
            2. Use the STYLE, BACKGROUND, LIGHTING, and CLOTHING from the SECOND image (reference).
            3. Blend them seamlessly so the person from the first image looks like they are in the second image.
            4. High quality, photorealistic, 8k resolution. Output only the image.`
          }
        ]
      }
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const outputMimeType = part.inlineData.mimeType || 'image/jpeg';
          return `data:${outputMimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error('No image generated in remix response');

  } catch (error) {
    console.error("Gemini Remix Error:", error);
    throw error;
  }
};

export const editImageWithPrompt = async (
  imageBase64: string,
  editPrompt: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';
    const mimeType = getMimeType(imageBase64);
    const cleanBase64 = stripBase64Prefix(imageBase64);

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: `Edit this image based on the following instruction: ${editPrompt}. Maintain the professional quality.`
          }
        ]
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const outputMimeType = part.inlineData.mimeType || 'image/jpeg';
          return `data:${outputMimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error('No image generated during edit');

  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};