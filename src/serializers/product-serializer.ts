import { Product, ProductIndex, ProductIndexRaw, ProductRaw } from '../types/product';
import { UserSerializer } from './user-seralizer';

enum ProductsView {
  ProductsIndex = 'productsIndex',
}

class ProductSerializer {
  static serializeProductListIndex = (productListRaw: ProductIndexRaw[]) =>
    productListRaw.map((product: ProductIndexRaw) => ProductSerializer.serialize(product, ProductsView.ProductsIndex));

  static serialize = (object: object, view?: string): object => {
    switch (view) {
      case ProductsView.ProductsIndex:
        return this.serializeProductIndex(object as ProductIndexRaw);
      default:
        return this.serializeProduct(object as ProductRaw);
    }
  };

  private static serializeProductIndex = (product: ProductIndexRaw): ProductIndex => ({
    id: product.id,
    title: product.title,
    description: product.description,
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
