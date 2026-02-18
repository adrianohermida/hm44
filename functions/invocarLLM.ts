import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: body.prompt,
      add_context_from_internet: body.add_context_from_internet || false,
      response_json_schema: body.response_json_schema || null,
      file_urls: body.file_urls || null
    });

    return Response.json({ data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});