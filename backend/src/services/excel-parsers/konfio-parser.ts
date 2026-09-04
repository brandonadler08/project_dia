import { BaseParser } from './base-parser';
import { ParseResult, CuentaData } from './types';
import * as xlsx from 'xlsx';

export class KonfioParser extends BaseParser {
  async parse(filePath: string): Promise<ParseResult> {
    const result: ParseResult = {
      success: true,
      cuentas: [],
      errors: [],
      totalRows: 0,
      sheet: 'PRESENCIAL'
    };

    try {
      const workbook = this.getWorkbook(filePath);
      const sheetName = workbook.SheetNames.find(n => n.toUpperCase().includes('PRESENCIAL')) || workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });
      result.totalRows = data.length;

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const folio = this.cleanString(row['FOLIO']);
          if (!folio) {
             continue;
          }

          let direccionCompleta = [
            this.cleanString(row['HOUSE_STREET']),
            this.cleanString(row['HOUSE_INTERIOR']),
            this.cleanString(row['HOUSE_NEIGHBORHOOD'])
          ].filter(Boolean).join(' ');

          let direccionNegocio = [
            this.cleanString(row['BUSINESS_STREET']),
            this.cleanString(row['BUSINESS_INTERIOR']),
            this.cleanString(row['BUSINESS_NEIGHBORHOOD']),
            this.cleanString(row['BUSINESS_MUNICIPALITY']),
            this.cleanString(row['BUSINESS_STATE']),
            this.cleanString(row['BUSINESS_ZIP_CODE'])
          ].filter(Boolean).join(' ');

          const cuenta: CuentaData = {
            identificador_externo: folio,
            nombre_titular: this.cleanString(row['TITULAR'] || 'Desconocido'),
            telefono: this.cleanString(row['mobile_number'] || row['house_number']),
            email: this.cleanString(row['email']),
            direccion_completa: direccionCompleta,
            colonia: this.cleanString(row['HOUSE_NEIGHBORHOOD']),
            municipio: this.cleanString(row['HOUSE_MUNICIPALITY']),
            estado: this.cleanString(row['HOUSE_STATE']),
            cp: this.cleanString(row['HOUSE_ZIP_CODE']),
            saldo_deudor: this.parseNumber(row['BALANCE']),
            monto_vencido: this.parseNumber(row['SALDO VENCIDO']),
            dias_mora: this.parseNumber(row['ATRASO']),
            bucket: this.cleanString(row['BUCKET']),
            datos_adicionales: {
              empresa: this.cleanString(row['EMPRESA']),
              tipo: this.cleanString(row['TIPO']),
              producto: this.cleanString(row['PRODUCTO']),
              balance: this.parseNumber(row['BALANCE']),
              via_solucion: this.cleanString(row['VÍA DE SOLUCIÓN ACTUAL']),
              oferta: this.cleanString(row['OFERTA']),
              vigencia_oferta: this.cleanString(row['VIGENCIA OFERTA']),
              tipo_presencial: this.cleanString(row['Tipo Presencial']),
              direccion_negocio: direccionNegocio,
              telefonos: [row['mobile_number'], row['house_number'], row['business_number'], row['number']].filter(Boolean).join(', ')
            }
          };

          result.cuentas.push(cuenta);
        } catch (err: any) {
          result.errors.push({ row: i + 2, message: err.message, data: row });
        }
      }
    } catch (error: any) {
      result.success = false;
      result.errors.push({ row: 0, message: `Failed to parse KONFIO Excel: ${error.message}` });
    }

    return result;
  }
}
