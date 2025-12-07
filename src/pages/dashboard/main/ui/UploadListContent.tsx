import { FileText, Loader2, XCircle } from 'lucide-react';
import {
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadList,
  useFileUpload,
} from '@/shared/ui/file-upload';
import { Button } from '@/shared/ui';

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
              <Button variant={'ghost'} className="p-1 text-red-500" size="icon">
                <XCircle size={18} />
              </Button>
            </FileUploadItemDelete>
          )}
        </FileUploadItem>
      ))}
    </FileUploadList>
  );
};
