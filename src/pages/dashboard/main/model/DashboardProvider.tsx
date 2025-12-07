import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MOCK_DATA } from '@/pages/dashboard/main/mockData';
import { UploadResponse, api } from '@/shared/api/api';
import { useImportTransactions } from '@/features/csv-upload/model/use-import-transactions';

type DashboardContextValue = {
  user: (typeof MOCK_DATA)['users'][number];
  apiData: UploadResponse | null;
  setApiData: React.Dispatch<React.SetStateAction<UploadResponse | null>>;
  isUploading: boolean;
  isUploadDialogOpen: boolean;
  setIsUploadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpload: (files: File[]) => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiData, setApiData] = useState<UploadResponse | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const {
    uploadCsv,
    isPending: isUploading,
  } = useImportTransactions();

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (!files.length) {
        return;
      }
      try {
        setIsFetching(true);
        // 1. Upload File
        await uploadCsv(files[0]);

        // 2. Fetch processed data (using limit=1000 to get enough data for charts)
        const result = await api.getTransactions(100, 0);

        setApiData(result as UploadResponse);

        if (result) {
          setIsUploadDialogOpen(false);
        }
      } catch (error) {
        console.error('Upload failed', error);
      } finally {
        setIsFetching(false);
      }
    },
    [uploadCsv],
  );

  const value = useMemo(
    () => ({
      user: MOCK_DATA.users[0],
      apiData,
      setApiData,
      isUploading: isUploading || isFetching,
      isUploadDialogOpen,
      setIsUploadDialogOpen,
      handleUpload,
    }),
    [apiData, handleUpload, isUploadDialogOpen, isUploading, isFetching],
  );

  useEffect(() => {
    // Initial fetch of transactions on mount
    const load = async () => {
      try {
        setIsFetching(true);
        const result = await api.getTransactions(100, 0);
        setApiData(result);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      } finally {
        setIsFetching(false);
      }
    };

    load();
  }, []);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboardContext must be used within DashboardProvider');
  }

  return context;
};
