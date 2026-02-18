import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Bold, Italic, List, ListOrdered, Link, Image, Code, Heading2 } from "lucide-react";

export default function MarkdownEditor({ value, onChange }) {
  const textareaRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const wordCount = value?.split(/\s+/).filter(Boolean).length || 0;
  const readTime = Math.ceil(wordCount / 200);
  const charCount = value?.length || 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'b':
            e.preventDefault();
            insertMarkdown('**', '**');
            break;
          case 'i':
            e.preventDefault();
            insertMarkdown('*', '*');
            break;
          case 'k':
            e.preventDefault();
            insertMarkdown('[', '](url)');
            break;
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
      return () => textarea.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const insertMarkdown = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentValue = value || '';
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentValue.substring(start, end);
    const newText = currentValue.substring(0, start) + before + selectedText + after + currentValue.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toolbarActions = [
    { icon: Heading2, action: () => insertMarkdown('## ', '\n'), tooltip: 'Título H2' },
    { icon: Bold, action: () => insertMarkdown('**', '**'), tooltip: 'Negrito (Ctrl+B)' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), tooltip: 'Itálico (Ctrl+I)' },
    { icon: List, action: () => insertMarkdown('\n- ', ''), tooltip: 'Lista' },
    { icon: ListOrdered, action: () => insertMarkdown('\n1. ', ''), tooltip: 'Lista Numerada' },
    { icon: Link, action: () => insertMarkdown('[', '](url)'), tooltip: 'Link (Ctrl+K)' },
    { icon: Image, action: () => insertMarkdown('![alt](', ')'), tooltip: 'Imagem' },
    { icon: Code, action: () => insertMarkdown('`', '`'), tooltip: 'Código Inline' }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {toolbarActions.map((item, i) => (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              onClick={item.action}
              title={item.tooltip}
              className="h-8 w-8 p-0"
            >
              <item.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-500">
            <span className="font-medium">{wordCount}</span> palavras
            <span className="mx-2">•</span>
            <span className="font-medium">{readTime}</span> min
            <span className="mx-2">•</span>
            <span className="font-medium">{charCount}</span> chars
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Editar' : 'Preview'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={showPreview ? 'hidden lg:block' : ''}>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escreva seu conteúdo em Markdown...

Atalhos:
Ctrl+B = Negrito
Ctrl+I = Itálico
Ctrl+K = Link"
            rows={20}
            className="font-mono text-sm resize-none"
          />
        </div>

        {showPreview && (
          <div className="border rounded-md p-6 min-h-[500px] overflow-y-auto bg-white">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({children}) => <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
                  p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="list-disc ml-6 mb-3">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal ml-6 mb-3">{children}</ol>,
                  code: ({inline, children}) => inline 
                    ? <code className="bg-gray-100 px-1 rounded text-sm">{children}</code>
                    : <pre className="bg-gray-900 text-white p-3 rounded overflow-x-auto"><code>{children}</code></pre>
                }}
              >
                {value || "*Nada para visualizar*"}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}