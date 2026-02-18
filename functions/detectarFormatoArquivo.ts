import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import * as XLSX from 'npm:xlsx@0.18.5';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { arquivo_url } = await req.json();
    const resp = await fetch(arquivo_url);
    const buffer = await resp.arrayBuffer();
    
    const ext = arquivo_url.split('.').pop().toLowerCase();
    let formato = 'CSV';
    let headers = [];
    let preview = [];
    let delimitador = ',';
    let encoding = 'utf-8';
    let total_linhas = 0;

    if (ext === 'xlsx' || ext === 'xls') {
      formato = 'XLSX';
      const workbook = XLSX.read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      headers = Object.keys(json[0] || {});
      preview = json.slice(0, 5);
      total_linhas = json.length;
    } else if (ext === 'json') {
      formato = 'JSON';
      const json = JSON.parse(new TextDecoder().decode(buffer));
      const arr = Array.isArray(json) ? json : [json];
      headers = Object.keys(arr[0] || {});
      preview = arr.slice(0, 5);
      total_linhas = arr.length;
    } else {
      const text = new TextDecoder('utf-8').decode(buffer);
      const lines = text.split('\n').filter(l => l.trim());
      
      const firstLine = lines[0];
      const delimitadores = [',', ';', '\t', '|'];
      delimitador = delimitadores.reduce((prev, curr) => 
        firstLine.split(curr).length > firstLine.split(prev).length ? curr : prev
      );

      headers = lines[0].split(delimitador).map(h => h.trim());
      preview = lines.slice(1, 6).map(line => {
        const valores = line.split(delimitador);
        return headers.reduce((obj, h, i) => ({ ...obj, [h]: valores[i]?.trim() }), {});
      });
      total_linhas = lines.length - 1;
    }

    return Response.json({
      formato,
      headers,
      preview,
      delimitador,
      encoding,
      total_linhas
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});