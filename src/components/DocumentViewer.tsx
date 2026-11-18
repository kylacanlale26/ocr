import { useState } from 'react';
import { FileText, Image as ImageIcon, Maximize2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface DocumentViewerProps {
  previewUrl: string | null;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function DocumentViewer({
  previewUrl,
  fileName,
  mimeType,
  fileSizeBytes,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageError, setImageError] = useState(false);

  const isPdf = mimeType === 'application/pdf';

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 bg-slate-50/70">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900 truncate">
            {isPdf ? (
              <FileText className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <ImageIcon className="w-4 h-4 text-slate-500 shrink-0" />
            )}
            <span className="truncate">{fileName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 tabular-nums">
            <span>{mimeType || 'Unknown format'}</span>
            <span aria-hidden="true">·</span>
            <span>{formatBytes(fileSizeBytes)}</span>
          </div>
        </div>

        {!isPdf && previewUrl && !imageError && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))))}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-600 tabular-nums w-11 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
              title="Rotate 90 degrees"
              aria-label="Rotate 90 degrees"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
              }}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
              title="Reset view"
              aria-label="Reset view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative bg-slate-100/80 min-h-[380px] max-h-[540px] overflow-auto flex items-center justify-center p-4">
        {!previewUrl ? (
          <div className="text-center py-12 px-6">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700">No document preview available</p>
            <p className="text-xs text-slate-500 mt-1">
              Upload a PDF, PNG, or JPEG file or select a sample document above.
            </p>
          </div>
        ) : isPdf ? (
          <div className="w-full h-[480px] bg-white border border-slate-200 rounded-lg overflow-hidden">
            <iframe
              src={previewUrl}
              title={`PDF preview of ${fileName}`}
              className="w-full h-full border-0"
            />
          </div>
        ) : imageError ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-slate-50 border border-slate-200 rounded-lg w-full max-w-sm">
            <ImageIcon className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-sm font-medium text-slate-800">{fileName}</p>
            <p className="text-xs text-slate-500 mt-1">
              Image preview unavailable, but file data can still be processed.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center min-w-full min-h-full">
            <img
              src={previewUrl}
              alt={`Document scan preview: ${fileName}`}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
              className="max-w-full max-h-[480px] object-contain rounded shadow-sm transition-transform duration-150 origin-center"
            />
          </div>
        )}
      </div>
    </div>
  );
}
