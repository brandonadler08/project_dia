import { BaseParser } from './base-parser';
import { ParseResult, CuentaData } from './types';
import * as xlsx from 'xlsx';

export class KavakParser extends BaseParser {
  async parse(filePath: string): Promise<ParseResult> {
    const result: ParseResult = {
      success: true,
      cuentas: [],
      errors: [],
      totalRows: 0,
      sheet: 'ASIGNADO'
    };

    try {
      const workbook = this.getWorkbook(filePath);
      
      let asignadoSheetName = workbook.SheetNames.find(n => n.toUpperCase() === 'ASIGNADO' || n.toUpperCase() === 'ASIGNACIÓN');
      if (!asignadoSheetName) {
         asignadoSheetName = workbook.SheetNames[0];
      }
      
      const asignadoSheet = workbook.Sheets[asignadoSheetName];
      const asignadoData: any[] = xlsx.utils.sheet_to_json(asignadoSheet, { defval: '' });
      result.totalRows = asignadoData.length;

      let coordData: any[] = [];
      const coordSheetName = workbook.SheetNames.find(n => n.toUpperCase().includes('COORDENADAS'));
      if (coordSheetName) {
         const coordSheet = workbook.Sheets[coordSheetName];
         coordData = xlsx.utils.sheet_to_json(coordSheet, { defval: '' });
      }

      const coordMap = new Map();
      for (const row of coordData) {
          const id = this.cleanString(row['ESTIMATE'] || row['STOCK ID']);
          if (id) {
              coordMap.set(id, row);
          }
      }

      for (let i = 0; i < asignadoData.length; i++) {
        const row = asignadoData[i];
        try {
          const id = this.cleanString(row['CONTRATO']);
          if (!id) {
             result.errors.push({ row: i + 2, message: 'Missing CONTRATO', data: row });
             continue;
          }

          const coordInfo = coordMap.get(id) || {};
          
          let nombre = this.cleanString(row['NOMBRE']);
          if (row['APELLIDO']) {
              nombre += ' ' + this.cleanString(row['APELLIDO']);
          }
          if (!nombre) nombre = this.cleanString(row['NOMBRE + APELLIDO'] || row['NOMBRE_CLIENTE'] || 'Desconocido');

          const cuenta: CuentaData = {
            identificador_externo: id,
            nombre_titular: nombre,
            saldo_deudor: this.parseNumber(row['SALDO DEUDOR']),
            monto_vencido: this.parseNumber(row['SALDO INSOLUTO'] || coordInfo['SALDO INSOLUTO'] || row['SALDO DEUDOR']),
            dias_mora: this.parseNumber(row['DIAS MORA ACT'] || row['ATRASO MAX'] || row['DIAS_MORA']),
            municipio: this.cleanString(row['MUNICIPIO']),
            estado: this.cleanString(row['ENTIDAD'] || coordInfo['ESTADO']),
            cp: this.cleanString(row['CP']),
            direccion_completa: this.cleanString(coordInfo['INE'] || ''),
            bucket: this.cleanString(row['BUCKET'] || row['BUCKET ACTUAL']),
            riesgo: this.cleanString(row['RIESGO DE LA CUENTA']),
            datos_adicionales: {
              vin: this.cleanString(row['VIN']),
              marca: this.cleanString(row['MARCA']),
              modelo: this.cleanString(row['MODELO']),
              año: this.cleanString(row['AÑO']),
              gps_status: this.cleanString(row['GPS']),
              proveedor_gps: this.cleanString(row['PROVEEDOR_GPS']),
              territorial: this.cleanString(row['TERRITORIAL']),
              cartera: this.cleanString(row['CARTERA']),
              producto: this.cleanString(row['PRODUCTO']),
              coordenadas: {
                  ultima_ubicacion: this.cleanString(coordInfo['ULTIMA UBICACIÓN']),
                  arraigo: this.cleanString(coordInfo['Arraigo'])
              }
            }
          };

          result.cuentas.push(cuenta);
        } catch (err: any) {
          result.errors.push({ row: i + 2, message: err.message, data: row });
        }
      }
    } catch (error: any) {
      result.success = false;
      result.errors.push({ row: 0, message: `Failed to parse KAVAK Excel: ${error.message}` });
    }

    return result;
  }
}
