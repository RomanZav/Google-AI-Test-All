
import React, { useState } from 'react';
import { Search, Calendar, User, ArrowUpRight, ArrowDownRight, FileText, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { Transaction, Warehouse } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  warehouses: Warehouse[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, warehouses }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t => 
    t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <ArrowUpRight className="w-6 h-6 text-emerald-600" />;
      case 'sale': return <ShoppingBag className="w-6 h-6 text-rose-600" />;
      case 'transfer': return <Truck className="w-6 h-6 text-blue-600" />;
      default: return <ArrowDownRight className="w-6 h-6 text-slate-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'incoming': return 'bg-emerald-50';
      case 'sale': return 'bg-rose-50';
      case 'transfer': return 'bg-blue-50';
      default: return 'bg-slate-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'incoming': return 'Прихід';
      case 'sale': return 'Продаж';
      case 'transfer': return 'Переміщення';
      case 'outgoing': return 'Списання';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Пошук транзакції за назвою або користувачем..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
          <Calendar className="w-5 h-5" />
          Всі дати
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.length > 0 ? filtered.map((t) => (
            <div key={t.id} className="p-8 flex flex-wrap items-center justify-between hover:bg-slate-50/50 transition-colors gap-6 group">
              <div className="flex items-center gap-6 min-w-[250px]">
                <div className={`p-4 rounded-2xl shadow-sm ${getBg(t.type)} group-hover:scale-110 transition-transform`}>
                  {getIcon(t.type)}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-xl leading-tight">{t.productName}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(t.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {t.user}</span>
                    {t.type === 'transfer' && (
                      <span className="flex items-center gap-1.5 text-blue-500">
                        <MapPin className="w-3.5 h-3.5" /> 
                        {warehouses.find(w => w.id === t.fromWarehouseId)?.name} → {warehouses.find(w => w.id === t.toWarehouseId)?.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-12 ml-auto">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Операція</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    t.type === 'incoming' ? 'bg-emerald-100 text-emerald-700' : 
                    t.type === 'sale' ? 'bg-rose-100 text-rose-700' :
                    t.type === 'transfer' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {getTypeLabel(t.type)}
                  </span>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Результат</p>
                  <p className={`text-2xl font-black leading-none ${
                    t.type === 'incoming' ? 'text-emerald-600' : 
                    t.type === 'sale' ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {t.type === 'incoming' ? '+' : '-'}{t.quantity}
                  </p>
                  {t.totalPrice && (
                    <p className="text-[11px] font-bold text-emerald-500 mt-1">${t.totalPrice.toLocaleString()}</p>
                  )}
                </div>
                <button className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                  <FileText className="w-6 h-6" />
                </button>
              </div>
            </div>
          )) : (
            <div className="py-32 text-center">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Жодної операції</h3>
              <p className="text-slate-400 mt-2 font-medium">Тут з'являтимуться записи про прихід, продаж та переміщення товарів.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
