import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

export default function AIPreview({ artigo }) {
  if (!artigo) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{artigo.titulo}</CardTitle>
        <p className="text-sm text-[var(--text-secondary)]">{artigo.resumo}</p>
        <div className="flex gap-2 mt-2">
          {artigo.tags?.map((tag, i) => (
            <Badge key={i} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ReactMarkdown className="prose prose-sm max-w-none">
          {artigo.conteudo?.substring(0, 500) + "..."}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}