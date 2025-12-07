export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

const normalizeTransactions = (items: any[]): UploadResponse => {
    const rows: TransactionRow[] = items.map((item, index) => ({
        index,
        id: item.id ?? `tx-${index}`,
        date: item.date ?? new Date().toISOString(),
        withdrawal: Number(item.withdrawal ?? 0),
        deposit: Number(item.deposit ?? 0),
        balance: Number(item.balance ?? 0),
        predicted_category: item.category ?? 'Uncategorized',
        actual_category: item.category ?? undefined,
        probabilities: {},
    }));

    const byCategoryMap = new Map<string, { amount: number; count: number }>();
    rows.forEach((row) => {
        if (row.withdrawal > 0) {
            const cat = row.actual_category ?? row.predicted_category ?? 'Uncategorized';
            const current = byCategoryMap.get(cat) ?? { amount: 0, count: 0 };
            byCategoryMap.set(cat, {
                amount: current.amount + row.withdrawal,
                count: current.count + 1,
            });
        }
    });

    const by_category = Array.from(byCategoryMap.entries()).map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
    }));

    const timeseriesMap = new Map<string, { total_amount: number; by_category: Record<string, number> }>();
    rows.forEach((row) => {
        const period = (row.date ?? '').slice(0, 7) || 'unknown';
        const cat = row.actual_category ?? row.predicted_category ?? 'Uncategorized';
        const bucket = timeseriesMap.get(period) ?? { total_amount: 0, by_category: {} };
        bucket.total_amount += row.withdrawal;
        bucket.by_category[cat] = (bucket.by_category[cat] ?? 0) + row.withdrawal;
        timeseriesMap.set(period, bucket);
    });

    const timeseries = Array.from(timeseriesMap.entries()).map(([period, data]) => ({
        period,
        total_amount: data.total_amount,
        by_category: data.by_category,
    }));

    return {
        meta: {
            total_rows: rows.length,
            processed_rows: rows.length,
            failed_rows: 0,
            model_type: 'transactions',
            model_version: '1.0',
        },
        summary: {
            by_category,
            timeseries,
        },
        rows,
        metrics: {
            has_ground_truth: false,
            macro_f1: null,
            balanced_accuracy: null,
            accuracy: null,
        },
    };
};

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
    },

    getTransactions: async (limit: number = 50, offset: number = 0): Promise<UploadResponse> => {
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        const res = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`, {
             headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
             },
             credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch transactions: ${res.statusText}`);
        }

        const data = await res.json();
        const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        return normalizeTransactions(items);
    }
};
