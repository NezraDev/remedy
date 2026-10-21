export interface ImageData {
  src: string;
  srcSmall?: string;
  smallWidth?: number;
  alt: string;
  width: number;
  height: number;
  focalPoint?: string;
  kind?: string;
}

export interface Result {
  id: string;
  title: string;
  serviceId: string;
  treatmentArea: string;
  description: string;
  before: ImageData | null;
  after: ImageData | null;
  combinedImage?: ImageData | null;
  sessionCount: number | null;
  elapsedTimeLabel: string | null;
  publishStatus: 'published' | 'review';
}
