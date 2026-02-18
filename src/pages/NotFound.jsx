import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, FileText, Search } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isBlogRoute = location.pathname.includes('blog') || location.pathname.includes('BlogPost');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-700)]">
            404
          </h1>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {isBlogRoute ? 'Artigo não encontrado' : 'Página não encontrada'}
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          {isBlogRoute 
            ? 'O artigo que você está procurando não existe, foi removido ou ainda não foi publicado.'
            : 'A página que você está procurando não existe, foi movida ou está temporariamente indisponível.'
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate(createPageUrl('Home'))}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          {isBlogRoute ? (
            <>
              <Button
                onClick={() => navigate(createPageUrl('Blog'))}
                className="w-full sm:w-auto bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
              >
                <Search className="w-4 h-4 mr-2" />
                Ver Todos os Artigos
              </Button>
              
              <Button
                onClick={() => navigate(createPageUrl('Home'))}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Home className="w-4 h-4 mr-2" />
                Página Inicial
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate(createPageUrl('Home'))}
                className="w-full sm:w-auto bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
              >
                <Home className="w-4 h-4 mr-2" />
                Ir para Início
              </Button>
              
              <Button
                onClick={() => navigate(createPageUrl('Blog'))}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Blog
              </Button>
            </>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Se você acredita que isso é um erro, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
}