
import React, { useState } from 'react';
import { 
  Search, Plus, Edit2, ArrowUpRight, ArrowDownRight, Truck, ShoppingBag, AlertTriangle, MapPin, X, Image as ImageIcon
} from 'lucide-react';
import { Product, Transaction, Warehouse, Customer, TransactionType } from '../types';

interface InventoryTableProps {
  products: Product[];
  warehouses: Warehouse[];
  customers: Customer[];
  onAdd: (p: Product) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
  onTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ products, warehouses, customers, onAdd, onUpdate, onDelete, onTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTxModal, setShowTxModal] = useState<{ productId: string, type: TransactionType } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const AddProductModal = () => {
    const [formData, setFormData] = useState({
      name: '', 
      sku: '', 
      category: 'Загальне', 
      quantity: 0, 
      minThreshold: 5, 
      price: 0, 
      salePrice: 0, 
      warehouseId: warehouses[0]?.id || '', 
      imageUrl: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Очищення URL якщо він порожній
      const finalImageUrl = formData.imageUrl.trim() || undefined;
      
      onAdd({ 
        ...formData, 
        imageUrl: finalImageUrl,
        id: Math.random().toString(36).substr(2, 9), 
        updatedAt: new Date().toISOString() 
      });
      setShowAddModal(false);
    };

    return (
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all"
        onClick={() => setShowAddModal(false)}
      >
        <div 
          className="bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Plus className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Новий товар</h2>
            </div>
            <button 
              onClick={() => setShowAddModal(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Назва товару</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Артикул (SKU)</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
              <div className="space-y-2 col-span-full">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">URL зображення (необов'язково)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Ціна закупки ($)</label>
                <input type="number" step="0.01" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" value={formData.price} onChange={e => setFormData({...formData, price: +e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Ціна продажу ($)</label>
                <input type="number" step="0.01" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: +e.target.value})} />
              </div>
            </div>
            
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Додати в базу
            </button>
          </form>
        </div>
      </div>
    );
  };

  const TransactionModal = () => {
    const [qty, setQty] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.id || '');
    if (!showTxModal) return null;
    const product = products.find(p => p.id === showTxModal.productId)!;

    return (
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setShowTxModal(null)}
      >
        <div 
          className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">
              {showTxModal.type === 'sale' ? 'Продаж товару' : 'Прихід товару'}
            </h2>
            <button onClick={() => setShowTxModal(null)} className="p-2 hover:bg-slate-100 rounded-full"><X className="text-slate-400" /></button>
          </div>
          
          <div className="space-y-6">
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden">
                 {product.imageUrl ? (
                   <img src={product.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = '')} />
                 ) : (
                   <ImageIcon className="text-slate-200" />
                 )}
               </div>
               <div>
                 <p className="font-black text-slate-800 leading-tight">{product.name}</p>
                 <p className="text-xs font-bold text-slate-400 uppercase mt-1">Доступно: {product.quantity} шт</p>
               </div>
             </div>

             {showTxModal.type === 'sale' && (
               <div className="space-y-2">
                 <label className="text-xs font-black uppercase text-slate-400 ml-1">Виберіть покупця</label>
                 <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                   {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
               </div>
             )}

             <div className="space-y-2">
               <label className="text-xs font-black uppercase text-slate-400 ml-1">Кількість</label>
               <input type="number" min="1" max={showTxModal.type === 'sale' ? product.quantity : 99999} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-black text-xl" value={qty} onChange={e => setQty(+e.target.value)} />
             </div>

             <button onClick={() => {
                onTransaction({
                  productId: product.id, productName: product.name, type: showTxModal.type, quantity: qty,
                  user: 'Адмін', customerId: showTxModal.type === 'sale' ? selectedCustomer : undefined,
                  totalPrice: showTxModal.type === 'sale' ? (product.salePrice || product.price) * qty : undefined
                });
                setShowTxModal(null);
             }} className={`w-full py-4 rounded-2xl font-black text-lg text-white shadow-lg transition-all ${
               showTxModal.type === 'sale' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100'
             }`}>
               Підтвердити операцію
             </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
          <input className="w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none font-medium transition-all" placeholder="Пошук по назві або артикулу..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black flex gap-3 items-center hover:bg-blue-600 hover:-translate-y-0.5 transition-all shadow-xl shadow-slate-200 hover:shadow-blue-200">
          <Plus className="w-5 h-5" /> Новий товар
        </button>
      </div>

      <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-black tracking-widest">
            <tr>
              <th className="px-8 py-5">Інформація про товар</th>
              <th className="px-8 py-5">Наявність</th>
              <th className="px-8 py-5 text-right">Ціноутворення</th>
              <th className="px-8 py-5 text-center">Швидкі дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                      {p.imageUrl ? (
                        <img 
                          src={p.imageUrl} 
                          className="w-full h-full object-cover" 
                          alt="" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('bg-slate-50');
                            const icon = e.currentTarget.parentElement?.querySelector('.placeholder-icon');
                            if(icon) (icon as HTMLElement).style.display = 'block';
                          }}
                        />
                      ) : null}
                      <ImageIcon className={`placeholder-icon text-slate-300 w-6 h-6 ${p.imageUrl ? 'hidden' : 'block'}`} />
                    </div>
                    <div>
                      <div className="font-black text-slate-800 text-lg leading-tight mb-1">{p.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-tighter">SKU: {p.sku}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className={`text-xl font-black ${p.quantity <= p.minThreshold ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>
                    {p.quantity} <span className="text-xs font-bold text-slate-400 ml-1">шт</span>
                  </div>
                  {p.quantity <= p.minThreshold && (
                    <div className="text-[9px] font-black text-rose-400 uppercase tracking-tight flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" /> Критичний запас
                    </div>
                  )}
                </td>
                <td className="px-8 py-5 text-right">
                   <div className="text-xs font-bold text-slate-400 uppercase mb-1">Продаж / Прибуток</div>
                   <div className="text-xl font-black text-slate-800">${p.salePrice?.toLocaleString()}</div>
                   <div className="text-[10px] font-bold text-emerald-500">+${((p.salePrice || 0) - p.price).toFixed(2)} маржа</div>
                </td>
                <td className="px-8 py-5">
                   <div className="flex gap-3 justify-center">
                     <button 
                        onClick={() => setShowTxModal({productId: p.id, type: 'incoming'})} 
                        className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-emerald-100"
                        title="Поповнити"
                     >
                       <ArrowUpRight size={20} />
                     </button>
                     <button 
                        onClick={() => setShowTxModal({productId: p.id, type: 'sale'})} 
                        className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm hover:shadow-rose-100"
                        title="Продати"
                     >
                       <ShoppingBag size={20} />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="font-bold text-slate-400">Товарів не знайдено</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showAddModal && <AddProductModal />}
      {showTxModal && <TransactionModal />}
    </div>
  );
};

export default InventoryTable;
