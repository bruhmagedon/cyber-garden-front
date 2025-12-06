"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { MOCK_DATA } from "./mockData";
import { DonutChart } from "@/shared/ui/donut-chart";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Target,
  Zap,
  Bell,
  Search,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Music,
  MoreHorizontal,
  CreditCard,
  UploadCloud,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown
} from "lucide-react";
import { cn } from "@/shared/utils";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/Tabs/Tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/shared/ui/Dialog/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select/Select";
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadList,
    FileUploadItem,
    FileUploadItemPreview,
    FileUploadItemMetadata,
    FileUploadItemDelete,
  } from "@/shared/ui/file-upload";

import { MetricCircle } from "./components/MetricCircle";

// Magic UI
import NumberTicker from "@/shared/ui/magic/number-ticker";
import BlurFade from "@/shared/ui/magic/blur-fade";
import ShineBorder from "@/shared/ui/magic/shine-border";
import DotPattern from "@/shared/ui/magic/dot-pattern";
import { SparklesCore } from "@/shared/ui/magic/sparkles";

// API
import { api, HealthResponse, UploadResponse, TransactionRow } from "@/shared/api/api";

// --- Data Configuration ---

const MOCK_TRANSACTIONS = Array.from({ length: 50 }).map((_, i) => ({
  id: `tx-${i}`,
  title: [
    "Uber Ride", "Supermarket", "Netflix Subscription", "Coffee Shop", 
    "Rent Payment", "Freelance Income", "Gym Membership", "Restaurant"
  ][i % 8],
  amount: Math.floor(Math.random() * 5000) + 150,
  date: new Date(2025, 10, 30 - i).toISOString(),
  type: i % 6 === 5 ? "income" : "expense",
  categoryId: ["transport", "food", "subscriptions", "cafes", "rent", "salary", "health", "cafes"][i % 8],
  probabilities: undefined as Record<string, number> | undefined,
}));

const CATEGORY_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  salary: { color: "#10b981", icon: Wallet, label: "Зарплата" },
  food: { color: "#f59e0b", icon: ShoppingBag, label: "Продукты" },
  cafes: { color: "#ef4444", icon: Coffee, label: "Кафе" },
  transport: { color: "#3b82f6", icon: Car, label: "Транспорт" },
  subscriptions: { color: "#8b5cf6", icon: Music, label: "Подписки" },
  rent: { color: "#ec4899", icon: Home, label: "Аренда" },
  other: { color: "#6b7280", icon: MoreHorizontal, label: "Прочее" },
  health: { color: "#14b8a6", icon: Zap, label: "Здоровье" },
  // Fallback map for API categories
  Food: { color: "#f59e0b", icon: ShoppingBag, label: "Еда" },
  Misc: { color: "#6b7280", icon: MoreHorizontal, label: "Разное" },
};

const getCategoryConfig = (catName: string) => {
    if (!catName) return { color: "#9ca3af", icon: MoreHorizontal, label: "Неизвестно" };
    // Try exact match
    if (CATEGORY_CONFIG[catName]) return CATEGORY_CONFIG[catName];
    // Try lowercase match
    if (CATEGORY_CONFIG[catName.toLowerCase()]) return CATEGORY_CONFIG[catName.toLowerCase()];
    
    // Auto-generate or fallback
    return {
        color: stringToColor(catName),
        icon: MoreHorizontal,
        label: catName
    }
}

function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
   return new Date(dateStr).toLocaleDateString("ru-RU", { day: 'numeric', month: 'long', year: 'numeric' });
}

// --- Components with Infinite Scroll ---

const InfiniteScrollTable = ({ items, renderItem, emptyMessage }: { items: any[], renderItem: (item: any, index: number) => React.ReactNode, emptyMessage: string }) => {
    const [page, setPage] = useState(1);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && items.length > page * 20) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [items.length, page]);

    const visibleItems = items.slice(0, page * 20);

    return (
         <div className="rounded-xl border border-border overflow-hidden bg-card">
             <div className="max-h-[600px] overflow-auto custom-scrollbar">
                 <table className="w-full text-sm">
                    <thead className="bg-fill-secondary/50 text-text-secondary font-medium sticky top-0 z-10 backdrop-blur">
                         {/* Header is handled by parent context usually, but here we can't genericize easily without prop. 
                             Assuming standard Layout for simplicity or passing header prop. 
                             Let's just render body here and let parent handle table structure? 
                             No, let's keep it simple. */}
                    </thead>
                     <tbody className="divide-y divide-border/50">
                        {visibleItems.length > 0 ? (
                            visibleItems.map((item, idx) => {
                                if (idx === visibleItems.length - 1) {
                                    return <tr key={item.id + idx} ref={lastElementRef as any}>{renderItem(item, idx)}</tr>
                                }
                                return <tr key={item.id + idx}>{renderItem(item, idx)}</tr>
                            })
                        ) : (
                            <tr>
                                <td colSpan={10} className="px-4 py-8 text-center text-text-tertiary">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                     </tbody>
                 </table>
             </div>
         </div>
    );
}

const TransactionList = ({ transactions, filterTitle }: { transactions: any[], filterTitle: string }) => {
     const [page, setPage] = useState(1);
     // Reset page when search changes
     useEffect(() => { setPage(1) }, [filterTitle, transactions]);

     const observer = useRef<IntersectionObserver | null>(null);
     const lastElementRef = useCallback((node: HTMLTableRowElement | null) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && transactions.length > page * 20) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [transactions.length, page]);
    
    const visibleItems = transactions.slice(0, page * 20);

    return (
        <BlurFade>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                        <CardTitle>История операций</CardTitle>
                        <CardDescription>
                            Всего: {transactions.length}
                        </CardDescription>
                        </div>
                        {/* Search is handled in parent and passed via filtered transactions */}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-border overflow-hidden">
                        <div className="max-h-[600px] overflow-auto custom-scrollbar relative">
                            <table className="w-full text-sm">
                                <thead className="bg-fill-secondary/50 text-text-secondary font-medium sticky top-0 z-10 backdrop-blur">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Описание</th>
                                        <th className="px-4 py-3 text-left">Категория (ML)</th>
                                        <th className="px-4 py-3 text-left hidden sm:table-cell">Дата</th>
                                        <th className="px-4 py-3 text-right">Сумма</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {visibleItems.length > 0 ? visibleItems.map((tx, idx) => {
                                        const catConfig = getCategoryConfig(tx.categoryId);
                                        const confidence = tx.probabilities ? (tx.probabilities[tx.categoryId] * 100).toFixed(0) : null;
                                        const isLast = idx === visibleItems.length - 1;

                                        return (
                                            <tr 
                                                key={tx.id + idx} 
                                                ref={isLast ? lastElementRef : undefined}
                                                className="group hover:bg-fill-secondary/30 transition-colors"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-fill-tertiary flex items-center justify-center text-text-secondary group-hover:scale-110 transition-transform">
                                                            {tx.type === 'income' ? <ArrowRight className="rotate-[-45deg] text-green-500 w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                                        </div>
                                                        <span className="font-medium group-hover:text-foreground transition-colors truncate max-w-[200px] block" title={tx.title}>
                                                            {tx.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ background: catConfig.color }} />
                                                        <span className="text-text-secondary">{catConfig.label}</span>
                                                        {confidence && (
                                                            <span className="text-[10px] bg-fill-secondary px-1.5 rounded text-text-tertiary" title="ML Confidence">
                                                                {confidence}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-text-tertiary hidden sm:table-cell">
                                                    {formatDate(tx.date)}
                                                </td>
                                                <td className={cn("px-4 py-3 text-right font-semibold", tx.type === 'income' ? 'text-green-600' : 'text-foreground')}>
                                                    {formatCurrency(tx.amount)}
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                         <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-text-tertiary">
                                                Ничего не найдено
                                            </td>
                                         </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </BlurFade>
    )
}

const MLDetailsList = ({ transactions }: { transactions: any[] }) => {
    const [page, setPage] = useState(1);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLTableRowElement | null) => {
       if (observer.current) observer.current.disconnect();
       observer.current = new IntersectionObserver(entries => {
           if (entries[0].isIntersecting && transactions.length > page * 20) {
               setPage(prev => prev + 1);
           }
       });
       if (node) observer.current.observe(node);
   }, [transactions.length, page]);
   
   const visibleItems = transactions.slice(0, page * 20);

   return (
       <BlurFade>
           <Card>
               <CardHeader>
                   <CardTitle>Детализация ML</CardTitle>
                   <CardDescription>Подробные метрики по каждой транзакции</CardDescription>
               </CardHeader>
               <CardContent>
                    <div className="rounded-xl border border-border overflow-hidden">
                        <div className="max-h-[600px] overflow-auto custom-scrollbar relative">
                            <table className="w-full text-sm">
                                <thead className="bg-fill-secondary/50 text-text-secondary font-medium sticky top-0 z-10 backdrop-blur">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Транзакция</th>
                                        <th className="px-4 py-3 text-left">Предсказание</th>
                                        <th className="px-4 py-3 text-left w-1/3">Топ категорий (Вероятности)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {visibleItems.length > 0 ? visibleItems.map((tx, idx) => {
                                        const catConfig = getCategoryConfig(tx.categoryId);
                                        const isLast = idx === visibleItems.length - 1;
                                        const probs = tx.probabilities || {};
                                        // Sort probs
                                        const sortedProbs = Object.entries(probs)
                                            .sort(([, a], [, b]) => (b as number) - (a as number))
                                            .slice(0, 3); // Top 3

                                        return (
                                            <tr key={tx.id + idx} ref={isLast ? lastElementRef : undefined} className="group hover:bg-fill-secondary/30">
                                                <td className="px-4 py-3 font-medium">{tx.title}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ background: catConfig.color }} />
                                                        <span>{catConfig.label}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col gap-1.5">
                                                        {sortedProbs.map(([cat, prob]) => (
                                                            <div key={cat} className="flex items-center gap-2 text-xs">
                                                                <span className="w-24 truncate text-text-secondary" title={cat}>{cat}</span>
                                                                <div className="flex-1 h-1.5 bg-fill-secondary rounded-full overflow-hidden">
                                                                    <div 
                                                                        className="h-full bg-primary/70" 
                                                                        style={{ width: `${(prob as number) * 100}%` }}
                                                                    />
                                                                </div>
                                                                <span className="w-8 text-right text-text-tertiary">{((prob as number) * 100).toFixed(0)}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr><td colSpan={3} className="p-4 text-center">Нет данных</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
               </CardContent>
           </Card>
       </BlurFade>
   )
}

const MainPageAsync = () => {
  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSegmentLabel, setActiveSegmentLabel] = useState<string | null>(null);
  
  // Filters
  const [txFilterCategory, setTxFilterCategory] = useState<string>("all");
  const [txSearch, setTxSearch] = useState("");

  // API State
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [apiData, setApiData] = useState<UploadResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  useEffect(() => {
      api.checkHealth().then(setHealth);
  }, []);

  // Data Selectors (Mock vs Real)
  const isRealData = !!apiData;
  const user = MOCK_DATA.users[0]; // Still use mock user profile
  
  const currentTransactions = useMemo(() => {
      if (apiData) {
          return apiData.rows.map((row, idx) => ({
              id: `api-tx-${idx}`, // Generate ID
              title: `Операция #${row.index}`, // Fallback title or use index
              amount: row.withdrawal > 0 ? row.withdrawal : row.deposit,
              date: row.date,
              type: row.deposit > 0 ? "income" : "expense",
              categoryId: row.predicted_category,
              probabilities: row.probabilities,
          }));
      }
      return MOCK_TRANSACTIONS;
  }, [apiData]);

  const chartData = useMemo(() => {
    if (apiData) {
        // Map API summary to Chart Data
        return apiData.summary.by_category.map(c => {
             const conf = getCategoryConfig(c.category);
             return {
                 value: c.amount,
                 color: conf.color,
                 label: conf.label,
                 categoryId: c.category
             };
        }).sort((a, b) => b.value - a.value);
    }

    // Mock Fallback
    return MOCK_DATA.budgets
      .filter(b => b.month === "2025-11")
      .map(b => ({
        value: b.limit,
        color: CATEGORY_CONFIG[b.categoryId]?.color || "#9ca3af",
        label: CATEGORY_CONFIG[b.categoryId]?.label || b.categoryId,
        categoryId: b.categoryId,
      }))
      .sort((a, b) => b.value - a.value);
  }, [apiData]);

  const totalBudget = chartData.reduce((sum, item) => sum + item.value, 0);

  // Derived state for Donut Chart Content
  const activeChartItem = useMemo(() => {
     if (activeSegmentLabel) {
        return chartData.find(d => d.label === activeSegmentLabel);
     }
     return null;
  }, [activeSegmentLabel, chartData]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
     return currentTransactions.filter(tx => {
        const matchesCategory = txFilterCategory === "all" || tx.categoryId === txFilterCategory;
        const matchesSearch = tx.title.toLowerCase().includes(txSearch.toLowerCase());
        return matchesCategory && matchesSearch;
     });
  }, [txFilterCategory, txSearch, currentTransactions]);

  const handleUpload = async (files: File[]) => {
      if (files.length === 0) return;
      setIsUploading(true);
      try {
          const data = await api.uploadTransactions(files[0]);
          setApiData(data);
          setIsUploadDialogOpen(false);
          setActiveTab("overview"); // Switch to overview to show new data
      } catch (e) {
          console.error("Upload failed", e);
          // Ideally show toast error here
      } finally {
          setIsUploading(false);
      }
  };

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden relative">
      
      {/* Background Pattern */}
      <DotPattern 
        className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
            "opacity-30 dark:opacity-20 fixed inset-0 z-0 text-primary/50"
        )} 
      />

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 relative z-10">
        
        {/* Header / Hero */}
        <BlurFade delay={0.1} yOffset={20}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 animate-in fade-in zoom-in duration-500">
                    С возвращением, {user.name} 👋
                    </h1>
                    {health && (
                        <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border", health.model_loaded ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-red-500/10 text-red-600 border-red-500/20")}>
                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", health.model_loaded ? "bg-green-500" : "bg-red-500")} />
                            {health.model_loaded ? `Модель: ${health.model_type}` : "Модель не готова"}
                        </div>
                    )}
                </div>
                <p className="text-text-secondary">
                   {isRealData ? "Анализ загруженных данных" : "Демонстрационный режим"}
                </p>
             </div>
             
             <div className="flex items-center gap-3">
                {/* Upload Button */}
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm">
                            <UploadCloud size={18} />
                            <span>Загрузить CSV</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Загрузка выписки</DialogTitle>
                            <DialogDescription>
                                Загрузите CSV файл с транзакциями для анализа категорий.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                            <FileUpload 
                                accept="text/csv" 
                                maxFiles={1} 
                                onUpload={handleUpload}
                            >
                                <FileUploadDropzone className="border-2 border-dashed border-border rounded-xl p-8 hover:bg-fill-secondary/50 transition-colors cursor-pointer text-center group">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                                            <UploadCloud size={24} />
                                        </div>
                                        <p className="text-sm font-medium">Перетащите файл сюда или кликните</p>
                                        <p className="text-xs text-text-tertiary">Поддерживается только CSV</p>
                                    </div>
                                </FileUploadDropzone>
                                <FileUploadList showContainer={true}>
                                    {(files) => files.map(file => (
                                        <FileUploadItem key={file.name} file={file} className="mt-4 p-3 border rounded-lg flex items-center gap-3">
                                            <div className="p-2 bg-fill-tertiary rounded-lg">
                                                <FileText size={18} />
                                            </div>
                                            <FileUploadItemMetadata className="flex-1 min-w-0" />
                                            {isUploading ? (
                                                <Loader2 className="animate-spin text-primary" size={20} />
                                            ) : (
                                                <FileUploadItemDelete asChild>
                                                    <button className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                        <XCircle size={18} />
                                                    </button>
                                                </FileUploadItemDelete>
                                            )}
                                        </FileUploadItem>
                                    ))}
                                </FileUploadList>
                            </FileUpload>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog>
                   <DialogTrigger asChild>
                      <button className="relative p-2.5 rounded-full hover:bg-fill-secondary transition-colors border border-border/50 group bg-background/50 backdrop-blur-sm">
                         <Bell size={20} className="text-text-secondary group-hover:text-foreground transition-colors" />
                         {MOCK_DATA.notificationsLog.some(n => !n.read) && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background animate-pulse" />
                         )}
                      </button>
                   </DialogTrigger>
                   <DialogContent>
                      <DialogHeader>
                         <DialogTitle>Уведомления</DialogTitle>
                         <DialogDescription>История важных событый</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
                         {MOCK_DATA.notificationsLog.map(note => (
                              <div key={note.id} className={cn("p-3 rounded-lg border", note.read ? "bg-background border-border" : "bg-fill-secondary border-primary/20")}>
                                 <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm">
                                       {note.type === 'budget_limit' ? 'Лимит бюджета' : 'Системное сообщение'}
                                    </span>
                                    <span className="text-[10px] text-text-tertiary">{new Date(note.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 <p className="text-sm text-text-secondary">
                                    {note.type === 'budget_limit' 
                                      ? `Внимание! Лимит бюджета.` 
                                      : JSON.stringify(note.payload)}
                                 </p>
                              </div>
                         ))}
                      </div>
                   </DialogContent>
                </Dialog>

                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 ring-2 ring-background">
                   {user.name[0]}
                </div>
             </div>
          </div>
        </BlurFade>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
           <BlurFade delay={0.2}>
             <TabsList className="w-full md:w-auto bg-fill-secondary/50 p-1 border border-fill-quaternary/50 backdrop-blur-sm overflow-x-auto">
                <TabsTrigger value="overview" className="flex-1 md:flex-none min-w-[120px]">Обзор</TabsTrigger>
                <TabsTrigger value="transactions" className="flex-1 md:flex-none min-w-[120px]">История</TabsTrigger>
                <TabsTrigger value="goals" className="flex-1 md:flex-none min-w-[120px]">Цели</TabsTrigger>
                {apiData && <TabsTrigger value="ml_details" className="flex-1 md:flex-none min-w-[120px]">ML Детализация</TabsTrigger>}
                {apiData && <TabsTrigger value="metrics" className="flex-1 md:flex-none min-w-[120px]">ML Метрики</TabsTrigger>}
             </TabsList>
           </BlurFade>
            
           {/* If we have API Data, show Meta stats in a responsive grid atop content */}
           {apiData && (
               <BlurFade delay={0.25} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
                       <span className="text-xs text-text-tertiary uppercase font-bold">Строк всего</span>
                       <span className="text-2xl font-bold"><NumberTicker value={apiData.meta.total_rows} /></span>
                   </div>
                   <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
                       <span className="text-xs text-text-tertiary uppercase font-bold">Обработано</span>
                       <span className="text-2xl font-bold text-green-600"><NumberTicker value={apiData.meta.processed_rows} /></span>
                   </div>
                   <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
                       <span className="text-xs text-text-tertiary uppercase font-bold">Ошибки</span>
                       <span className={cn("text-2xl font-bold", apiData.meta.failed_rows > 0 ? "text-red-500" : "text-text-secondary")}>
                           <NumberTicker value={apiData.meta.failed_rows} />
                        </span>
                   </div>
                   <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
                       <span className="text-xs text-text-tertiary uppercase font-bold">Версия Модели</span>
                       <span className="text-sm font-medium truncate mt-1">{apiData.meta.model_type}</span>
                   </div>
               </BlurFade>
           )}

           {/* TAB: OVERVIEW */}
           <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
              
              {/* Main Visuals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Interactive Chart Section */}
                  <BlurFade delay={0.6} className="lg:col-span-2">
                    <ShineBorder 
                        className="bg-card border shadow-sm h-full" 
                        color={["#3b82f6", "#8b5cf6", "#ec4899"]} // blue, violet, pink
                        borderRadius={16}
                    >
                       <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                             <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                <Target className="w-4 h-4" />
                             </div>
                             {isRealData ? "Анализ Расходов" : "Планируемые Расходы"}
                          </CardTitle>
                          <CardDescription>
                            {isRealData ? "Распределение фактических трат по категориям" : "Ваш примерный бюджет"}
                          </CardDescription>
                       </CardHeader>
                       <CardContent>
                          <div className="flex flex-col xl:flex-row items-center justify-around gap-8 py-4 px-2">
                             {/* Chart */}
                             <div className="relative shrink-0 group filter transition-all duration-300">
                                <DonutChart 
                                   data={chartData} 
                                   size={260} 
                                   strokeWidth={24}
                                   activeSegmentLabel={activeSegmentLabel}
                                   onSegmentHover={(seg) => setActiveSegmentLabel(seg ? seg.label : null)}
                                   centerContent={
                                      <motion.div 
                                        key={activeChartItem ? activeChartItem.label : 'total'}
                                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="text-center flex flex-col items-center"
                                      >
                                         <span className="text-sm text-text-secondary font-medium dark:text-text-tertiary">
                                            {activeChartItem ? "Категория" : "Всего"}
                                         </span>
                                         <span className={cn("text-2xl font-bold tracking-tight tabular-nums", activeChartItem ? "text-primary" : "text-foreground")}>
                                            <NumberTicker 
                                                value={activeChartItem ? activeChartItem.value : totalBudget} 
                                                delay={0}
                                            />
                                         </span>
                                         <span className="text-[10px] font-bold text-text-tertiary uppercase truncate max-w-[120px] mt-1 tracking-widest">
                                            {activeChartItem ? activeChartItem.label : "RUB"}
                                         </span>
                                      </motion.div>
                                   }
                                />
                             </div>

                             {/* Interactive Legend */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:w-auto overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                {chartData.map((item) => {
                                   const isActive = activeSegmentLabel === item.label;
                                   return (
                                      <motion.button
                                         key={item.categoryId + item.label}
                                         whileHover={{ scale: 1.02, x: 2 }}
                                         whileTap={{ scale: 0.98 }}
                                         onMouseEnter={() => setActiveSegmentLabel(item.label)}
                                         onMouseLeave={() => setActiveSegmentLabel(null)}
                                         className={cn(
                                            "flex items-center justify-between gap-4 p-3 rounded-xl border transition-all text-left min-w-[170px]",
                                            isActive 
                                               ? "bg-primary/5 border-primary/50 shadow-md shadow-primary/10" 
                                               : "bg-background/50 border-border/40 hover:bg-fill-secondary"
                                         )}
                                      >
                                         <div className="flex items-center gap-3">
                                            <div 
                                              className={cn("w-2.5 h-2.5 rounded-full shadow-sm ring-2 transition-all", isActive ? "ring-offset-2 ring-primary scale-110" : "ring-transparent")}
                                              style={{ backgroundColor: item.color }} 
                                            />
                                            <span className={cn("text-sm font-medium transition-colors truncate max-w-[100px]", isActive ? "text-primary" : "text-foreground")}>
                                               {item.label}
                                            </span>
                                         </div>
                                         <span className="text-xs font-semibold text-text-secondary bg-fill-tertiary px-1.5 py-0.5 rounded">
                                            {totalBudget > 0 ? Math.round((item.value / totalBudget) * 100) : 0}%
                                         </span>
                                      </motion.button>
                                   );
                                })}
                             </div>
                          </div>
                       </CardContent>
                    </ShineBorder>
                  </BlurFade>

                  {/* Sidebar Items */}
                  <div className="space-y-6">
                     
                     {/* Tip Card */}
                     <BlurFade delay={0.7} className="h-full text-foreground max-h-[220px]">
                        <ShineBorder 
                          className="bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-fuchsia-500/5 border-indigo-500/20 overflow-hidden relative text-foreground h-full"
                          color={["#6366f1", "#8b5cf6"]}
                        >
                           <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                              <Zap size={120} />
                           </div>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-indigo-500">
                                 <Zap size={18} className="fill-current" />
                                 Совет дня
                              </CardTitle>
                           </CardHeader>
                           <CardContent className="relative z-10">
                              <p className="font-semibold text-md mb-2">{MOCK_DATA.tips[0].title}</p>
                              <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                                 {MOCK_DATA.tips[0].body}
                              </p>
                              <button className="mt-4 text-xs font-bold text-indigo-500 hover:text-indigo-600 hover:underline uppercase tracking-wide flex items-center gap-1 group">
                                 Больше советов 
                                 <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                           </CardContent>
                        </ShineBorder>
                     </BlurFade>
                  </div>
              </div>
           </TabsContent>

           {/* TAB: TRANSACTIONS */}
           <TabsContent value="transactions" className="space-y-6 focus-visible:outline-none relative z-10">
              <TransactionList filterTitle={txSearch} transactions={filteredTransactions} />
           </TabsContent>
            
           {/* TAB: GOALS */}
           <TabsContent value="goals" className="space-y-6 focus-visible:outline-none">
               <div className="p-4 rounded-xl border border-dashed border-border text-center text-text-tertiary">
                   Функционал целей доступен в расширенной версии.
               </div>
           </TabsContent>
           
           {/* TAB: ML DETAILS (NEW) */}
           {isRealData && (
                <TabsContent value="ml_details" className="space-y-6 focus-visible:outline-none">
                    <MLDetailsList transactions={currentTransactions} />
                </TabsContent>
           )}

           {/* TAB: METRICS (Simplified) */}
           {apiData && apiData.metrics && (
                <TabsContent value="metrics" className="space-y-6 focus-visible:outline-none">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <MetricCircle 
                           value={apiData.metrics.accuracy || 0} 
                           label="Accuracy" 
                           sublabel="Общая точность"
                           theme="success"
                           index={0}
                        />
                        <MetricCircle 
                           value={apiData.metrics.macro_f1 || 0} 
                           label="Macro F1" 
                           sublabel="Среднее F1"
                           theme="info"
                           index={1}
                        />
                        <MetricCircle 
                           value={apiData.metrics.balanced_accuracy || 0} 
                           label="Balanced Acc." 
                           sublabel="Сбалансированная"
                           theme="orange"
                           index={2}
                        />
                         {/* Placeholder or hidden if not needed */}
                    </div>
                </TabsContent>
           )}

        </Tabs>
      </div>
    </div>
  );
};

export default MainPageAsync;
