import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { sendPdfResponse } from './helper/pdf.helper';
import PdfDto from './common/class/dto/pdf.class.dto';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  main(): string {
    return "Service is running";
  }

  @Post('/html-to-pdf')
  async htmlToPdf(@Res() res: Response, @Body() body: PdfDto) {
    try {
      const buffer: Uint8Array = await this.appService.htmlToPdf(body);
      return sendPdfResponse(res, buffer, body.title);
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Post('/url-to-pdf')
  async urlToPdf(@Res() res: Response, @Body() body: PdfDto) {
    try {
      const buffer: Uint8Array = await this.appService.urlToPdf(body);
      return sendPdfResponse(res, buffer, body.title);
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Get('pdf/test')
  async test(@Res() res: Response) {
    try {
      const buffer: Uint8Array = await this.appService.pdfTest();
      return sendPdfResponse(res, buffer, 'Test PDF');
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }
}
