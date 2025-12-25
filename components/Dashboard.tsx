
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Truck
} from 'lucide-react';
import { Product, Transaction } from '../types';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
  lowStockCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ products, transactions, lowStockCount }) => {
  const totalValue = useMemo(() => products.reduce((sum, p) => sum + (p.price * p.quantity), 0), [products]);
  
  const totalSales = useMemo(() => 
    transactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + (t.totalPrice || 0), 0), 
    [transactions]
  );

  const stats = [
    { label: 'Загальна вартість', value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: 'bg-indigo-600', trend: '+4.2%' },
    { label: 'Продажі (всього)', value: `$${totalSales.toLocaleString()}`, icon: ShoppingBag, color: 'bg-emerald-600', trend: '+12.5%' },
    { label: 'Низький запас', value: lowStockCount, icon: AlertTriangle, color: 'bg-rose-500', trend: lowStockCount > 5 ? 'Увага!' : 'Норма' },
    { label: 'Переміщення', value: transactions.filter(t => t.type === 'transfer').length, icon: Truck, color: 'bg-blue-600', trend: 'Активно' },
  ];

  const recentMovement = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const txs = transactions.filter(t => t.date.startsWith(date));
      const sales = txs.filter(t => t.type === 'sale').reduce((s, t) => s + (t.totalPrice || 0), 0);
      const incoming = txs.filter(t => t.type === 'incoming').length * 100; // Умовна візуалізація
      return { date: date.slice(5), sales, incoming };
    });
  }, [transactions]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black px-2 py-1 bg-slate-50 text-slate-400 rounded-lg uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800 mt-2">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-800">Динаміка виручки ($)</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                 <span className="text-xs font-bold text-slate-500">Продажі</span>
               </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentMovement}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#cbd5e1" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#cbd5e1" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="stepAfter" dataKey="sales" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 8 }} name="Виручка" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-2xl font-black text-slate-800 mb-8">Останні продажі</h3>
          <div className="space-y-6 flex-1">
            {transactions.filter(t => t.type === 'sale').slice(0, 4).map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm text-rose-500">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm leading-none">{t.productName}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1.5">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-600 text-lg">+${t.totalPrice?.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-400">шт: {t.quantity}</p>
                </div>
              </div>
            ))}
            {transactions.filter(t => t.type === 'sale').length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                <ShoppingBag className="w-12 h-12 mb-4" />
                <p className="font-bold">Продажів поки немає</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
