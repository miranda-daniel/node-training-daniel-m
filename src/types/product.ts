import { UserIndex, UserIndexRaw } from './user';

export interface ProductIndexRaw {
  id: number;
  title: string;
  description: string;
  userId: number;
  user: UserIndexRaw;
}

export interface ProductIndex {
  id: number;
  title: string;
  description: string;
  userId: number;
  user: UserIndex;
}

export interface ProductRaw {
  id: number;
  title: string;
  description: string;
  userId: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  userId: number;
}

export interface CreateProductRequest extends Omit<Product, 'id' | 'userId'> {}

export interface UpdateProductRequest extends Omit<Product, 'id' | 'userId'> {}

export interface PartialProduct extends Partial<Product> {}
