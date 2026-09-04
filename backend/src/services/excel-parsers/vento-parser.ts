import { BaseParser } from './base-parser';
import { ParseResult, CuentaData } from './types';
import * as xlsx from 'xlsx';

export class VentoParser extends BaseParser {
  async parse(filePath: string): Promise<ParseResult> {
    const result: ParseResult = {
      success: true,
      cuentas: [],
      errors: [],
      totalRows: 0,
      sheet: 'Hoja1'
    };

    try {
      const workbook = this.getWorkbook(filePath);
      const sheetName = workbook.SheetNames.find(n => n === 'Hoja1') || workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      const data: any[] = xlsx.utils.sheet_to_json(sheet, { range: 2, defval: '' });
      result.totalRows = data.length;

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const folio = this.cleanString(row['Folio'] || row['FOLIO']);
          if (!folio) {
            continue; 
          }

          const cuenta: CuentaData = {
            identificador_externo: folio,
            nombre_titular: this.cleanString(row['Persona'] || row['NOMBRE'] || 'Desconocido'),
            direccion_completa: this.cleanString(row['callenum'] || row['CALLE Y NUMERO']),
            colonia: this.cleanString(row['colonia'] || row['COLONIA']),
            municipio: this.cleanString(row['municipio'] || row['MUNICIPIO']),
            estado: this.cleanString(row['estado'] || row['ESTADO']),
            cp: this.cleanString(row['cp'] || row['C.P.'] || row['CP']),
            saldo_deudor: this.parseNumber(row['MontoPagosAtrasados'] || row['SALDO TOTAL']),
            monto_vencido: this.parseNumber(row['MontoPagosAtrasados'] || row['SALDO VENCIDO']),
            dias_mora: this.parseNumber(row['PagosAtrasados'] || row['PAGOS ATRASADOS']),
            datos_adicionales: {
              num_pagos: this.parseNumber(row['NumeroPagos']),
              num_pago_actual: this.parseNumber(row['NumPago']),
              pagos_exitosos: this.parseNumber(row['PagosExitosos']),
              pagos_semanal: this.parseNumber(row['PagosSemanal']),
              inactividad: this.parseNumber(row['Inactivdad']),
              fecha_ultimo_pago: this.parseDate(row['FechaUltimoPago']),
              siguiente_fecha: this.parseDate(row['SigFecha'])
            }
          };

          result.cuentas.push(cuenta);
        } catch (err: any) {
          result.errors.push({ row: i + 4, message: err.message, data: row });
        }
      }
    } catch (error: any) {
      result.success = false;
      result.errors.push({ row: 0, message: `Failed to parse VENTO Excel: ${error.message}` });
    }

    return result;
  }
}
