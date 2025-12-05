import { Upload, X } from 'lucide-react';
import { type DragEvent, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui';

interface AddMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddMeetingModal = ({ open, onOpenChange }: AddMeetingModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    // TODO: Implement file upload logic
    console.log('Uploading:', { file, filePath });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-[721px] gap-0 rounded-3xl border border-fill-quaternary bg-fill-primary p-5 lg:p-8"
      >
        {/* Header */}
        <DialogHeader className="mb-10 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="font-semibold text-2xl text-text-tertiary leading-7 lg:text-3xl lg:leading-8">
            Добавление встречи
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center transition-opacity hover:opacity-70"
          >
            <X className="h-5 w-5 text-text-secondary" />
          </button>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col gap-5">
          {/* File Upload Area */}
          <button
            type="button"
            onClick={handleFileInputClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex h-52 cursor-pointer flex-col items-center justify-center gap-3.5 rounded-2xl border-2 border-fill-quaternary border-dashed transition-colors hover:border-text-secondary ${isDragging ? 'border-primary bg-fill-secondary' : ''}
            `}
          >
            <Upload className="h-8 w-8 text-text-tertiary" />
            <p className="px-4 text-center font-['Raleway'] font-semibold text-text-tertiary text-xl">
              Вставьте сюда файл
              <br className="lg:hidden" /> для транскрипции
            </p>
            <p className="text-center font-medium text-sm text-text-secondary">
              Максимальный размер файла 1 гб
            </p>
            {file && <p className="font-medium text-primary text-sm">Выбран: {file.name}</p>}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="audio/*,video/*"
          />

          {/* File Path Input */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="Вставить путь"
              className="h-12 rounded-xl border border-fill-quaternary bg-transparent px-3 py-3 font-semibold text-sm text-text-quaternary transition-colors placeholder:text-text-secondary focus:border-primary focus:outline-none"
            />
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleUpload}
            className="flex h-11 items-center justify-center rounded-lg bg-primary px-3 py-1.5 transition-colors hover:bg-primary-hover"
          >
            <span className="font-semibold text-on-primary text-sm">Загрузить</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
