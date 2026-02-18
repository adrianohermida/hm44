import { limparCNJ } from './cnjUtils';
import { base44 } from '@/api/base44Client';

export class DataValidator {
  static validarLinha(row, mapeamento, linha) {
    const erros = [];
    
    const cnj = this.extrairCNJ(row, mapeamento);
    if (!cnj) {
      erros.push({ linha, campo: 'numero_cnj', erro: 'Campo obrigatório ausente' });
    } else if (cnj.length !== 20) {
      erros.push({ linha, campo: 'numero_cnj', erro: `CNJ inválido: ${cnj.length} dígitos` });
    }

    return { valido: erros.length === 0, erros, cnj };
  }

  static extrairCNJ(row, mapeamento = {}) {
    const campos = ['numero_cnj', 'Processo', 'numero_processo', 'numero'];
    
    for (const campo of campos) {
      const valor = row[campo] || row[mapeamento[campo]];
      if (valor) {
        const limpo = limparCNJ(valor);
        if (limpo) return limpo;
      }
    }

    return null;
  }

  static async detectarDuplicados(dados, base44, escritorioId) {
    if (!dados || !escritorioId) return { total: 0, planilha: 0, db: 0, lista: [] };

    const cnjs = dados.map(r => limparCNJ(
      r.numero_cnj || r.Processo || r.numero_processo
    )).filter(Boolean);

    const duplicadosPlanilha = cnjs.filter((cnj, idx) => cnjs.indexOf(cnj) !== idx);
    
    let existentes = [];
    try {
      existentes = await base44.entities.Processo.filter({
        escritorio_id: escritorioId
      });
      existentes = existentes.filter(p => cnjs.includes(p.numero_cnj));
    } catch (error) {
      console.error('Erro ao buscar duplicados:', error);
    }

    return {
      total: duplicadosPlanilha.length + existentes.length,
      planilha: duplicadosPlanilha.length,
      db: existentes.length,
      lista: existentes.map(p => ({
        cnj: p.numero_cnj,
        titulo_atual: p.titulo,
        id: p.id
      }))
    };
  }
}