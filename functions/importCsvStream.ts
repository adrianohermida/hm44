import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Papa from 'npm:papaparse@5.4.1';
import { z } from 'npm:zod@3.24.2';

const ServentiaCNJSchema = z.object({
  tribunal: z.string().min(2),
  uf: z.string().length(2),
  municipio: z.string().min(3),
  codigo_municipio_ibge: z.string().optional(),
  numero_serventia: z.string().optional(),
  nome_serventia: z.string().min(5),
  tipo_orgao: z.enum(["Vara", "Juizado", "Turma", "Câmara", "Cartório", "Outro"]).optional(),
  competencia: z.string().optional(),
  telefone: z.string().optional(),
  email: z.preprocess(
    (val) => (!val || val === "" || val === "null" || val === "NULL") ? undefined : val,
    z.string().email().optional()
  ),
  endereco: z.string().optional(),
  cep: z.string().optional(),
  geolocalizacao: z.string().optional(),
  horario_funcionamento: z.string().optional(),
  ativa: z.preprocess((val) => val !== false, z.boolean().optional())
}).transform(data => ({
  ...data,
  ativa: data.ativa !== false
}));

const JuizoCNJSchema = z.object({
  tribunal: z.string().min(2),
  uf: z.string().length(2),
  numero_serventia: z.string().optional(),
  nome_serventia: z.string().min(5),
  nome_juizo: z.string().min(5),
  juizo_100_digital: z.preprocess((val) => val === true, z.boolean().optional()),
  data_adesao: z.string().optional(),
  codigo_origem: z.string().optional(),
  tipo_unidade: z.enum(["Vara", "Juizado Especial", "Turma Recursal", "Câmara", "Seção", "Outro"]).optional(),
  classificacao: z.string().optional(),
  unidade: z.string().optional(),
  grau: z.enum(["1º Grau", "2º Grau", "Superior"]).optional(),
  permite_peticionamento_eletronico: z.preprocess((val) => val !== false, z.boolean().optional()),
  sistema_processual: z.enum(["PJe", "PROJUDI", "SAJ", "ESAJ", "EPROC", "TUCUJURIS", "Outro"]).optional()
}).transform(data => ({
  ...data,
  juizo_100_digital: data.juizo_100_digital === true,
  permite_peticionamento_eletronico: data.permite_peticionamento_eletronico !== false
}));

const CodigoForoTJSPSchema = z.object({
  codigo: z.string().transform(v => String(v).trim()),
  nome: z.string().transform(v => String(v).trim()),
  tipo: z.enum(['Foro', 'Vara', 'Comarca']).transform(v => String(v).trim()),
  ativo: z.preprocess((val) => val !== false && val !== 'false' && val !== 0, z.boolean().optional())
}).transform(data => ({
  ...data,
  ativo: data.ativo !== false
}));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { file_url, entity_name, schema_type } = await req.json();

    if (!file_url || !entity_name) {
      return Response.json({ error: 'file_url e entity_name obrigatórios' }, { status: 400 });
    }

    const csvResponse = await fetch(file_url);
    const csvText = await csvResponse.text();

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorio_id = escritorios[0]?.id;

    if (!escritorio_id) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }

    const existingRecords = await base44.asServiceRole.entities[entity_name].filter({ escritorio_id });
    const jaImportados = existingRecords.length;

    let total = 0;
    let sucesso = 0;
    let falhas = 0;
    const erros = [];
    const batch = [];
    const BATCH_SIZE = 100;

    const schemas = {
      serventia_cnj: ServentiaCNJSchema,
      juizo_cnj: JuizoCNJSchema,
      codigo_foro_tjsp: CodigoForoTJSPSchema
    };

    const schema = schemas[schema_type] || ServentiaCNJSchema;

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        step: (results) => {
          total++;
          const validation = schema.safeParse(results.data);

          if (!validation.success) {
            falhas++;
            erros.push({
              linha: total,
              erro: validation.error.issues[0].message,
              dados: results.data
            });
            return;
          }

          batch.push({ ...validation.data, escritorio_id });

          if (batch.length >= BATCH_SIZE) {
            (async () => {
              try {
                await base44.asServiceRole.entities[entity_name].bulkCreate(batch);
                sucesso += batch.length;
              } catch (e) {
                falhas += batch.length;
              }
            })();
            batch.length = 0;
          }
        },
        complete: async () => {
          if (batch.length > 0) {
            try {
              await base44.asServiceRole.entities[entity_name].bulkCreate(batch);
              sucesso += batch.length;
            } catch (e) {
              falhas += batch.length;
            }
          }

          await base44.asServiceRole.entities.Notificacao.create({
            user_email: user.email,
            tipo: 'IMPORTACAO_CONCLUIDA',
            titulo: '✅ Importação CNJ concluída',
            mensagem: `${sucesso} registros importados`,
            lida: false
          });

          resolve(Response.json({
            total,
            sucesso,
            falhas,
            erros: erros.slice(0, 50),
            ja_importados: jaImportados,
            total_esperado: jaImportados + sucesso
          }));
        }
      });
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});