import { Response } from 'express';
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { PdfOptions } from 'src/common/interfaces/pdf-options.inteface';
import { SizePrint } from 'src/common/enums/size.enum';

/**
 * 
 * @param htmlContent 
 * @param width 
 * @returns 
 */
async function measureHeight(
  htmlContent: string,
  width: number,
): Promise<number> {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      viewport: { width: width, height: 10 },
      // screen: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      isMobile: false,
    });
    page = await context.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle' });

    const bodyHandle = await page.$('body');
    const boundingBox = await bodyHandle.boundingBox();

    return Math.ceil(boundingBox.height);
  } finally {
    await page?.close();
    await context?.close();
    await browser?.close();
  }
}

const pixelsToMillimeters = (px: number) => {
  return px / 3.77952756;
};

const millimetersToPixels = (mm: number) => {
  return mm * (96 / 25.4);
};

/**
 * Generates a PDF from a URL
 * @param url The URL to convert to PDF
 * @param options PDF generation options
 * @returns Promise with PDF buffer
 */
export const generatePDFFromURL = async ({
  url,
  width = SizePrint.A4,
  height,
  margin = { top: 0, bottom: 0, left: 0, right: 0 },
  waitUntil = 'networkidle',
  timeout = 30000,
  emulateMedia = 'screen',
}: PdfOptions): Promise<Uint8Array> => {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();

    // Configure the page
    await page.emulateMedia({ media: emulateMedia });

    // Navigate to the URL with timeout
    await page.goto(url, {
      waitUntil: waitUntil,
      timeout: timeout
    });

    // Wait for fonts to load
    await page.waitForFunction(() => document.fonts.ready);

    const pdfOptions: any = {
      printBackground: true,
      margin: margin,
    };

    // Configure PDF options based on provided dimensions
    if (width && height) {
      pdfOptions.width = `${width}mm`;
      pdfOptions.height = `${height}mm`;
    } else if (width === SizePrint.A4) {
      pdfOptions.format = SizePrint.A4;
    } else if (width) {
      // Measure the height of the content
      const bodyHandle = await page.$('body');
      const boundingBox = await bodyHandle.boundingBox();
      const heightPx = Math.ceil(boundingBox.height);
      const heightMm = pixelsToMillimeters(heightPx).toFixed(2);

      pdfOptions.width = width.includes('mm') ? width : `${width}mm`;
      pdfOptions.height = `${heightMm}mm`;
    }

    // Generate PDF
    const buffer = await page.pdf(pdfOptions);
    return buffer;
  } catch (error) {
    throw error;
  } finally {
    await page?.close();
    await context?.close();
    await browser?.close();
  }
};


/**
 * Generates a PDF from a HTML
 * @param htmlContent The HTML to convert to PDF
 * @param options PDF generation options
 * @returns Promise with PDF buffer
 */
export const generatePDFFromHTML = async ({
  htmlContent,
  width,
  height,
  margin = { top: 0, bottom: 0, left: 0, right: 0 },
}: PdfOptions): Promise<Uint8Array> => {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();

    const pdfOptions: any = {
      printBackground: true,
      margin: margin,
    };

    if (width && height) {
      await page.setContent(htmlContent, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.fonts.ready);

      pdfOptions.width = `${width}mm`;
      pdfOptions.height = `${height}mm`;
    } else if (width === SizePrint.A4) {
      await page.setContent(htmlContent, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.fonts.ready);

      pdfOptions.format = SizePrint.A4;
    } else if (width) {
      const widthPx = Math.round(
        millimetersToPixels(Number(width.replace('mm', ''))),
      );

      const heightPx = await measureHeight(htmlContent, widthPx);
      const heightMm = pixelsToMillimeters(heightPx).toFixed(2);

      await page.setContent(htmlContent, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.fonts.ready);

      pdfOptions.width = width;
      pdfOptions.height = `${heightMm}mm`;
    }

    // Generate PDF
    const buffer = await page.pdf(pdfOptions);
    return buffer;
  } catch (error) {
    throw error;
  } finally {
    await page?.close();
    await context?.close();
    await browser?.close();
  }
};

/**
 * 
 * @param res 
 * @param buffer 
 * @param fileName 
 */
export const sendPdfResponse = (
  res: Response,
  buffer: Uint8Array,
  fileName: string,
) => {
  // Codificar el nombre del archivo en formato URL
  const encodedFileName = encodeURIComponent(fileName);

  // Configurar los encabezados de la respuesta
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', buffer.byteLength);

  // Usar el formato "filename*" para soportar caracteres especiales (RFC 5987)
  res.setHeader(
    'Content-Disposition',
    `inline; filename="${encodedFileName}.pdf"; filename*=UTF-8''${encodedFileName}.pdf`,
  );

  // Enviar el archivo PDF
  res.end(buffer);
};
