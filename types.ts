
export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minThreshold: number;
  price: number;
  salePrice?: number;
  warehouseId: string;
  updatedAt: string;
  imageUrl?: string;
}

export type TransactionType = 'incoming' | 'outgoing' | 'sale' | 'transfer';

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: TransactionType;
  quantity: number;
  date: string;
  user: string;
  customerId?: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  notes?: string;
  totalPrice?: number;
  invoiceId?: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  totalAmount: number;
  warehouseId: string;
}

export interface BackupData {
  products: Product[];
  transactions: Transaction[];
  warehouses: Warehouse[];
  customers: Customer[];
  invoices: Invoice[];
  exportDate: string;
  version: string;
}

export type ViewType = 'dashboard' | 'inventory' | 'transactions' | 'customers' | 'invoices' | 'ai-insights' | 'settings';
