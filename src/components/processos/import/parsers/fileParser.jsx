import * as XLSX from 'xlsx';
import { detectEncoding, readFileWithEncoding } from './encodingDetector';
import { detectarModelo, mapearHeaders } from './headerMapper';

export async function parseFile(file) {
  const encoding = await detectEncoding(file);
  
  if (file.name.endsWith('.csv')) {
    const text = await readFileWithEncoding(file, encoding);
    return parseCSV(text);
  } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    const data = await readFileAsArrayBuffer(file);
    return parseExcel(data);
  } else if (file.name.endsWith('.json')) {
    const data = await readFileAsArrayBuffer(file);
    return parseJSON(data);
  }
  
  throw new Error('Formato não suportado');
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function parseCSV(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return { dados: [], headers: [], modelo: 'desconhecido', mapeamento: {} };
  
  const headers = lines[0].split(/[,;|\t]/).map(h => h.trim().replace(/^["']|["']$/g, ''));
  const modelo = detectarModelo(headers);
  const mapeamento = mapearHeaders(headers);
  
  const dados = lines.slice(1).map((line, index) => {
    const values = line.split(/[,;|\t]/).map(v => v.trim().replace(/^["']|["']$/g, ''));
    const obj = { _linha: index + 2 };
    
    headers.forEach((header, i) => {
      const campoSchema = mapeamento[header];
      if (campoSchema && values[i] !== undefined && values[i] !== '') {
        obj[campoSchema] = values[i];
      }
    });
    
    return obj;
  });

  return { dados, headers, modelo, mapeamento };
}

function parseExcel(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    raw: false,
    defval: ''
  });
  
  const headers = Object.keys(rows[0] || {});
  const modelo = detectarModelo(headers);
  const mapeamento = mapearHeaders(headers);
  
  const dados = rows.map((row, index) => {
    const obj = { _linha: index + 2 };
    Object.entries(row).forEach(([header, valor]) => {
      const campoSchema = mapeamento[header];
      if (campoSchema && valor !== '') {
        obj[campoSchema] = valor;
      }
    });
    return obj;
  });

  return { dados, headers, modelo, mapeamento };
}

function parseJSON(arrayBuffer) {
  const text = new TextDecoder('utf-8').decode(arrayBuffer);
  const parsed = JSON.parse(text);
  
  const array = Array.isArray(parsed) ? parsed : [parsed];
  const headers = Object.keys(array[0] || {});
  const modelo = detectarModelo(headers);
  const mapeamento = mapearHeaders(headers);
  
  const dados = array.map((item, index) => ({
    ...item,
    _linha: index + 1
  }));

  return { dados, headers, modelo, mapeamento };
}