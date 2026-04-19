export interface IOCRProvider {
  extractText(imagePath: string): Promise<string>;
}
