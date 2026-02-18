import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function FlipbookViewer({ pdfUrl, title }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);

  // Renderizar PDF usando iframe
  return (
    <Card className="w-full">
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="bg-[var(--bg-tertiary)] p-4 border-b border-[var(--border-primary)] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(Math.max(zoom - 10, 50))}
              disabled={zoom <= 50}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(Math.min(zoom + 10, 200))}
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>

            {/* Download */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = `${title}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-[var(--bg-secondary)] min-h-[600px] flex items-center justify-center overflow-auto">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            width="100%"
            height="600"
            style={{ border: 'none', zoom: `${zoom}%` }}
            title={title}
          />
        </div>

        {/* Footer - Navigation */}
        <div className="bg-[var(--bg-tertiary)] p-4 border-t border-[var(--border-primary)] flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(pdfUrl, '_blank')}
          >
            Abrir em Nova Aba
          </Button>
          <span className="text-sm text-[var(--text-secondary)]">
            Flipbook do Processo
          </span>
        </div>
      </CardContent>
    </Card>
  );
}