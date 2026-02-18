export default function useCSVErrors(entityName) {
  const downloadErrors = (errors) => {
    if (!errors?.length) return;

    const csvContent = [
      'Linha,Erro',
      ...errors.map(e => `${e.linha},"${e.erro}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `erros_${entityName}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return { downloadErrors };
}