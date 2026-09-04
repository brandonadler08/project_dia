import * as xlsx from 'xlsx';
import { ParseResult } from './types';

export abstract class BaseParser<T = ParseResult> {
  protected readExcel(filePath: string, sheetName?: string): any[] {
    const workbook = xlsx.readFile(filePath);
    
    if (sheetName) {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found in Excel file`);
      }
      return xlsx.utils.sheet_to_json(sheet, { defval: '' });
    }
    
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    return xlsx.utils.sheet_to_json(sheet, { defval: '' });
  }
  
  protected getWorkbook(filePath: string): xlsx.WorkBook {
      return xlsx.readFile(filePath);
  }

  protected parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    
    const cleanStr = String(value).replace(/[\$,\s]/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  }

  protected cleanString(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value).trim().replace(/\s+/g, ' ');
  }

  protected parseDate(value: any): string | undefined {
    if (!value) return undefined;
    if (typeof value === 'number') {
        const date = xlsx.SSF.parse_date_code(value);
        if (date) {
            return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
        }
    }
    return String(value).trim();
  }

  abstract parse(filePath: string): Promise<T>;
}
