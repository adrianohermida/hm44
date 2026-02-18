import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, MessageSquare, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Breadcrumb from "@/components/seo/Breadcrumb";

const TIPOS_DOCUMENTO = [
  "Contrato",
  "Termos de uso",
  "Emails",
  "Extratos Bancários",
  "Demonstrativo de Dívida",
  "Outros"
];

export default function AnaliseDivida() {
  const [user, setUser] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [detalhesAdicionais, setDetalhesAdicionais] = useState("");
  const [arquivos, setArquivos] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [conversacao, setConversacao] = useState([]);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Usuário não autenticado");
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push({ name: file.name, url: file_url });
      } catch (error) {
        console.error("Erro no upload:", error);
      }
    }

    setArquivos([...arquivos, ...uploadedUrls]);
  };

  const analisarDocumento = async () => {
    if (!tipoDocumento) {
      toast.error('Selecione o tipo de documento');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise o seguinte documento relacionado a dívidas:
        
        Tipo de Documento: ${tipoDocumento}
        Detalhes Adicionais: ${detalhesAdicionais}
        
        Forneça uma análise completa incluindo:
        1. Resumo do documento
        2. Pontos de atenção jurídica
        3. Possíveis irregularidades
        4. Recomendações de ação
        5. Perguntas para esclarecimento`,
        file_urls: arquivos.map(a => a.url),
        response_json_schema: {
          type: "object",
          properties: {
            resumo: { type: "string" },
            pontos_atencao: { type: "array", items: { type: "string" } },
            irregularidades: { type: "array", items: { type: "string" } },
            recomendacoes: { type: "array", items: { type: "string" } },
            perguntas: { type: "array", items: { type: "string" } }
          }
        }
      });

      setResultado(response);
      setConversacao([{ tipo: 'ia', conteudo: response.resumo }]);
    } catch (error) {
      console.error("Erro na análise:", error);
      toast.error('Erro ao analisar documento');
    }
    setIsAnalyzing(false);
  };

  const converterEmTicket = async () => {
    try {
      await base44.entities.Ticket.create({
        titulo: `Análise de ${tipoDocumento}`,
        descricao: `${detalhesAdicionais}\n\nAnálise: ${resultado?.resumo}`,
        cliente_email: user.email,
        cliente_nome: user.full_name,
        categoria: 'analise',
        prioridade: 'media',
        escritorio_id: user.escritorio_id
      });
      
      toast.success('Ticket criado! Nossa equipe irá analisar em breve.');
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      toast.error('Erro ao criar ticket');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-5xl mx-auto">
        <Breadcrumb items={[{ label: 'Análise de Dívidas' }]} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
            Análise de Dívidas
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Envie seus documentos para análise preliminar por IA
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Enviar Documentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Documento</label>
                  <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_DOCUMENTO.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Detalhes Adicionais</label>
                  <Textarea
                    placeholder="Descreva sua situação, dúvidas ou informações relevantes..."
                    value={detalhesAdicionais}
                    onChange={(e) => setDetalhesAdicionais(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Anexar Arquivos</label>
                  <div className="border-2 border-dashed border-[var(--border-primary)] rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-2" />
                      <p className="text-[var(--text-secondary)]">Clique para selecionar arquivos</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                    </label>
                  </div>
                  
                  {arquivos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {arquivos.map((arquivo, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-[var(--bg-tertiary)] rounded">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{arquivo.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={analisarDocumento}
                  disabled={isAnalyzing || !tipoDocumento}
                  className="w-full bg-[var(--brand-primary)]"
                >
                  {isAnalyzing ? 'Analisando...' : 'Analisar com IA'}
                </Button>
              </CardContent>
            </Card>

            {resultado && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Resultado da Análise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Resumo</h4>
                    <p className="text-[var(--text-secondary)]">{resultado.resumo}</p>
                  </div>

                  {resultado.pontos_atencao?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-[var(--brand-warning)]" />
                        Pontos de Atenção
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {resultado.pontos_atencao.map((ponto, i) => (
                          <li key={i} className="text-[var(--text-secondary)]">{ponto}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resultado.irregularidades?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-[var(--brand-error)]">Possíveis Irregularidades</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {resultado.irregularidades.map((irr, i) => (
                          <li key={i} className="text-[var(--text-secondary)]">{irr}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resultado.recomendacoes?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-[var(--brand-success)]">Recomendações</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {resultado.recomendacoes.map((rec, i) => (
                          <li key={i} className="text-[var(--text-secondary)]">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button onClick={converterEmTicket} variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Solicitar Análise Detalhada (Criar Ticket)
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">1. Envie os Documentos</h4>
                  <p className="text-[var(--text-secondary)]">Anexe contratos, extratos ou qualquer documento relacionado</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">2. Análise Preliminar</h4>
                  <p className="text-[var(--text-secondary)]">Nossa IA faz uma análise inicial em segundos</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">3. Solicite Revisão</h4>
                  <p className="text-[var(--text-secondary)]">Converta em ticket para análise detalhada por especialistas</p>
                </div>
                
                <Badge variant="outline" className="w-full justify-center">
                  Recurso exclusivo para assinantes
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}