export const API_BASE_URL = "http://138.124.14.177:8080/api";

export interface HealthResponse {
    status: string;
    model_loaded: boolean;
    model_type: string;
    model_path: string;
}

export interface Meta {
    total_rows: number;
    processed_rows: number;
    failed_rows: number;
    model_type: string;
    model_version: string;
}

export interface CategorySummary {
    category: string;
    count: number;
    amount: number;
}

export interface TimeSeriesPoint {
    period: string;
    total_amount: number;
    by_category: Record<string, number>;
}

export interface Summary {
    by_category: CategorySummary[];
    timeseries: TimeSeriesPoint[];
}

export interface TransactionRow {
    index: number;
    date: string;
    withdrawal: number;
    deposit: number;
    balance: number;
    predicted_category: string;
    probabilities: Record<string, number>;
    actual_category?: string;
    // Synthetic field for UI
    id?: string;
}

export interface Metrics {
    has_ground_truth: boolean;
    macro_f1: number | null;
    balanced_accuracy: number | null;
    accuracy: number | null;
}

export interface UploadResponse {
    meta: Meta;
    summary: Summary;
    rows: TransactionRow[];
    metrics: Metrics;
}

export const api = {
    checkHealth: async (): Promise<HealthResponse> => {
        try {
            const res = await fetch(`${API_BASE_URL}/health`);
            if (!res.ok) throw new Error("Health check failed");
            return res.json();
        } catch (error) {
            console.error(error);
            return { status: "error", model_loaded: false, model_type: "unknown", model_path: "" };
        }
    },

    uploadTransactions: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE_URL}/v1/transactions/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error(`Upload failed: ${res.statusText}`);
        }

        return res.json();
    }
};
