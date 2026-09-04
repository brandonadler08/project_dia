import { BaseParser } from './base-parser';
import { ParseResult, CuentaData } from './types';
import * as xlsx from 'xlsx';

export class ClipParser extends BaseParser {
  async parse(filePath: string): Promise<ParseResult> {
    const result: ParseResult = {
      success: true,
      cuentas: [],
      errors: [],
      totalRows: 0,
      sheet: 'Cartera'
    };

    try {
      const workbook = this.getWorkbook(filePath);
      const carteraSheetName = workbook.SheetNames.find(n => n.toUpperCase().includes('CARTERA')) || workbook.SheetNames[0];
      const sheet = workbook.Sheets[carteraSheetName];
      const data: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });
      result.totalRows = data.length;

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const loanId = this.cleanString(row['Loan_Id']);
          if (!loanId) {
             continue;
          }

          let nombre = this.cleanString(row['Nombre Administrador']);
          if (row['Apellido Administrador']) nombre += ' ' + this.cleanString(row['Apellido Administrador']);
          if (row['2Do Apellido Administrador']) nombre += ' ' + this.cleanString(row['2Do Apellido Administrador']);
          
          if (!nombre) nombre = this.cleanString(row['Nombre Del Merchant'] || 'Desconocido');

          let direccion = this.cleanString(row['Calle y numero']);
          if (row['Interior']) direccion += ' Int: ' + this.cleanString(row['Interior']);

          const cuenta: CuentaData = {
            identificador_externo: loanId,
            nombre_titular: nombre,
            telefono: this.cleanString(row['Teléfono']),
            email: this.cleanString(row['Correo']),
            direccion_completa: direccion,
            colonia: this.cleanString(row['Colonia']),
            municipio: this.cleanString(row['Municipio']),
            estado: this.cleanString(row['Estado']),
            cp: this.cleanString(row['CP'] || row['C.P.']),
            saldo_deudor: this.parseNumber(row['Current Balance'] || row['Total A Pagar']),
            monto_vencido: this.parseNumber(row['Monto Mensual Pendiente']),
            dias_mora: this.parseNumber(row['Días De Atraso']),
            bucket: this.cleanString(row['Bucket']),
            datos_adicionales: {
              merchant_name: this.cleanString(row['Nombre Del Merchant']),
              monto_prestado: this.parseNumber(row['Monto Prestado']),
              total_a_pagar: this.parseNumber(row['Total A Pagar']),
              prioritario: this.cleanString(row['Prioritarios']),
              fee_base: this.cleanString(row['Fee Base'])
            }
          };

          result.cuentas.push(cuenta);
        } catch (err: any) {
          result.errors.push({ row: i + 2, message: err.message, data: row });
        }
      }
    } catch (error: any) {
      result.success = false;
      result.errors.push({ row: 0, message: `Failed to parse CLIP Excel: ${error.message}` });
    }

    return result;
  }
}
