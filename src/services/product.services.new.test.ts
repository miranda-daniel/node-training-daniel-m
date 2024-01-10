import { faker } from '@faker-js/faker';
import { db } from '../../prisma/db';
import { ApiError } from '../config/apiError';
import { errors } from '../config/errors';
import { ProductSerializer } from '../serializers/product-serializer';
import { productRandomRaw } from '../test/test-constants';
import { UpdateProductRequest } from '../types/product';
import { ProductService } from './product.services';

describe('Products Service', () => {
  describe('Update Product Service', () => {
    const productId = faker.number.int();

    const productRequest: UpdateProductRequest = {
      title: 'newTitle',
      description: ' newDescription',
    };

    const productEditedRaw = {
      id: productId,
      userId: faker.number.int(),
      title: productRequest.title,
      description: productRequest.description,
    };

    describe('Successful case', () => {
      it('should call findUnique with correct arguments', async () => {
        const findUniqueSpy = jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        jest.spyOn(db.product, 'update').mockResolvedValue(productEditedRaw);

        await ProductService.updateProductService(productId, productRequest);

        expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: productId } });
      });

      it('should call update with correct arguments', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        const updateSpy = jest.spyOn(db.product, 'update').mockResolvedValue(productEditedRaw);

        await ProductService.updateProductService(productId, productRequest);

        expect(updateSpy).toHaveBeenCalledWith({ data: { ...productRequest }, where: { id: productId } });
      });

      it('should return the edited product', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        jest.spyOn(db.product, 'update').mockResolvedValue(productEditedRaw);

        const result = await ProductService.updateProductService(productId, productRequest);

        expect(result).toEqual(ProductSerializer.serialize(productEditedRaw));
      });
    });

    describe('Error case', () => {
      it('should throw an ApiError (NOT_FOUND) when product is not found', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(null);

        await expect(ProductService.updateProductService(productId, productRequest)).rejects.toThrow(
          new ApiError(errors.NOT_FOUND),
        );
      });

      it('should throw an Error on database error', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        jest.spyOn(db.product, 'update').mockRejectedValue(new Error('Database error'));

        await expect(ProductService.updateProductService(productId, productRequest)).rejects.toThrow(
          new Error('Database error'),
        );
      });
    });
  });
});
