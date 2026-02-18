import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgClient from 'npm:@sendgrid/client@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, contacts, list_id, contact_id } = await req.json();

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    sgClient.setApiKey(apiKey);

    let response;

    switch (action) {
      case 'add_contacts':
        // Adicionar/atualizar contatos
        if (!contacts || !Array.isArray(contacts)) {
          return Response.json({ error: 'contacts deve ser array' }, { status: 400 });
        }
        
        response = await sgClient.request({
          method: 'PUT',
          url: '/v3/marketing/contacts',
          body: { contacts }
        });
        break;

      case 'list_contacts':
        // Listar contatos
        response = await sgClient.request({
          method: 'GET',
          url: '/v3/marketing/contacts',
          qs: { page_size: 100 }
        });
        break;

      case 'create_list':
        // Criar lista de contatos
        const { name } = await req.json();
        response = await sgClient.request({
          method: 'POST',
          url: '/v3/marketing/lists',
          body: { name }
        });
        break;

      case 'add_to_list':
        // Adicionar contatos a lista
        if (!list_id || !contacts) {
          return Response.json({ error: 'list_id e contacts são obrigatórios' }, { status: 400 });
        }
        
        response = await sgClient.request({
          method: 'POST',
          url: `/v3/marketing/lists/${list_id}/contacts`,
          body: { contact_ids: contacts }
        });
        break;

      case 'delete_contact':
        // Deletar contato
        if (!contact_id) {
          return Response.json({ error: 'contact_id é obrigatório' }, { status: 400 });
        }
        
        response = await sgClient.request({
          method: 'DELETE',
          url: `/v3/marketing/contacts?ids=${contact_id}`
        });
        break;

      default:
        return Response.json({ error: 'Ação inválida' }, { status: 400 });
    }

    return Response.json({
      success: true,
      data: response[1]?.body || response[1]
    });

  } catch (error) {
    return Response.json({ error: error.message, details: error.response?.body }, { status: 500 });
  }
});