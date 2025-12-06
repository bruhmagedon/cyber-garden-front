import { FileText, Loader2, XCircle } from 'lucide-react';
import {
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadList,
  useFileUpload,
} from '@/shared/ui/file-upload';

export const UploadListContent = ({ isUploading }: { isUploading: boolean }) => {
  const files = useFileUpload((state) => Array.from(state.files.keys()));

  if (!files.length) {
    return null;
  }

  return (
    <FileUploadList>
      {files.map((file) => (
        <FileUploadItem
          key={file.name}
          value={file}
          className="mt-4 flex items-center gap-3 rounded-lg border p-3"
        >
          <div className="rounded-lg bg-fill-tertiary p-2">
            <FileText size={18} />
          </div>
          <FileUploadItemMetadata className="min-w-0 flex-1" />
          {isUploading ? (
            <Loader2 className="animate-spin text-primary" size={20} />
          ) : (
            <FileUploadItemDelete asChild>
              <button className="rounded p-1 text-red-500 hover:bg-red-50">
                <XCircle size={18} />
              </button>
            </FileUploadItemDelete>
          )}
        </FileUploadItem>
      ))}
    </FileUploadList>
  );
};
