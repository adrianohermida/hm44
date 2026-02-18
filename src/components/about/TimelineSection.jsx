import React, { useState } from "react";
import TimelineHeader from "./timeline/TimelineHeader";
import TimelineFilters from "./timeline/TimelineFilters";
import TimelineItem from "./timeline/TimelineItem";
import LanguageCards from "./timeline/LanguageCards";
import AreaCards from "./timeline/AreaCards";

const achievements = [
  { year: "2003", title: "Início da Graduação em Direito", description: "Ingressou na Faculdade Martha Falcão (FMF/IESA) em Manaus/AM", category: "formacao" },
  { year: "2004-2008", title: "Participação em Eventos Acadêmicos", description: "Participou de diversos eventos: II Ciclo de Palestras de Direito Penal, Semana dos Cursos Jurídicos, Eficácia da Legislação Penal e Ambiental, Teoria e Prática do Tribunal do Júri", category: "eventos" },
  { year: "2005", title: "Eventos de Direito Penal e Ambiental", description: "Participação em seminários sobre Eficácia da Legislação Penal e Ambiental e Dia do Advogado", category: "eventos" },
  { year: "2006", title: "Encontro sobre Advocacia Pública", description: "Participou do Encontro de Ideias sobre A atuação preventiva da Advocacia Pública na Solução de Conflitos Internos da Administração", category: "eventos" },
  { year: "2007", title: "Aprofundamento em Direito Civil e Processual", description: "Participação em eventos: V Fórum de Direito, V Semana dos Cursos Jurídicos (Temas Atuais do Direito Civil e Processo Civil), Jornada de Direito Penal", category: "eventos" },
  { year: "2008", title: "Formação em Direito", description: "Concluiu graduação com TCC sobre Usucapião de Bens Adjudicados pela Caixa Econômica Federal. Cursos de extensão em Medicina Legal e Oratória Forense", category: "formacao" },
  { year: "2014", title: "Especializações Simultâneas", description: "Iniciou Pós-Graduação em Direito Processual Civil (UNINTER) e Docência em Ensino Superior (UNIASSELVI)", category: "formacao" },
  { year: "2014", title: "Início em Ciências Contábeis", description: "Ingressou no curso de graduação em Ciências Contábeis (UNINTER)", category: "formacao" },
  { year: "2014", title: "Técnico em Transações Imobiliárias", description: "Formação técnica profissionalizante no Centro de Treinamento Profissionalizante (CETREP)", category: "formacao" },
  { year: "2015", title: "Ampliação da Formação", description: "Pós-Graduação em Direito do Trabalho e Processo do Trabalho (UNINTER) e início do MBA em Contabilidade & Direito Tributário (IPOG)", category: "formacao" },
  { year: "2015", title: "Cursos Internacionais", description: "Cursos de extensão: Economic Growth and Distributive Justice (Tel-Aviv University), Introduction aux droits de l'homme (Universidade de Genebra), An Introduction to American Law (University of Pennsylvania)", category: "complementar" },
  { year: "2015", title: "Direito Parental e de Família", description: "Extensão universitária em Direito Parental, Conjugal e de Família (180h - UCAM)", category: "complementar" },
  { year: "2015", title: "Editor de Periódico Jurídico", description: "Ingressou como membro do corpo editorial da revista Ius Gentium (Facinter)", category: "producoes" },
  { year: "2016", title: "Atuação em Direito Imobiliário", description: "Programa de Educação Continuada para Corretores de Imóveis - PROECCI (105h - COFECI)", category: "complementar" },
  { year: "2016", title: "Evento sobre Imóveis Leiloados", description: "Participação no evento Como Ganhar Dinheiro com Imóveis Leiloados", category: "eventos" },
  { year: "2017", title: "MBA Concluído", description: "Concluiu MBA em Contabilidade & Direito Tributário com TCC sobre Tributação de renda de mineração de Bitcoin auferida no Exterior", category: "formacao" },
  { year: "2018", title: "Marketing e Argumentação Jurídica", description: "Cursos de curta duração: Marketing Jurídico (6h), Argumentação Jurídica (5h), Disney e serviços jurídicos (4h) - Instituto Diálogo", category: "complementar" },
  { year: "2018", title: "Expansão Nacional - Múltiplas OABs", description: "Inscrição nas OABs de São Paulo (476.963), Rio Grande do Sul (107.048) e Distrito Federal (75.394), além da OAB/AM (8.894)", category: "atuacao" },
  { year: "2019", title: "Palestrante na Fenalaw", description: "Participou como palestrante da 16ª Edição da Fenalaw - Maior Feira e Congresso para o Mercado Jurídico da América Latina, apresentando sobre Gestão para PMEs", category: "eventos" },
  { year: "2020-2021", title: "Especialização em Crimes Digitais", description: "Pós-Graduação em Perícia em Crimes Digitais (360h - VERBOEDU) com TCC sobre Perícia de Pirâmides Financeiras", category: "formacao" },
  { year: "2021", title: "Graduação em Ciências Contábeis", description: "Concluiu graduação em Ciências Contábeis pela UNINTER", category: "formacao" },
  { year: "2021", title: "Lei do Superendividamento", description: "Atuação destacada na aplicação da Lei 14.181/2021 desde sua vigência, tornando-se referência nacional na defesa do superendividado", category: "atuacao" },
  { year: "2024", title: "Publicação do Livro", description: "Lançamento do 'Manual do Superendividado: como sair do vermelho e recuperar sua estabilidade financeira' - obra referência na aplicação da Lei 14.181/2021", category: "producoes" },
  { year: "2025", title: "Mais de 2.000 Planos Homologados", description: "R$ 35 milhões em dívidas renegociadas, 98% de taxa de sucesso e milhares de vidas transformadas através da aplicação da Lei do Superendividamento", category: "atuacao" }
];

export default function TimelineSection() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    setIsExpanded(false);
  };

  const filteredAchievements = selectedCategory === 'todos' 
    ? achievements 
    : selectedCategory === 'idiomas'
    ? []
    : achievements.filter(item => item.category === selectedCategory);

  const displayedAchievements = isExpanded ? filteredAchievements : filteredAchievements.slice(0, 5);

  const showIdiomas = selectedCategory === 'idiomas';
  const showAreasAtuacao = selectedCategory === 'atuacao';

  return (
    <section className="py-20 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6">
        <TimelineHeader />

        <TimelineFilters
          selectedCategory={selectedCategory}
          onFilterChange={handleFilterChange}
          totalCount={filteredAchievements.length}
        />

        <div id="timeline-content" role="tabpanel" aria-label="Conteúdo da trajetória profissional">
          {showIdiomas ? (
            <LanguageCards />
          ) : showAreasAtuacao && selectedCategory === 'atuacao' ? (
            <div className="mb-12">
              <AreaCards />
              <div className="space-y-8">
                {displayedAchievements.map((achievement, index) => (
                  <TimelineItem
                    key={index}
                    year={achievement.year}
                    title={achievement.title}
                    description={achievement.description}
                    index={index}
                  />
                ))}
              </div>
              {filteredAchievements.length > 5 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-700)] font-semibold"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? '− Mostrar Menos' : `+ Ver Mais ${filteredAchievements.length - 5} Registros`}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {displayedAchievements.map((achievement, index) => (
                  <TimelineItem
                    key={index}
                    year={achievement.year}
                    title={achievement.title}
                    description={achievement.description}
                    index={index}
                  />
                ))}
              </div>
              {filteredAchievements.length > 5 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-700)] font-semibold transition-colors"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? '− Mostrar Menos' : `+ Ver Mais ${filteredAchievements.length - 5} Registros`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}