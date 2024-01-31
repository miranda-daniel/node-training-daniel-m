// ! TODO: Rename all files. Replace "." with "-".
import { db } from '../../prisma/db';
import { createProduct, createUser } from '../test/test-utils';
import { UpdateProductRequest } from '../types/product';
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

  describe('Get Product Service', () => {
    it('should get an array of products', async () => {
      const productCreated = await createProduct({ userId });

      const productsResponse = await ProductService.getProductsService();

      expect(Array.isArray(productsResponse)).toBe(true);

      await db.product.delete({ where: { id: productCreated!.id } });
    });
  });

  describe('Create Product Service', () => {
    it('should create a product', async () => {
      const productCreated = await createProduct({ userId });

      expect(productCreated).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          userId: expect.any(Number),
          description: expect.any(String),
        }),
      );

      await db.product.delete({ where: { id: productCreated.id } });
    });
  });

  describe('Update Product', () => {
    it('should update the product', async () => {
      const productCreated = await createProduct({ userId });

      jest.spyOn(db.product, 'findUnique');
      jest.spyOn(db.product, 'update');

      const { id } = productCreated;

      const productEdited: UpdateProductRequest = {
        title: productCreated.title + '111',
        description: productCreated.description + '111',
      };

      const productUpdated = await ProductService.updateProductService(id, productEdited);

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
  });

  describe('Delete Product', () => {
    it('should delete the product', async () => {
      const productCreated = await createProduct({ userId });

      jest.spyOn(db.product, 'findUnique');
      jest.spyOn(db.product, 'delete');

      const { id } = productCreated;

      const productDeleted = await ProductService.deleteProductService(id);

      expect(productDeleted).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          userId: expect.any(Number),
          description: expect.any(String),
        }),
      );
    });
  });
});
