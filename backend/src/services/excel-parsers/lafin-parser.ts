import { BaseParser } from './base-parser';
import { ParseResult, CuentaData } from './types';
import * as xlsx from 'xlsx';

export class LafinParser extends BaseParser {
  async parse(filePath: string): Promise<ParseResult> {
    const result: ParseResult = {
      success: true,
      cuentas: [],
      errors: [],
      totalRows: 0,
      sheet: 'Cartera_vencida_motos'
    };

    try {
      const workbook = this.getWorkbook(filePath);
      const sheetName = workbook.SheetNames.find(n => n.toUpperCase().includes('CARTERA_VENCIDA_MOTOS')) || workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });
      result.totalRows = data.length;

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const cliente = this.cleanString(row['Cliente']);
          const identificador = this.cleanString(row['Cliente_ID'] || row['Grupo'] || cliente); 
          
          if (!identificador || !cliente) {
             continue;
          }

          const cuenta: CuentaData = {
            identificador_externo: identificador,
            nombre_titular: cliente,
            telefono: this.cleanString(row['Tel.']),
            direccion_completa: this.cleanString(row['Dirección']),
            colonia: this.cleanString(row['Colonia']),
            municipio: this.cleanString(row['Localidad']),
            saldo_deudor: this.parseNumber(row['Saldo']),
            monto_vencido: this.parseNumber(row['Saldo']),
            dias_mora: this.parseNumber(row['Días Actual']),
            bucket: this.cleanString(row['Bucket']),
            datos_adicionales: {
              grupo: this.cleanString(row['Grupo']),
              gestor_actual: this.cleanString(row['Gestor']),
              aval: this.cleanString(row['Aval']),
              calificacion_score: this.cleanString(row['Calificación Score']),
              buro: this.cleanString(row['Buró']),
              edad: this.cleanString(row['Edad']),
              tipo_casa: this.cleanString(row['Casa']),
              estado_civil: this.cleanString(row['Edo. Civil']),
              asesor: this.cleanString(row['Asesor']),
              pago_fijo: this.parseNumber(row['Pago Fijo']),
              fichas: this.cleanString(row['Fichas']),
              producto: this.cleanString(row['Producto']),
              periodo: this.cleanString(row['Periodo']),
              gps_disponible: this.cleanString(row['GPS']),
              fecha_inicio: this.parseDate(row['Fecha_inicio']),
              fecha_final: this.parseDate(row['Fecha_final'])
            }
          };

          result.cuentas.push(cuenta);
        } catch (err: any) {
          result.errors.push({ row: i + 2, message: err.message, data: row });
        }
      }
    } catch (error: any) {
      result.success = false;
      result.errors.push({ row: 0, message: `Failed to parse LAFIN Excel: ${error.message}` });
    }

    return result;
  }
}
