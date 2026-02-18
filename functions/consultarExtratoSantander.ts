import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = Deno.env.get('SANTANDER_ACCESS_TOKEN');
    const { data_inicio, data_fim } = await req.json();

    const response = await fetch('https://api.santander.com.br/open-banking/extratos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const extrato = await response.json();

    return Response.json({ transacoes: extrato.transacoes || [] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});