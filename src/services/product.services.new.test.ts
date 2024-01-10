import { faker } from '@faker-js/faker';
import { db } from '../../prisma/db';
import { ApiError } from '../config/apiError';
import { errors } from '../config/errors';
import { ProductSerializer } from '../serializers/product-serializer';
import { productIndexRandomRaw, productRandomRaw } from '../test/test-constants';
import { CreateProductRequest, UpdateProductRequest } from '../types/product';
import { ProductService } from './product.services';

describe('Products Service', () => {
  const fakeUserId = faker.number.int();
  const fakeProductId = faker.number.int();

  describe('Get Product Service', () => {
    describe('Successful case', () => {
      it('should call findMany with the correct arguments', async () => {
        const createSpy = jest.spyOn(db.product, 'findMany');

        await ProductService.getProductsService();

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
      });

      it('should return a product list', async () => {
        jest.spyOn(db.product, 'findMany').mockResolvedValue([productIndexRandomRaw]);

        const result = await ProductService.getProductsService();

        expect(result).toEqual(ProductSerializer.serializeProductListIndex([productIndexRandomRaw]));
      });
    });

    describe('Error case', () => {
      it('should throw an Error on database error', async () => {
        jest.spyOn(db.product, 'findMany').mockRejectedValue(new Error('Database error'));

        await expect(ProductService.getProductsService()).rejects.toThrow(new Error('Database error'));
      });
    });
  });

  describe('Create Product Service', () => {
    const createProductRequest: CreateProductRequest = {
      title: 'newTitle',
      description: ' newDescription',
    };

    describe('Successful case', () => {
      it('should call create with the correct arguments', async () => {
        const createSpy = jest.spyOn(db.product, 'create').mockResolvedValue(productRandomRaw);

        await ProductService.createProductService(fakeUserId, createProductRequest);

        expect(createSpy).toHaveBeenCalledWith({
          data: {
            title: createProductRequest.title,
            description: createProductRequest.description,
            userId: fakeUserId,
          },
        });
      });

      it('should return the created product', async () => {
        jest.spyOn(db.product, 'create').mockResolvedValue(productRandomRaw);

        const result = await ProductService.createProductService(fakeUserId, productRandomRaw);

        expect(result).toEqual(ProductSerializer.serialize(productRandomRaw));
      });
    });

    describe('Error case', () => {
      it('should throw an Error on database error', async () => {
        jest.spyOn(db.product, 'create').mockRejectedValue(new Error('Database error'));

        await expect(ProductService.createProductService(fakeUserId, productRandomRaw)).rejects.toThrow(
          new Error('Database error'),
        );
      });
    });
  });

  describe('Update Product Service', () => {
    const productRequest: UpdateProductRequest = {
      title: 'newTitle',
      description: ' newDescription',
    };

    const productEditedRaw = {
      id: fakeProductId,
      userId: faker.number.int(),
      title: productRequest.title,
      description: productRequest.description,
    };

    describe('Successful case', () => {
      it('should call findUnique with correct arguments', async () => {
        const findUniqueSpy = jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        jest.spyOn(db.product, 'update').mockResolvedValue(productEditedRaw);

        await ProductService.updateProductService(fakeProductId, productRequest);

        expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: fakeProductId } });
      });

      it('should call update with correct arguments', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        const updateSpy = jest.spyOn(db.product, 'update').mockResolvedValue(productEditedRaw);

        await ProductService.updateProductService(fakeProductId, productRequest);

        expect(updateSpy).toHaveBeenCalledWith({ data: { ...productRequest }, where: { id: fakeProductId } });
      });

      it('should return the edited product', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        jest.spyOn(db.product, 'update').mockResolvedValue(productEditedRaw);

        const result = await ProductService.updateProductService(fakeProductId, productRequest);

        expect(result).toEqual(ProductSerializer.serialize(productEditedRaw));
      });
    });

    describe('Error case', () => {
      it('should throw an ApiError (NOT_FOUND) when product is not found', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(null);

        await expect(ProductService.updateProductService(fakeProductId, productRequest)).rejects.toThrow(
          new ApiError(errors.NOT_FOUND),
        );
      });

      it('should throw an Error on database error', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        jest.spyOn(db.product, 'update').mockRejectedValue(new Error('Database error'));

        await expect(ProductService.updateProductService(fakeProductId, productRequest)).rejects.toThrow(
          new Error('Database error'),
        );
      });
    });
  });

  describe('Delete Product Service', () => {
    describe('Successful case', () => {
      it('should call findUnique with correct arguments', async () => {
        const findUniqueSpy = jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        jest.spyOn(db.product, 'delete').mockResolvedValue(productRandomRaw);

        const { id } = productRandomRaw;

        await ProductService.deleteProductService(id);

        expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id } });
      });

      it('should call delete with correct arguments', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        const deleteSpy = jest.spyOn(db.product, 'delete').mockResolvedValue(productRandomRaw);

        const { id } = productRandomRaw;

        await ProductService.deleteProductService(id);

        expect(deleteSpy).toHaveBeenCalledWith({ where: { id } });
      });

      it('should return the deleted product', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        jest.spyOn(db.product, 'delete').mockResolvedValue(productRandomRaw);

        const { id } = productRandomRaw;

        const result = await ProductService.deleteProductService(id);

        expect(result).toEqual(ProductSerializer.serialize(productRandomRaw));
      });
    });

    describe('Error case', () => {
      it('should throw an ApiError (NOT_FOUND) when product is not found', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(null);

        await expect(ProductService.deleteProductService(fakeProductId)).rejects.toThrow(
          new ApiError(errors.NOT_FOUND),
        );
      });

      it('should throw an Error on database error', async () => {
        jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
        jest.spyOn(db.product, 'delete').mockRejectedValue(new Error('Database error'));

        await expect(ProductService.deleteProductService(fakeProductId)).rejects.toThrow(new Error('Database error'));
      });
    });
  });
});


