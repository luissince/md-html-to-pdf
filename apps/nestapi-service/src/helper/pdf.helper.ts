import { Page } from 'playwright';
import { PdfOptions } from 'src/common/interfaces/pdf-options.inteface';
import { SizePrint } from 'src/common/enums/size.enum';
import { millimetersToPixels, pixelsToMillimeters } from './utils.helper';
import { getBrowserContext } from 'src/handlers/pdf.handler';

/**
 * Get height the html content
 * @param htmlContent
 * @param width
 * @returns
 */
async function measureHeight(
  htmlContent: string,
  width: number,
): Promise<number> {
  const context = await getBrowserContext();
  const page = await context.newPage();

  try {
    await page.setViewportSize({ width, height: 10 });
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.waitForFunction(() => document.fonts.ready, { timeout: 30000 });

    const body = await page.$('body');
    const boundingBox = await body.boundingBox();
    return Math.ceil(boundingBox.height);
  } finally {
    await page.close();
  }
}

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
  let page: Page | null = null;

  try {
    const context = await getBrowserContext();
    page = await context.newPage();

    // Configure the page
    await page.emulateMedia({ media: emulateMedia });

    // Navigate to the URL with timeout
    await page.goto(url, {
      waitUntil: waitUntil,
      timeout: timeout,
    });

    // Wait for fonts to load
    await page.waitForFunction(() => document.fonts.ready, {
      timeout: 30000,
    });

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
  let page: Page | null = null;

  try {
    const context = await getBrowserContext();
    page = await context.newPage();

    const pdfOptions: any = {
      printBackground: true,
      margin: margin,
    };

    if (width && height) {
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
      await page.waitForFunction(() => document.fonts.ready, {
        timeout: 30000,
      });

      pdfOptions.width = `${width}mm`;
      pdfOptions.height = `${height}mm`;
    } else if (width === SizePrint.A4) {
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
      await page.waitForFunction(() => document.fonts.ready, {
        timeout: 30000,
      });

      pdfOptions.format = SizePrint.A4;
    } else if (width) {
      const widthPx = Math.round(
        millimetersToPixels(Number(width.replace('mm', ''))),
      );

      const heightPx = await measureHeight(htmlContent, widthPx);
      const heightMm = pixelsToMillimeters(heightPx).toFixed(2);

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
      await page.waitForFunction(() => document.fonts.ready, {
        timeout: 30000,
      });

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
  }
};
