import { db } from '@root/prisma/db';
import { ApiError } from '@config/api-error';
import { errors } from '@config/errors';
import { ProductSerializer } from '@serializers/product-serializer';
import {
  CreateProductRequest,
  Product,
  ProductIndex,
  ProductIndexRaw,
  ProductRaw,
  UpdateProductRequest,
} from '@typing/product';

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

    return ProductSerializer.serializeProductListIndex(
      productsListRaw
    ) as ProductIndex[];
  };

  static createProductService = async (
    userId: number,
    input: CreateProductRequest
  ) => {
    const { title, description } = input;

    const productCreatedRaw: ProductRaw = await db.product.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return ProductSerializer.serialize(productCreatedRaw) as Product;
  };

  static deleteProductService = async (productId: number) => {
    const productRaw: ProductRaw | null = await db.product.findUnique({
      where: { id: productId },
    });

    if (!productRaw) {
      throw new ApiError(errors.NOT_FOUND);
    }

    const productDeletedRaw: ProductRaw = await db.product.delete({
      where: { id: productId },
    });

    return ProductSerializer.serialize(productDeletedRaw) as Product;
  };

  static updateProductService = async (
    productId: number,
    requestBody: UpdateProductRequest
  ) => {
    const productRaw: ProductRaw | null = await db.product.findUnique({
      where: { id: productId },
    });

    if (!productRaw) {
      throw new ApiError(errors.NOT_FOUND);
    }

    const productUpdatedRaw: ProductRaw = await db.product.update({
      data: {
        ...requestBody,
      },
      where: {
        id: productId,
      },
    });

    return ProductSerializer.serialize(productUpdatedRaw) as Product;
  };
}
