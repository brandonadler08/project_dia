import { BaseParser } from './base-parser';
import * as xlsx from 'xlsx';

export interface PagoData {
  identificador_externo: string;
  monto: number;
  fecha: string;
  tipo: string;
  datos_adicionales: Record<string, any>;
}

export class VentoPagosParser extends BaseParser<{ success: boolean; pagos: PagoData[]; errors: any[] }> {
  async parse(filePath: string): Promise<{ success: boolean; pagos: PagoData[]; errors: any[] }> {
    const result = {
      success: true,
      pagos: [] as PagoData[],
      errors: [] as any[]
    };

    try {
      const workbook = this.getWorkbook(filePath);
      const sheetName = workbook.SheetNames.find(n => n.toUpperCase().includes('RECUPERACIÓN')) || workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      const data: any[] = xlsx.utils.sheet_to_json(sheet, { range: 2, defval: '' });

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const folio = this.cleanString(row['Folio'] || row['FOLIO']);
          if (!folio) continue;
          
          let monto = 0;
          let tipo = 'PAGO';
          
          if (row['Recuperación']) monto = this.parseNumber(row['Recuperación']);
          
          const pago: PagoData = {
            identificador_externo: folio,
            monto,
            fecha: this.parseDate(row['Fecha'] || new Date().toISOString()) || new Date().toISOString(),
            tipo,
            datos_adicionales: {
              nombre: this.cleanString(row['Nombre'] || row['NOMBRE'])
            }
          };
          result.pagos.push(pago);
        } catch (err: any) {
           result.errors.push({ row: i + 4, message: err.message });
        }
      }
    } catch (err: any) {
       result.success = false;
       result.errors.push({ message: err.message });
    }

    return result;
  }
}
