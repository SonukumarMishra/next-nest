export interface Product {
  id?: number;
  name: string;
  asin: string;
  sku: string;
  upc?: string;
  price?: number;
  discount?: number;
  stock_quantity?: number;
  cost_price?: number;
  selling_price?: number;
  category_id?: number;   // 👈 Add this line
}
