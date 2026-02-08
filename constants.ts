import { StyleOption } from './types';

export const HEADSHOT_STYLES: StyleOption[] = [
  {
    id: 'corporate-grey',
    name: 'Corporate Grey',
    description: 'Classic professional studio look with a neutral grey backdrop.',
    promptModifier: 'professional corporate headshot, wearing a tailored business suit, neutral grey studio background, soft studio lighting, high resolution, 8k, photo-realistic',
    thumbnailClass: 'bg-gray-400'
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech Office',
    description: 'Vibrant, open-plan office setting ideal for startups and tech.',
    promptModifier: 'modern professional headshot, smart casual attire, blurred modern open-plan tech office background, glass walls, bokeh, bright natural lighting, 8k',
    thumbnailClass: 'bg-blue-200'
  },
  {
    id: 'outdoor-natural',
    name: 'Outdoor Natural',
    description: 'Approachable look with soft natural lighting and greenery.',
    promptModifier: 'professional outdoor headshot, golden hour lighting, blurred park or city greenery background, approachable expression, high quality depth of field',
    thumbnailClass: 'bg-green-200'
  },
  {
    id: 'minimalist-white',
    name: 'Minimalist White',
    description: 'Clean, high-key look perfect for medical or design profiles.',
    promptModifier: 'high-key professional headshot, pure white infinite background, sharp focus, minimalist aesthetic, clean lighting',
    thumbnailClass: 'bg-white border border-gray-200'
  },
  {
    id: 'executive-dark',
    name: 'Executive Dark',
    description: 'Dramatic lighting with dark tones for a serious executive presence.',
    promptModifier: 'executive headshot, dark textured background, dramatic rim lighting, authoritative pose, deep tones, cinematic quality',
    thumbnailClass: 'bg-gray-800'
  }
];
