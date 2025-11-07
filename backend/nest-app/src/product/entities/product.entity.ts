import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
 
@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 50 })
  asin: string;

  @Column({ length: 50 })
  sku: string;

  @Column({ length: 50, nullable: true })
  upc: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  image_url: string;

  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @Column({ type: 'tinyint', default: 1 })
  is_active: number;

  @Column({ length: 100, nullable: true })
  brand: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  selling_price: number;

  @Column({ length: 255, nullable: true })
  barcode: string;

  @Column()
  category_id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
