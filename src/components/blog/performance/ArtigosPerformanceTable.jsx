import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ArtigosPerformanceTable({ artigos }) {
  const navigate = useNavigate();

  const calcularScorePerformance = (artigo) => {
    let score = 0;
    if (artigo.visualizacoes > 100) score += 30;
    if (artigo.score_seo_atual >= 80) score += 30;
    if (artigo.ab_test_ativo) score += 20;
    if (artigo.keywords?.length >= 3) score += 20;
    return score;
  };

  const artigosComScore = artigos.map(a => ({
    ...a,
    score_performance: calcularScorePerformance(a)
  })).sort((a, b) => b.score_performance - a.score_performance);

  return (
    <Card className="p-6">
      <h3 className="font-bold mb-4">Performance Detalhada</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Artigo</TableHead>
            <TableHead>Visualizações</TableHead>
            <TableHead>SEO Score</TableHead>
            <TableHead>A/B Test</TableHead>
            <TableHead>Performance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artigosComScore.slice(0, 20).map(artigo => (
            <TableRow
              key={artigo.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/EditorBlog?id=${artigo.id}`)}
            >
              <TableCell>
                <div>
                  <p className="font-medium">{artigo.titulo}</p>
                  <p className="text-xs text-gray-500">{artigo.categoria}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{artigo.visualizacoes || 0}</span>
                  {artigo.visualizacoes > 50 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={
                  artigo.score_seo_atual >= 80 ? 'bg-green-600' :
                  artigo.score_seo_atual >= 60 ? 'bg-yellow-600' :
                  'bg-red-600'
                }>
                  {artigo.score_seo_atual || 0}/100
                </Badge>
              </TableCell>
              <TableCell>
                {artigo.ab_test_ativo ? (
                  <Badge className="bg-purple-600">Ativo</Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        artigo.score_performance >= 70 ? 'bg-green-500' :
                        artigo.score_performance >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${artigo.score_performance}%` }}
                    />
                  </div>
                  <span className="text-sm">{artigo.score_performance}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}