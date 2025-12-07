import { useMutation } from '@tanstack/react-query';
import { API_CONFIG } from '@/shared/config/api/config';
import { useAuthStore } from '@/features/auth/model/store';
import { formatErrorMessage } from '@/features/auth/model/api/utils/format-error';

type ImportResponse = {
  count?: number;
  // Backend may return extended payload later; keep it open-ended
  rows?: unknown[];
};

type ValidationErrorItem = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

type ImportError = {
  detail?: string | ValidationErrorItem[];
  message?: string;
};

const importRequest = async (file: File, token: string | null): Promise<ImportResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_CONFIG.API_BASE_URL}/transactions/import`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
  });

  const data = (await response.json().catch(() => null)) as ImportResponse | ImportError | null;

  if (!response.ok || !data) {
    const errorPayload = (data as ImportError) ?? {};
    throw {
      detail: errorPayload.detail ?? errorPayload.message ?? 'Не удалось загрузить файл',
    } satisfies ImportError;
  }

  return data as ImportResponse;
};

export const useImportTransactions = () => {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);

  const mutation = useMutation<ImportResponse, ImportError, File>({
    mutationFn: (file) => importRequest(file, getAccessToken()),
  });

  const uploadCsv = (file: File) => mutation.mutateAsync(file);

  const errorMessage = mutation.isError
    ? formatErrorMessage(mutation.error?.detail ?? undefined)
    : undefined;

  return {
    uploadCsv,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage,
    data: mutation.data,
  };
};
