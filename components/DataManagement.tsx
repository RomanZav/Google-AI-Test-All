
import React, { useRef, useState } from 'react';
import { 
  Download, 
  Upload, 
  Database, 
  ShieldCheck, 
  AlertCircle,
  FileJson,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { Product, Transaction, Warehouse, BackupData, Customer, Invoice } from '../types';

interface DataManagementProps {
  products: Product[];
  transactions: Transaction[];
  warehouses: Warehouse[];
  customers: Customer[];
  invoices: Invoice[];
  onImport: (data: BackupData) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ products, transactions, warehouses, customers, invoices, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

  const exportData = () => {
    // Correctly including all required properties for BackupData interface
    const backup: BackupData = {
      products,
      transactions,
      warehouses,
      customers,
      invoices,
      exportDate: new Date().toISOString(),
      version: "2.0"
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartStock_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setStatus({ type: 'success', message: 'Базу успішно експортовано у файл!' });
    setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Basic validation
        if (!data.products || !data.transactions || !data.warehouses) {
          throw new Error('Некоректний формат файлу');
        }

        if (window.confirm('Ви впевнені? Поточні дані будуть повністю замінені даними з файлу.')) {
          onImport(data);
          setStatus({ type: 'success', message: 'Дані успішно відновлено!' });
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Помилка імпорту: файл пошкоджений або має невірний формат.' });
      }
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800">Керування даними</h2>
            <p className="text-slate-400 font-medium">Експорт та імпорт всієї інформації вашого складу</p>
          </div>
        </div>

        {status.type !== 'idle' && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-bold">{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Export Card */}
          <div className="group bg-slate-50 border border-slate-100 p-8 rounded-[2rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-white p-4 rounded-2xl shadow-sm w-fit mb-6 group-hover:scale-110 transition-transform">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Експорт бази</h3>
            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
              Завантажте всі дані (товари, історію, склади) у файл JSON. Ви зможете зберегти його на флешку або завантажити на Google Диск.
            </p>
            <button 
              onClick={exportData}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <FileJson className="w-5 h-5" />
              Завантажити JSON
            </button>
          </div>

          {/* Import Card */}
          <div className="group bg-slate-50 border border-slate-100 p-8 rounded-[2rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-white p-4 rounded-2xl shadow-sm w-fit mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Імпорт бази</h3>
            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
              Відновіть стан складу з раніше створеного бекап-файлу. Увага: поточні дані будуть видалені!
            </p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden" 
              accept=".json"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl font-black hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
            >
              <HardDrive className="w-5 h-5" />
              Вибрати файл
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-8 flex items-start gap-4">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-black text-amber-900 mb-1">Безпека даних</h4>
          <p className="text-amber-800/80 text-sm font-medium leading-relaxed">
            Ми рекомендуємо робити експорт бази щотижня. Отриманий файл ви можете вручну завантажити у папку на <b>Google Drive</b> або <b>OneDrive</b>. Це гарантує збереження вашого обліку навіть у разі очищення пам'яті браузера.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
