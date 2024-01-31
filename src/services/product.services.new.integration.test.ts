// ! TODO: Rename all files. Replace "." with "-".
import { db } from '../../prisma/db';
import { createProduct, createUser } from '../test/test-utils';
import { ProductRaw } from '../types/product';
import { ProductService } from './product.services';

describe('Products Service', () => {
  let userId: number;

  beforeAll(async () => {
    userId = (await createUser()).id;
  });

  afterAll(async () => {
    await db.user.delete({
      where: { id: userId },
    });
  });

  describe('Get Product', () => {
    it('should get an array of products', async () => {
      const productCreated = await createProduct({ userId });

      const productsResponse = await ProductService.getProductsService();

      expect(Array.isArray(productsResponse)).toBe(true);

      await db.product.delete({ where: { id: productCreated!.id } });
    });
  });

  describe('Create Product', () => {
    it('should create a product', async () => {
      const expectVerifyProductCreatedStructure = (product: ProductRaw) => {
        expect(product).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            userId,
          }),
        );
      };

      const initialCount = await db.product.count();

      const productCreated: ProductRaw = await createProduct({ userId });

      expectVerifyProductCreatedStructure(productCreated);

      const newCount = await db.product.count();
      expect(newCount).toBe(initialCount + 1);

      const product: ProductRaw | null = await db.product.findUnique({ where: { id: productCreated.id } });
      expect(product).not.toBeNull();

      expectVerifyProductCreatedStructure(product as ProductRaw);

      await db.product.delete({ where: { id: productCreated.id } });
    });
  });

  describe('Update Product', () => {
    it('should update the product', async () => {
      const expectVerifyProductEditedStructure = (product: ProductRaw) => {
        expect(product).toEqual(
          expect.objectContaining({
            id,
            title: newTitle,
            description: newDescription,
            userId,
          }),
        );
      };

      const productCreated = await createProduct({ userId });

      const { id } = productCreated;

      const newTitle = productCreated.title + '111';
      const newDescription = productCreated.description + '111';

      const productEdited = await ProductService.updateProductService(id, {
        title: newTitle,
        description: newDescription,
      });

      expectVerifyProductEditedStructure(productEdited);

      const product: ProductRaw | null = await db.product.findUnique({ where: { id } });
      expect(product).not.toBeNull();

      expectVerifyProductEditedStructure(product as ProductRaw);

      await db.product.delete({ where: { id } });
    });
  });

  describe('Delete Product', () => {
    it('should delete the product', async () => {
      const productCreated = await createProduct({ userId });

      const initialCount = await db.product.count();

      const { id } = productCreated;

      const productDeleted = await ProductService.deleteProductService(id);

      expect(productDeleted).toEqual(
        expect.objectContaining({
          id,
          title: expect.any(String),
          description: expect.any(String),
          userId,
        }),
      );

      const newCount = await db.product.count();

      expect(newCount).toBe(initialCount - 1);

      const product: ProductRaw | null = await db.product.findUnique({ where: { id } });
      expect(product).toBeNull();
    });
  });
});
