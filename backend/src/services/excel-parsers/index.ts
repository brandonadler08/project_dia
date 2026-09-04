import { ParseResult } from './types';
import { KavakParser } from './kavak-parser';
import { VentoParser } from './vento-parser';
import { ClipParser } from './clip-parser';
import { KonfioParser } from './konfio-parser';
import { LafinParser } from './lafin-parser';
import * as xlsx from 'xlsx';

export * from './types';
export * from './base-parser';
export * from './kavak-parser';
export * from './vento-parser';
export * from './clip-parser';
export * from './konfio-parser';
export * from './lafin-parser';
export * from './vento-pagos-parser';
export * from './clip-pagos-parser';

export function detectClientType(filePath: string): string {
  try {
    const workbook = xlsx.readFile(filePath);
    
    const sheetNames = workbook.SheetNames.map(n => n.toUpperCase());
    
    if (sheetNames.includes('ASIGNADO') || sheetNames.includes('ASIGNACIÓN') || sheetNames.includes('COORDENADAS')) {
        return 'KAVAK';
    }
    
    if (sheetNames.includes('CARTERA_VENCIDA_MOTOS')) {
        return 'LAFIN';
    }

    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    
    const headers = [];
    const rangeStr = sheet['!ref'];
    if (rangeStr) {
      const range = xlsx.utils.decode_range(rangeStr);
      for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = sheet[xlsx.utils.encode_cell({c: C, r: range.s.r})];
          if (cell && cell.t) headers.push(xlsx.utils.format_cell(cell).toUpperCase());
      }
      
      const headers3 = []; 
      if (range.e.r >= range.s.r + 2) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = sheet[xlsx.utils.encode_cell({c: C, r: range.s.r + 2})];
            if (cell && cell.t) headers3.push(xlsx.utils.format_cell(cell).toUpperCase());
        }
      }

      if (headers.includes('LOAN_ID') || sheetNames.includes('CARTERA')) {
          return 'CLIP';
      }

      if (headers.includes('HOUSE_STREET') || headers.includes('BUSINESS_STREET') || sheetNames.includes('PRESENCIAL')) {
          return 'KONFIO';
      }
      
      if (headers3.includes('FOLIO') && (headers3.includes('PERSONA') || headers3.includes('PAGOSATRASADOS'))) {
          return 'VENTO';
      }
    }

    return 'UNKNOWN';
  } catch (error) {
    return 'ERROR';
  }
}

export async function parseCartera(filePath: string, clienteProductoId?: number): Promise<ParseResult> {
  const clientType = detectClientType(filePath);
  
  let parser;
  switch (clientType) {
    case 'KAVAK':
      parser = new KavakParser();
      break;
    case 'VENTO':
      parser = new VentoParser();
      break;
    case 'CLIP':
      parser = new ClipParser();
      break;
    case 'KONFIO':
      parser = new KonfioParser();
      break;
    case 'LAFIN':
      parser = new LafinParser();
      break;
    default:
      throw new Error(`Unsupported or unknown client type for file ${filePath}`);
  }

  return parser.parse(filePath);
}
