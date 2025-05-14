import { Margin } from './margin.interface';

export interface PdfOptions {
  url?: string;
  htmlContent?: string;
  width?: string;
  height?: string;
  margin?: Margin;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  timeout?: number;
  emulateMedia?: 'screen' | 'print'
}
