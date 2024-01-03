import { UserIndex } from './user';

export interface ProductIndexRaw {
  id: number;
  title: string;
  description: string;
  user: UserIndex;
}

export interface ProductIndex {
  id: number;
  title: string;
  description: string;
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
