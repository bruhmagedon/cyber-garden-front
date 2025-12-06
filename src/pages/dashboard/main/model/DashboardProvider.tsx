import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { MOCK_DATA } from '@/pages/dashboard/main/mockData';
import { api, UploadResponse } from '@/shared/api/api';

type DashboardContextValue = {
  user: (typeof MOCK_DATA)['users'][number];
  apiData: UploadResponse | null;
  setApiData: React.Dispatch<React.SetStateAction<UploadResponse | null>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  isUploadDialogOpen: boolean;
  setIsUploadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpload: (files: File[]) => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiData, setApiData] = useState<UploadResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (!files.length) {
        return;
      }
      setIsUploading(true);
      try {
        const data = await api.uploadTransactions(files[0]);
        setApiData(data);
        setIsUploadDialogOpen(false);
      } catch (error) {
        console.error('Upload failed', error);
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      user: MOCK_DATA.users[0],
      apiData,
      setApiData,
      isUploading,
      setIsUploading,
      isUploadDialogOpen,
      setIsUploadDialogOpen,
      handleUpload,
    }),
    [apiData, handleUpload, isUploadDialogOpen, isUploading],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboardContext must be used within DashboardProvider');
  }

  return context;
};
