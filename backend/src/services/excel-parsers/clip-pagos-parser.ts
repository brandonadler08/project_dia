import { BaseParser } from './base-parser';
import { PagoData } from './vento-pagos-parser';
import * as xlsx from 'xlsx';

export class ClipPagosParser extends BaseParser<{ success: boolean; pagos: PagoData[]; errors: any[] }> {
  async parse(filePath: string): Promise<{ success: boolean; pagos: PagoData[]; errors: any[] }> {
    const result = {
      success: true,
      pagos: [] as PagoData[],
      errors: [] as any[]
    };

    try {
      const workbook = this.getWorkbook(filePath);
      const sheetName = workbook.SheetNames.find(n => n.toUpperCase().includes('PAGOS')) || workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      const data: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const loanId = this.cleanString(row['loan_id'] || row['Loan_Id']);
          if (!loanId) continue;
          
          const pago: PagoData = {
            identificador_externo: loanId,
            monto: this.parseNumber(row['sum(collection_amount)'] || row['Monto reconocido'] || row['Pago D2D']),
            fecha: this.parseDate(row['collection_date']) || new Date().toISOString(),
            tipo: 'PAGO',
            datos_adicionales: {
              origen: this.cleanString(row['collection_engine_source']),
              sub_origen: this.cleanString(row['collection_sub_origin']),
              bucket: this.cleanString(row['Bucket']),
              estadio: this.cleanString(row['Estadio'])
            }
          };
          result.pagos.push(pago);
        } catch (err: any) {
           result.errors.push({ row: i + 2, message: err.message });
        }
      }
    } catch (err: any) {
       result.success = false;
       result.errors.push({ message: err.message });
    }

    return result;
  }
}
