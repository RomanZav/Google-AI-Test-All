
import React, { useState } from 'react';
import { FileText, Printer, Eye, X, Download } from 'lucide-react';
import { Invoice, Customer, Warehouse } from '../types';

interface InvoicesListProps {
  invoices: Invoice[];
  customers: Customer[];
  warehouses: Warehouse[];
}

const InvoicesList: React.FC<InvoicesListProps> = ({ invoices, customers, warehouses }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const InvoicePreview = ({ invoice }: { invoice: Invoice }) => {
    const warehouse = warehouses.find(w => w.id === invoice.warehouseId);
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white w-full max-w-4xl p-12 rounded-lg shadow-2xl relative my-8">
          <button onClick={() => setSelectedInvoice(null)} className="absolute top-4 right-4 print:hidden"><X /></button>
          
          <div className="border-b-2 border-slate-900 pb-8 mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black mb-2 uppercase">Видаткова Накладна</h1>
              <p className="text-xl font-bold text-slate-500">№ {invoice.number} від {new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold text-blue-600 text-2xl">SmartStock Pro</h2>
              <p className="text-sm text-slate-500">Система складського обліку</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Постачальник (Відпуск зі складу)</h3>
              <p className="font-bold text-lg">{warehouse?.name || 'Головний склад'}</p>
              <p className="text-slate-500">{warehouse?.location || 'м. Київ'}</p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Отримувач (Покупець)</h3>
              <p className="font-bold text-lg">{invoice.customerName}</p>
              <p className="text-slate-500">Згідно договору купівлі-продажу</p>
            </div>
          </div>

          <table className="w-full border-collapse mb-12">
            <thead>
              <tr className="bg-slate-100 border-y-2 border-slate-900">
                <th className="p-4 text-left font-black">№</th>
                <th className="p-4 text-left font-black">Товар</th>
                <th className="p-4 text-center font-black">К-сть</th>
                <th className="p-4 text-right font-black">Ціна</th>
                <th className="p-4 text-right font-black">Сума</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-200">
                  <td className="p-4">{idx + 1}</td>
                  <td className="p-4 font-bold">{item.productName}</td>
                  <td className="p-4 text-center">{item.quantity}</td>
                  <td className="p-4 text-right">${item.price.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="p-4 text-right font-black text-xl uppercase">Разом до сплати:</td>
                <td className="p-4 text-right font-black text-2xl text-blue-600">${invoice.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="grid grid-cols-2 gap-24 mt-24 pt-12 border-t border-dashed border-slate-300">
            <div className="text-center">
              <div className="border-b border-slate-900 mb-2"></div>
              <p className="text-xs uppercase font-bold text-slate-400">Відпустив (ПІБ, Підпис)</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-900 mb-2"></div>
              <p className="text-xs uppercase font-bold text-slate-400">Отримав (ПІБ, Підпис, Печатка)</p>
            </div>
          </div>

          <div className="mt-12 text-center print:hidden flex gap-4 justify-center">
            <button onClick={() => window.print()} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex gap-2 items-center">
              <Printer size={18} /> Друкувати
            </button>
            <button onClick={() => setSelectedInvoice(null)} className="px-8 py-3 border border-slate-200 rounded-xl font-bold">
              Закрити
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black">
            <tr>
              <th className="px-8 py-4">Номер</th>
              <th className="px-8 py-4">Дата</th>
              <th className="px-8 py-4">Покупець</th>
              <th className="px-8 py-4">Сума ($)</th>
              <th className="px-8 py-4">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50/50">
                <td className="px-8 py-4 font-bold text-blue-600">{inv.number}</td>
                <td className="px-8 py-4">{new Date(inv.date).toLocaleDateString()}</td>
                <td className="px-8 py-4 font-medium">{inv.customerName}</td>
                <td className="px-8 py-4 font-black">${inv.totalAmount.toLocaleString()}</td>
                <td className="px-8 py-4">
                  <button onClick={() => setSelectedInvoice(inv)} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600">
                    <Eye size={16} /> Накладна
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-medium">Накладні ще не сформовані</div>
        )}
      </div>
      {selectedInvoice && <InvoicePreview invoice={selectedInvoice} />}
    </div>
  );
};

export default InvoicesList;
