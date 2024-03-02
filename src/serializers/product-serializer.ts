import {
  Product,
  ProductIndex,
  ProductIndexRaw,
  ProductRaw,
} from '@typing/product';
import { UserSerializer } from './user-seralizer';

export enum ProductsView {
  ProductsIndex = 'productsIndex',
}

class ProductSerializer {
  static serializeProductListIndex = (productListRaw: ProductIndexRaw[]) =>
    productListRaw.map((product: ProductIndexRaw) =>
      ProductSerializer.serialize(product, ProductsView.ProductsIndex)
    );

  static serialize = (object: object, view?: ProductsView): object => {
    switch (view) {
      case ProductsView.ProductsIndex:
        return this.serializeProductIndex(object as ProductIndexRaw);
      default:
        return this.serializeProduct(object as ProductRaw);
    }
  };

  private static serializeProductIndex = (
    product: ProductIndexRaw
  ): ProductIndex => ({
    id: product.id,
    title: product.title,
    description: product.description,
    userId: product.userId,
    user: UserSerializer.serializeUserIndex(product.user),
  });

  private static serializeProduct = (product: ProductRaw): Product => ({
    id: product.id,
    title: product.title,
    description: product.description,
    userId: product.userId,
  });
}

export { ProductSerializer };
