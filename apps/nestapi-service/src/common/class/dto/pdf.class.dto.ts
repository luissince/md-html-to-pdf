import { SizePaper } from 'src/common/enums/size.enum';
import { Margin } from 'src/common/interfaces/margin.interface';

export default class PdfDto {
  title: string;
  html: string;
  url?: string;
  size?: SizePaper;
  width?: string;
  height?: string;
  margin?: Margin;
}
