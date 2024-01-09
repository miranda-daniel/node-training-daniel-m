import { db } from '../../prisma/db';
import { ApiError } from '../config/apiError';
import { errors } from '../config/errors';
import { ProductSerializer } from '../serializers/product-serializer';
import { CreateProductRequest, Product, ProductIndex, ProductIndexRaw, UpdateProductRequest } from '../types/product';

export class ProductService {
  static getProductsService = async () => {
    const productsListRaw: ProductIndexRaw[] = await db.product.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return ProductSerializer.serializeProductListIndex(productsListRaw) as ProductIndex[];
  };

  static createProductService = async (userId: number, input: CreateProductRequest) => {
    const { title, description } = input;

    const productCreated = await db.product.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return ProductSerializer.serialize(productCreated) as Product;
  };

  static deleteProductService = async (productId: number) => {
    const product = await db.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new ApiError(errors.NOT_FOUND);
    }

    const productDeleted = await db.product.delete({ where: { id: productId } });

    return ProductSerializer.serialize(productDeleted) as Product;
  };

  static updateProductService = async (productId: number, requestBody: UpdateProductRequest) => {
    const product = await db.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new ApiError(errors.NOT_FOUND);
    }

    const productUpdated = await db.product.update({
      data: {
        ...requestBody,
      },
      where: {
        id: productId,
      },
    });

    return ProductSerializer.serialize(productUpdated) as Product;
  };
}
