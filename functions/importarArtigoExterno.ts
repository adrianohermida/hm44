import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { url, fileUrl } = await req.json();
    
    if (!url && !fileUrl) {
      return Response.json({ error: 'URL ou arquivo necessário' }, { status: 400 });
    }

    // Buscar escritório
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    if (!escritorios?.length) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }
    const escritorio = escritorios[0];

    // Usar InvokeLLM para extrair conteúdo estruturado com imagens
    const prompt = url 
      ? `Analise e extraia o conteúdo estruturado do seguinte artigo jurídico: ${url}

INSTRUÇÕES DETALHADAS:
1. EXTRAÇÃO DE IMAGENS:
   - Extraia URLs de TODAS as imagens do artigo (imagem de capa, ilustrações, infográficos)
   - A primeira imagem relevante será a imagem de capa
   - Imagens entre parágrafos devem ser preservadas com suas posições

2. ESTRUTURA DE CONTEÚDO:
   - Preserve EXATAMENTE a hierarquia de headings (H1, H2, H3, H4)
   - Listas numeradas: use formato "1. Item", "2. Item"
   - Listas com bullets: use "• Item" ou "- Item"
   - Parágrafos: separe com linha em branco
   - Negrito: use **texto**
   - Itálico: use *texto*

3. LINKS:
   - Preserve todos os links importantes no formato [texto](url)

4. CONTEÚDO:
   - Título principal extraído corretamente
   - Resumo de 150-160 caracteres
   - Conteúdo completo em Markdown limpo e estruturado
   - Meta description otimizada para SEO

Retorne JSON estruturado com todos os campos.`
      : `Extraia o conteúdo estruturado do documento anexado.

INSTRUÇÕES:
- Preserve estrutura de títulos, listas, parágrafos
- Extraia imagens se houver
- Mantenha formatações importantes
- Retorne JSON com mesmos campos`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: !!url,
      file_urls: fileUrl ? [fileUrl] : undefined,
      response_json_schema: {
        type: "object",
        properties: {
          titulo: { type: "string" },
          resumo: { type: "string" },
          conteudo: { type: "string" },
          autor: { type: "string" },
          imagem_capa: { type: "string" },
          imagens_conteudo: { 
            type: "array",
            items: {
              type: "object",
              properties: {
                url: { type: "string" },
                alt: { type: "string" },
                posicao: { type: "number" }
              }
            }
          },
          categoria: { 
            type: "string",
            enum: ["direito_consumidor", "superendividamento", "negociacao_dividas", "direito_bancario", "educacao_financeira", "casos_sucesso"]
          },
          keywords: { 
            type: "array",
            items: { type: "string" }
          },
          meta_description: { type: "string" }
        },
        required: ["titulo", "conteudo"]
      }
    });

    // Gerar slug SEO-friendly
    const slug = response.titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Criar artigo no banco
    const artigo = await base44.asServiceRole.entities.Blog.create({
      ...response,
      slug,
      escritorio_id: escritorio.id,
      status: 'rascunho',
      publicado: false,
      autor: response.autor || user.full_name,
      url_antiga: url || fileUrl,
      imagem_capa: response.imagem_capa || '',
      imagem_alt: response.titulo || '',
      topicos: parseMarkdownToTopicos(response.conteudo, response.imagens_conteudo)
    });

    return Response.json({ 
      success: true,
      artigo,
      message: 'Artigo importado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao importar:', error);
    return Response.json({ 
      error: error.message || 'Erro ao importar artigo'
    }, { status: 500 });
  }
});

function parseMarkdownToTopicos(markdown, imagensConteudo = []) {
  const linhas = markdown.split('\n');
  const topicos = [];
  let currentParagraph = '';
  let linhaAtual = 0;

  for (const linha of linhas) {
    linhaAtual++;
    
    // Headings
    if (linha.startsWith('#### ')) {
      if (currentParagraph) {
        topicos.push({ id: Date.now() + Math.random(), tipo: 'paragrafo', texto: currentParagraph.trim() });
        currentParagraph = '';
      }
      topicos.push({ id: Date.now() + Math.random(), tipo: 'h4', texto: linha.replace('#### ', '').trim() });
    } else if (linha.startsWith('### ')) {
      if (currentParagraph) {
        topicos.push({ id: Date.now() + Math.random(), tipo: 'paragrafo', texto: currentParagraph.trim() });
        currentParagraph = '';
      }
      topicos.push({ id: Date.now() + Math.random(), tipo: 'h3', texto: linha.replace('### ', '').trim() });
    } else if (linha.startsWith('## ')) {
      if (currentParagraph) {
        topicos.push({ id: Date.now() + Math.random(), tipo: 'paragrafo', texto: currentParagraph.trim() });
        currentParagraph = '';
      }
      topicos.push({ id: Date.now() + Math.random(), tipo: 'h2', texto: linha.replace('## ', '').trim() });
    } else if (linha.startsWith('# ')) {
      if (currentParagraph) {
        topicos.push({ id: Date.now() + Math.random(), tipo: 'paragrafo', texto: currentParagraph.trim() });
        currentParagraph = '';
      }
      topicos.push({ id: Date.now() + Math.random(), tipo: 'h1', texto: linha.replace('# ', '').trim() });
    }
    // Listas com bullets (• ou -)
    else if (linha.match(/^[\s]*[•\-]\s+/)) {
      if (currentParagraph) {
        topicos.push({ id: Date.now() + Math.random(), tipo: 'paragrafo', texto: currentParagraph.trim() });
        currentParagraph = '';
      }
      const lastTopico = topicos[topicos.length - 1];
      const itemTexto = linha.replace(/^[\s]*[•\-]\s+/, '').trim();
      if (lastTopico?.tipo === 'lista') {
        lastTopico.itens.push(itemTexto);
      } else {
        topicos.push({ id: Date.now() + Math.random(), tipo: 'lista', itens: [itemTexto] });
      }
    }
    // Listas numeradas (1. 2. 3.)
    else if (linha.match(/^[\s]*\d+\.\s+/)) {
      if (currentParagraph) {
        topicos.push({ id: Date.now() + Math.random(), tipo: 'paragrafo', texto: currentParagraph.trim() });
        currentParagraph = '';
      }
      const lastTopico = topicos[topicos.length - 1];
      const itemTexto = linha.replace(/^[\s]*\d+\.\s+/, '').trim();
      if (lastTopico?.tipo === 'lista') {
        lastTopico.itens.push(itemTexto);
      } else {
        topicos.push({ id: Date.now() + Math.random(), tipo: 'lista', itens: [itemTexto] });
      }
    }
    // Imagens
    else if (linha.match(/!\[.*?\]\(.*?\)/)) {
      if (currentParagraph) {
        topicos.push({ id: Date.now() + Math.random(), tipo: 'paragrafo', texto: currentParagraph.trim() });
        currentParagraph = '';
      }
      topicos.push({ id: Date.now() + Math.random(), tipo: 'paragrafo', texto: linha.trim() });
    }
    // Parágrafos
    else if (linha.trim()) {
      currentParagraph += linha + '\n';
    } else if (currentParagraph) {
      topicos.push({ id: Date.now() + Math.random(), tipo: 'paragrafo', texto: currentParagraph.trim() });
      currentParagraph = '';
      
      // Inserir imagens de conteúdo na posição adequada
      const imagensNaPosicao = imagensConteudo?.filter(img => img.posicao === topicos.length) || [];
      imagensNaPosicao.forEach(img => {
        topicos.push({ 
          id: Date.now() + Math.random(), 
          tipo: 'paragrafo', 
          texto: `![${img.alt || 'Imagem'}](${img.url})`
        });
      });
    }
  }

  if (currentParagraph) {
    topicos.push({ id: Date.now() + Math.random(), tipo: 'paragrafo', texto: currentParagraph.trim() });
  }

  return topicos;
}