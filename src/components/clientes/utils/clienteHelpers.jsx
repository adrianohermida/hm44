export const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return null;
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

export const isIdoso = (dataNascimento, sexo) => {
  const idade = calcularIdade(dataNascimento);
  if (!idade) return false;
  // Regras da Previdência Social brasileira
  if (sexo === 'masculino') return idade >= 65;
  if (sexo === 'feminino') return idade >= 62;
  return false;
};

export const formatarData = (data) => {
  if (!data) return '-';
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export const formatarMoeda = (valor) => {
  if (!valor && valor !== 0) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};