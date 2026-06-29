export interface GenerationResponse {
  imageUrl: string;
  feedback?: string;
  error?: string;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface GenerationState {
  prompt: string;
  aspectRatio: AspectRatio;
  isGenerating: boolean;
  result: GenerationResponse | null;
}
