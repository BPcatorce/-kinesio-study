'use client';
import { useState, useRef } from 'react';
import { FileAttachment } from '@/lib/types';
import { generateId } from '@/lib/store';
import { Upload, Trash2, File, FileImage, Download, Paperclip } from 'lucide-react';

interface Props {
  files: FileAttachment[];
  onUpdate: (files: FileAttachment[]) => void;
}

export default function FilesTab({ files, onUpdate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { alert(`${file.name} supera 10MB`); return; }
      const reader = new FileReader();
      reader.onload = e => {
        const attachment: FileAttachment = {
          id: generateId(),
          name: file.name,
          type: file.type,
          dataUrl: e.target!.result as string,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };
        onUpdate([attachment, ...files]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const remove = (id: string) => onUpdate(files.filter(f => f.id !== id));

  const download = (file: FileAttachment) => {
    const a = document.createElement('a');
    a.href = file.dataUrl; a.download = file.name; a.click();
  };

  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="h-full flex flex-col gap-4">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging ? 'border-accent bg-accent-dim' : 'border-border hover:border-soft hover:bg-panel'
        }`}>
        <Upload size={24} className={`mx-auto mb-2 ${dragging ? 'text-accent' : 'text-muted'}`} />
        <p className="text-sm text-soft">Arrastrá archivos aquí o hacé clic</p>
        <p className="text-xs text-muted mt-1">PDF, imágenes, documentos — máx 10MB por archivo</p>
        <input ref={inputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.txt" className="hidden"
          onChange={e => e.target.files && processFiles(e.target.files)} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {files.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted">
            <Paperclip size={28} className="mb-2 opacity-30" />
            <p className="text-sm">Sin archivos adjuntos</p>
          </div>
        )}
        {files.map(file => {
          const isImage = file.type.startsWith('image/');
          return (
            <div key={file.id} className="bg-panel border border-border rounded-xl overflow-hidden group animate-slide-up">
              {isImage && (
                <div className="bg-ink max-h-48 overflow-hidden flex items-center justify-center">
                  <img src={file.dataUrl} alt={file.name} className="max-w-full max-h-48 object-contain" />
                </div>
              )}
              <div className="flex items-center gap-3 p-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                  {isImage ? <FileImage size={16} className="text-teal" /> : <File size={16} className="text-accent" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text truncate">{file.name}</p>
                  <p className="text-xs text-muted">{formatSize(file.size)} · {new Date(file.uploadedAt).toLocaleDateString('es-AR')}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => download(file)} className="text-muted hover:text-accent transition-colors"><Download size={13} /></button>
                  <button onClick={() => remove(file.id)} className="text-muted hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
