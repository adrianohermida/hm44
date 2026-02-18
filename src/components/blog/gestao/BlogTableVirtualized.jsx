import React, { useState, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import BlogTableHeader from './table/BlogTableHeader';
import BlogTableRow from './table/BlogTableRow';
import BlogTablePagination from './table/BlogTablePagination';

export default function BlogTableVirtualized({ artigos, onEdit, onDelete, onOtimizar }) {
  const [ordenacao, setOrdenacao] = useState({ campo: 'created_date', direcao: 'desc' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 20;

  const artigosOrdenados = useMemo(() => {
    return [...artigos].sort((a, b) => {
      const valorA = a[ordenacao.campo];
      const valorB = b[ordenacao.campo];
      if (valorA === valorB) return 0;
      const comparacao = valorA > valorB ? 1 : -1;
      return ordenacao.direcao === 'asc' ? comparacao : -comparacao;
    });
  }, [artigos, ordenacao]);

  const artigosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return artigosOrdenados.slice(inicio, inicio + itensPorPagina);
  }, [artigosOrdenados, paginaAtual]);

  const handleOrdenar = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
    setPaginaAtual(1);
  };

  const Row = ({ index, style }) => {
    const artigo = artigosPaginados[index];
    return (
      <div style={style}>
        <BlogTableRow
          artigo={artigo}
          onEdit={onEdit}
          onDelete={onDelete}
          onOtimizar={onOtimizar}
        />
      </div>
    );
  };

  const totalPaginas = Math.ceil(artigos.length / itensPorPagina);

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <BlogTableHeader campo="titulo" label="Título" ordenacao={ordenacao} onOrdenar={handleOrdenar} />
              <BlogTableHeader campo="slug" label="Slug" ordenacao={ordenacao} onOrdenar={handleOrdenar} />
              <th className="text-left p-4 font-semibold">Categoria</th>
              <BlogTableHeader campo="created_date" label="Criado" ordenacao={ordenacao} onOrdenar={handleOrdenar} />
              <BlogTableHeader campo="status" label="Status" ordenacao={ordenacao} onOrdenar={handleOrdenar} />
              <BlogTableHeader campo="data_publicacao" label="Publicação" ordenacao={ordenacao} onOrdenar={handleOrdenar} />
              <th className="text-left p-4 font-semibold">Checklist SEO</th>
              <th className="text-right p-4 font-semibold">Ações</th>
            </tr>
          </thead>
        </table>
        <FixedSizeList
          height={600}
          itemCount={artigosPaginados.length}
          itemSize={80}
          width="100%"
        >
          {Row}
        </FixedSizeList>
      </div>
      
      <BlogTablePagination
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        totalItens={artigos.length}
        itensPorPagina={itensPorPagina}
        onMudarPagina={setPaginaAtual}
      />
    </div>
  );
}