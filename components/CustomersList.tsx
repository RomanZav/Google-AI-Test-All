
import React, { useState } from 'react';
import { Plus, Search, User, Phone, MapPin, Mail, X } from 'lucide-react';
import { Customer } from '../types';

interface CustomersListProps {
  customers: Customer[];
  onUpdate: (customers: Customer[]) => void;
}

const CustomersList: React.FC<CustomersListProps> = ({ customers, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', phone: '', email: '', address: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate([...customers, { ...newCust, id: Math.random().toString(36).substr(2, 9) }]);
    setShowAdd(false);
    setNewCust({ name: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl" placeholder="Пошук покупця..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={() => setShowAdd(true)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold flex gap-2">
          <Plus /> Додати покупця
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(customer => (
          <div key={customer.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <User size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">{customer.name}</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-3"><Phone size={14} /> {customer.phone}</div>
              <div className="flex items-center gap-3"><Mail size={14} /> {customer.email}</div>
              <div className="flex items-center gap-3"><MapPin size={14} /> {customer.address}</div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Новий клієнт</h2>
              <button onClick={() => setShowAdd(false)}><X /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required placeholder="Назва / ПІБ" className="w-full p-3 bg-slate-50 rounded-xl" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
              <input required placeholder="Телефон" className="w-full p-3 bg-slate-50 rounded-xl" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} />
              <input placeholder="Email" className="w-full p-3 bg-slate-50 rounded-xl" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})} />
              <input placeholder="Адреса" className="w-full p-3 bg-slate-50 rounded-xl" value={newCust.address} onChange={e => setNewCust({...newCust, address: e.target.value})} />
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">Додати</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;
