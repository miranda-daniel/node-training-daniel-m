import { faker } from '@faker-js/faker';
import { db } from '../../prisma/db';
import { ApiError } from '../config/apiError';
import { errors } from '../config/errors';
import { ProductSerializer } from '../serializers/product-serializer';
import { productRequestRandom, productIndexRandomRaw, productRandomRaw } from '../test/test-constants';
import { createProduct, createUser } from '../test/utils';
import { Product, ProductIndex, ProductIndexRaw, UpdateProductRequest } from '../types/product';
import { ProductService } from './product.services';

describe('Products Service', () => {
  let userId: number;

  beforeAll(async () => {
    userId = (await createUser()).id;
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await db.user.delete({
      where: { id: userId },
    });
  });

  describe('Create Product', () => {
    it('should create a product with the correct arguments', async () => {
      const createSpy = jest.spyOn(db.product, 'create');

      const productResponse = await ProductService.createProductService(userId, productRequestRandom);

      expect(createSpy).toHaveBeenCalledWith({
        data: {
          title: productRequestRandom.title,
          description: productRequestRandom.description,
          userId,
        },
      });

      expect(productResponse).toBeDefined();

      await db.product.delete({ where: { id: productResponse.id } });
    });

    it('should serialize product created', async () => {
      jest.spyOn(db.product, 'create').mockResolvedValue(productRandomRaw);

      const productSerialized: Product = {
        id: productRandomRaw.id,
        title: productRandomRaw.title,
        description: productRandomRaw.description,
        userId: productRandomRaw.userId,
      };

      expect(productSerialized).toEqual(ProductSerializer.serialize(productRandomRaw));
    });

    it('should throw an Error on database error', async () => {
      jest.spyOn(db.product, 'create').mockRejectedValue(new Error('Database error'));

      await expect(ProductService.createProductService(userId, productRequestRandom)).rejects.toThrow(
        new Error('Database error'),
      );
    });
  });

  describe('Get Product', () => {
    let productCreated: Product | null = null;

    it('should get an array of products with the correct arguments', async () => {
      productCreated = await createProduct({ userId });

      const createSpy = jest.spyOn(db.product, 'findMany');

      const productsResponse = await ProductService.getProductsService();

      expect(createSpy).toHaveBeenCalledWith({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      expect(productsResponse).toBeDefined();
      expect(Array.isArray(productsResponse)).toBe(true);

      await db.product.delete({ where: { id: productCreated!.id } });
    });

    it('should serialize product list', async () => {
      const productsIndexRaw: ProductIndexRaw[] = [productIndexRandomRaw];

      jest.spyOn(db.product, 'findMany').mockResolvedValue(productsIndexRaw);

      const productIndexSerialized: ProductIndex[] = [
        {
          id: productIndexRandomRaw.id,
          title: productIndexRandomRaw.title,
          description: productIndexRandomRaw.description,
          userId: productIndexRandomRaw.userId,
          user: {
            firstName: productIndexRandomRaw.user.firstName,
            lastName: productIndexRandomRaw.user.lastName,
          },
        },
      ];

      expect(productIndexSerialized).toEqual(ProductSerializer.serializeProductListIndex(productsIndexRaw));
    });

    it('should throw an Error on database error', async () => {
      jest.spyOn(db.product, 'findMany').mockRejectedValue(new Error('Database error'));

      await expect(ProductService.getProductsService()).rejects.toThrow(new Error('Database error'));
    });
  });

  describe('Delete Product', () => {
    it('should call findUnique and delete with the correct arguments and return the product deleted', async () => {
      const productCreated = await createProduct({ userId });

      const findSpy = jest.spyOn(db.product, 'findUnique');
      const deleteSpy = jest.spyOn(db.product, 'delete');

      const productDeleted = await ProductService.deleteProductService(productCreated!.id);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ where: { id: productCreated!.id } });

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith({ where: { id: productCreated!.id } });

      expect(productDeleted).toBeDefined();
      expect(productDeleted).toEqual(productCreated);
    });

    it('should serialize product response', async () => {
      jest.spyOn(db.product, 'delete').mockResolvedValue(productRandomRaw);

      const productSerialized: Product = {
        id: productRandomRaw.id,
        title: productRandomRaw.title,
        description: productRandomRaw.description,
        userId: productRandomRaw.userId,
      };

      expect(productSerialized).toEqual(ProductSerializer.serialize(productRandomRaw));
    });

    it('should throw an ApiError (NOT_FOUND) when product is not found', async () => {
      jest.spyOn(db.product, 'findUnique').mockResolvedValue(null);

      const productId = faker.number.int();
      await expect(ProductService.deleteProductService(productId)).rejects.toThrow(new ApiError(errors.NOT_FOUND));
    });

    it('should throw an Error on database error', async () => {
      jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
      jest.spyOn(db.product, 'delete').mockRejectedValue(new Error('Database error'));

      const productId = faker.number.int();
      await expect(ProductService.deleteProductService(productId)).rejects.toThrow(new Error('Database error'));
    });
  });

  describe('Update Product', () => {
    it('should call findUnique and update product with the correct arguments and return the product updated', async () => {
      const productCreated = await createProduct({ userId });

      const findSpy = jest.spyOn(db.product, 'findUnique');
      const updateSpy = jest.spyOn(db.product, 'update');

      const { id } = productCreated;

      const productEdited: UpdateProductRequest = {
        title: productCreated.title + '111',
        description: productCreated.description + '111',
      };

      const productUpdated = await ProductService.updateProductService(id, productEdited);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ where: { id } });

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith({ data: { ...productEdited }, where: { id } });

      expect(productUpdated).toBeDefined();

      expect(productUpdated).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          userId: expect.any(Number),
          description: expect.any(String),
        }),
      );

      await db.product.delete({ where: { id } });
    });

    it('should serialize product response', async () => {
      jest.spyOn(db.product, 'update').mockResolvedValue(productRandomRaw);

      const productSerialized: Product = {
        id: productRandomRaw.id,
        title: productRandomRaw.title,
        description: productRandomRaw.description,
        userId: productRandomRaw.userId,
      };

      expect(productSerialized).toEqual(ProductSerializer.serialize(productRandomRaw));
    });

    it('should throw an ApiError (NOT_FOUND) when product is not found', async () => {
      jest.spyOn(db.product, 'findUnique').mockResolvedValue(null);

      const productId = faker.number.int();
      const title = faker.commerce.productName();
      const description = faker.commerce.productDescription();

      await expect(ProductService.updateProductService(productId, { title, description })).rejects.toThrow(
        new ApiError(errors.NOT_FOUND),
      );
    });

    it('should throw an Error on database error', async () => {
      jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
      jest.spyOn(db.product, 'update').mockRejectedValue(new Error('Database error'));

      const productId = faker.number.int();
      const title = faker.commerce.productName();
      const description = faker.commerce.productDescription();

      await expect(ProductService.updateProductService(productId, { title, description })).rejects.toThrow(
        new Error('Database error'),
      );
    });
  });
});
