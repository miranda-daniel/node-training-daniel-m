import { faker } from '@faker-js/faker';
import { ProductService } from '@services/product-services';
import {
  productRequestRandom,
  productIndexRandom,
  productRandom,
} from '@test/helpers/data-generators';
import { ProductController } from '@controllers/product-controller';
import { Context } from '@typing/session';
import { Product } from '@typing/product';

jest.mock('@services/product-services.ts');

describe('ProductController', () => {
  const fakeUserId = faker.number.int();
  const fakeProductId = faker.number.int();
  const controller = new ProductController();

  describe('Get All Products', () => {
    it('should get all products', async () => {
      (ProductService.getProductsService as jest.Mock).mockResolvedValue([
        productIndexRandom,
      ]);

      const response = await controller.getAllProducts();

      // ! NOTE: To force the tests to fail
      // expect(ProductService.getProductsService).toHaveBeenCalled()
      expect(ProductService.getProductsService).toHaveBeenCalledTimes(2);
      expect(response).toEqual([productIndexRandom]);
    });
  });

  describe('Create Product', () => {
    const fakeContext: Context = {
      user: {
        token: faker.string.alphanumeric(),
        userId: fakeUserId,
      },
    };

    const productCreated: Product = {
      id: faker.number.int(),
      userId: fakeUserId,
      title: productRequestRandom.title,
      description: productRequestRandom.description,
    };

    it('should create a product successfully', async () => {
      (ProductService.createProductService as jest.Mock).mockResolvedValue(
        productCreated
      );

      const result = await controller.createProduct(
        fakeContext,
        productRequestRandom
      );

      expect(ProductService.createProductService).toHaveBeenCalledWith(
        fakeUserId,
        productRequestRandom
      );
      expect(result).toEqual(productCreated);
    });
  });

  describe('Delete Product', () => {
    it('should delete a product successfully', async () => {
      (ProductService.deleteProductService as jest.Mock).mockResolvedValue(
        productRandom
      );

      const result = await controller.deleteProduct(fakeProductId);

      expect(ProductService.deleteProductService).toHaveBeenCalledWith(
        fakeProductId
      );
      expect(result).toEqual(productRandom);
    });
  });

  describe('Update Product', () => {
    it('should update a product successfully', async () => {
      (ProductService.updateProductService as jest.Mock).mockResolvedValue(
        productRandom
      );

      const result = await controller.updateProduct(
        fakeProductId,
        productRequestRandom
      );

      expect(ProductService.updateProductService).toHaveBeenCalledWith(
        fakeProductId,
        productRequestRandom
      );
      expect(result).toEqual(productRandom);
    });
  });
});
