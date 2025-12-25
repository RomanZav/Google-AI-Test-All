
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  BrainCircuit, 
  Plus, 
  Search, 
  Bell, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Menu,
  X,
  Truck,
  ShoppingBag,
  Database,
  Users,
  FileText,
  Warehouse as WarehouseIcon
} from 'lucide-react';
import { Product, Transaction, ViewType, Warehouse, Customer, Invoice, BackupData } from './types';
import Dashboard from './components/Dashboard';
import InventoryTable from './components/InventoryTable';
import TransactionHistory from './components/TransactionHistory';
import AIInsights from './components/AIInsights';
import DataManagement from './components/DataManagement';
import CustomersList from './components/CustomersList';
import InvoicesList from './components/InvoicesList';

const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: 'w1', name: 'Головний склад', location: 'Київ' },
  { id: 'w2', name: 'Західний філіал', location: 'Львів' },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'ТОВ "Мега Маркет"', phone: '+380501112233', email: 'office@mega.ua', address: 'м. Київ, вул. Польова 12' },
  { id: 'c2', name: 'ФОП Коваль', phone: '+380674445566', email: 'koval@gmail.com', address: 'м. Львів, пр. Свободи 5' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem('warehouses');
    return saved ? JSON.parse(saved) : INITIAL_WAREHOUSES;
  });
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : [];
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('warehouses', JSON.stringify(warehouses));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [products, transactions, warehouses, customers, invoices]);

  const handleImport = (data: BackupData) => {
    setProducts(data.products);
    setTransactions(data.transactions);
    setWarehouses(data.warehouses);
    setCustomers(data.customers || []);
    setInvoices(data.invoices || []);
    setActiveView('dashboard');
  };

  const handleTransaction = (tx: Omit<Transaction, 'id' | 'date'>) => {
    const txId = Math.random().toString(36).substr(2, 9);
    let invoiceId: string | undefined;

    // Створення накладної при продажу
    if (tx.type === 'sale') {
      const customer = customers.find(c => c.id === tx.customerId);
      const product = products.find(p => p.id === tx.productId);
      if (customer && product) {
        const newInvoice: Invoice = {
          id: Math.random().toString(36).substr(2, 9),
          number: `INV-${invoices.length + 101}`,
          date: new Date().toISOString(),
          customerId: customer.id,
          customerName: customer.name,
          warehouseId: product.warehouseId,
          totalAmount: tx.totalPrice || 0,
          items: [{
            productId: product.id,
            productName: product.name,
            quantity: tx.quantity,
            price: product.salePrice || product.price,
            total: tx.totalPrice || 0
          }]
        };
        setInvoices([newInvoice, ...invoices]);
        invoiceId = newInvoice.id;
      }
    }

    const newTx: Transaction = {
      ...tx,
      id: txId,
      invoiceId,
      date: new Date().toISOString()
    };
    
    setTransactions([newTx, ...transactions]);
    
    setProducts(prevProducts => {
      let updatedProducts = [...prevProducts];
      if (tx.type === 'transfer' && tx.fromWarehouseId && tx.toWarehouseId) {
        const sourceProductIdx = updatedProducts.findIndex(p => p.id === tx.productId);
        if (sourceProductIdx > -1) {
          const sourceProduct = updatedProducts[sourceProductIdx];
          updatedProducts[sourceProductIdx] = { 
            ...sourceProduct, 
            quantity: Math.max(0, sourceProduct.quantity - tx.quantity),
            updatedAt: new Date().toISOString()
          };
          const targetProductIdx = updatedProducts.findIndex(p => p.sku === sourceProduct.sku && p.warehouseId === tx.toWarehouseId);
          if (targetProductIdx > -1) {
            updatedProducts[targetProductIdx] = {
              ...updatedProducts[targetProductIdx],
              quantity: updatedProducts[targetProductIdx].quantity + tx.quantity,
              updatedAt: new Date().toISOString()
            };
          } else {
            updatedProducts.push({
              ...sourceProduct,
              id: Math.random().toString(36).substr(2, 9),
              quantity: tx.quantity,
              warehouseId: tx.toWarehouseId,
              updatedAt: new Date().toISOString()
            });
          }
        }
      } else {
        updatedProducts = updatedProducts.map(p => {
          if (p.id === tx.productId) {
            let newQty = p.quantity;
            if (tx.type === 'incoming') newQty += tx.quantity;
            if (tx.type === 'outgoing' || tx.type === 'sale') newQty -= tx.quantity;
            return { ...p, quantity: Math.max(0, newQty), updatedAt: new Date().toISOString() };
          }
          return p;
        });
      }
      return updatedProducts;
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'inventory', label: 'Склад', icon: Package },
    { id: 'customers', label: 'Покупці', icon: Users },
    { id: 'invoices', label: 'Накладні', icon: FileText },
    { id: 'transactions', label: 'Операції', icon: ArrowLeftRight },
    { id: 'ai-insights', label: 'AI Аналітика', icon: BrainCircuit },
    { id: 'settings', label: 'База даних', icon: Database },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-2xl z-20`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
            <Package className="w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">SmartStock</span>}
        </div>
        
        <nav className="flex-1 mt-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-4 border-t border-slate-800 hover:bg-slate-800">
          {isSidebarOpen ? <X className="w-5 h-5 mx-auto" /> : <Menu className="w-5 h-5 mx-auto" />}
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-10">
          <h1 className="text-xl font-bold text-slate-800">{navItems.find(i => i.id === activeView)?.label}</h1>
          <div className="flex items-center gap-4 text-slate-500">
             <div className="bg-slate-100 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
               <Users className="w-4 h-4" /> {customers.length} клієнтів
             </div>
             <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeView === 'dashboard' && <Dashboard products={products} transactions={transactions} lowStockCount={products.filter(p => p.quantity <= p.minThreshold).length} />}
          {activeView === 'inventory' && (
            <InventoryTable 
              products={products} warehouses={warehouses} customers={customers}
              onAdd={(p) => setProducts([...products, p])}
              onUpdate={(p) => setProducts(products.map(i => i.id === p.id ? p : i))}
              onDelete={(id) => setProducts(products.filter(p => p.id !== id))}
              onTransaction={handleTransaction}
            />
          )}
          {activeView === 'customers' && (
            <CustomersList 
              customers={customers} 
              onUpdate={setCustomers} 
            />
          )}
          {activeView === 'invoices' && (
            <InvoicesList 
              invoices={invoices} 
              customers={customers}
              warehouses={warehouses}
            />
          )}
          {activeView === 'transactions' && <TransactionHistory transactions={transactions} warehouses={warehouses} />}
          {activeView === 'ai-insights' && <AIInsights products={products} transactions={transactions} />}
          {activeView === 'settings' && <DataManagement products={products} transactions={transactions} warehouses={warehouses} customers={customers} invoices={invoices} onImport={handleImport} />}
        </div>
      </main>
    </div>
  );
};

export default App;
