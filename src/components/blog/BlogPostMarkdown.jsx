import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function BlogPostMarkdown({ content }) {
  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    console.log('✍️ [BlogPostMarkdown] Render Mode:', {
      isDarkMode: isDark,
      darkClassPresent: document.documentElement.classList.contains('dark'),
      expectedTextColor: isDark ? '#f9fafb (white)' : '#111827 (dark gray)',
      actualComputedColor: getComputedStyle(document.body).color
    });
  }, [content]);

  return (
    <ReactMarkdown
      components={{
        h1: ({children}) => <h1 className="text-3xl font-bold mb-4 mt-8 text-[#111827] dark:text-[var(--brand-primary)]">{children}</h1>,
        h2: ({children}) => <h2 className="text-2xl font-bold mb-3 mt-6 text-[#111827] dark:text-[var(--brand-primary)]">{children}</h2>,
        h3: ({children}) => <h3 className="text-xl font-bold mb-2 mt-4 text-[#111827] dark:text-[var(--brand-primary)]">{children}</h3>,
        p: ({children}) => <p className="mb-4 leading-relaxed text-[#111827] dark:text-[#f9fafb]">{children}</p>,
        a: ({children, href}) => <a href={href} className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-600)] dark:hover:text-[var(--brand-primary-400)]" target="_blank" rel="noopener noreferrer">{children}</a>,
        ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-[#111827] dark:text-[#f9fafb]">{children}</ul>,
        ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-[#111827] dark:text-[#f9fafb]">{children}</ol>,
        li: ({children}) => <li className="text-[#111827] dark:text-[#f9fafb]">{children}</li>,
        strong: ({children}) => <strong className="font-bold text-[#111827] dark:text-white">{children}</strong>,
        blockquote: ({children}) => <blockquote className="border-l-4 border-[var(--brand-primary)] pl-4 italic my-4 text-[#4b5563] dark:text-[#d1d5db]">{children}</blockquote>,
        code: ({inline, children}) => inline 
          ? <code className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
          : <pre className="bg-[#0f172a] dark:bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code className="font-mono text-sm">{children}</code></pre>,
        img: ({src, alt}) => <img src={src} alt={alt} className="rounded-lg my-6 w-full" loading="lazy" />
      }}
    >
      {content}
    </ReactMarkdown>
  );
}