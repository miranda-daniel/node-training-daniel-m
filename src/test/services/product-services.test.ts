import { faker } from '@faker-js/faker';
import { db } from '@root/prisma/db';
import { ApiError } from '@config/api-error';
import { errors } from '@config/errors';
import { ProductSerializer } from '@serializers/product-serializer';
import {
  productIndexRandomRaw,
  productRandomRaw,
} from '@test/helpers/data-generators';
import { ProductService } from '@services/product-services';
import {
  CreateProductRequest,
  ProductRaw,
  UpdateProductRequest,
} from '@typing/product';

const userId = faker.number.int();
const productId = faker.number.int();

const dummyProductRaw: ProductRaw = {
  id: 1,
  title: 'dummyTitle',
  description: 'dummyDescription',
  userId: 2,
};

describe('Get Product', () => {
  describe('Successful case', () => {
    it('should call findMany with the correct arguments', async () => {
      const createSpy = jest
        .spyOn(db.product, 'findMany')
        .mockResolvedValue([]);

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
      jest
        .spyOn(db.product, 'findMany')
        .mockResolvedValue([productIndexRandomRaw]);

      const result = await ProductService.getProductsService();

      expect(result).toEqual(
        ProductSerializer.serializeProductListIndex([productIndexRandomRaw])
      );
    });
  });

  describe('Error case', () => {
    it('should throw an Error on database error', async () => {
      jest
        .spyOn(db.product, 'findMany')
        .mockRejectedValue(new Error('Database error'));

      await expect(ProductService.getProductsService()).rejects.toThrow(
        new Error('Database error')
      );
    });
  });
});

describe('Create Product', () => {
  const createProductRequest: CreateProductRequest = {
    title: 'newTitle',
    description: ' newDescription',
  };

  describe('Successful case', () => {
    it('should call create with the correct arguments and return de created product', async () => {
      const createSpy = jest
        .spyOn(db.product, 'create')
        .mockResolvedValue(dummyProductRaw);

      await ProductService.createProductService(userId, createProductRequest);

      expect(createSpy).toHaveBeenCalledWith({
        data: {
          title: createProductRequest.title,
          description: createProductRequest.description,
          userId: userId,
        },
      });
    });

    it('should return the created product', async () => {
      jest.spyOn(db.product, 'create').mockResolvedValue(productRandomRaw);

      const result = await ProductService.createProductService(
        userId,
        createProductRequest
      );

      expect(result).toEqual(ProductSerializer.serialize(productRandomRaw));
    });
  });

  describe('Error case', () => {
    it('should throw an Error on database error', async () => {
      jest
        .spyOn(db.product, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        ProductService.createProductService(userId, createProductRequest)
      ).rejects.toThrow(new Error('Database error'));
    });
  });
});

describe('Update Product', () => {
  const updateProductRequest: UpdateProductRequest = {
    title: 'newTitle',
    description: ' newDescription',
  };

  const productEditedRaw = {
    id: productId,
    userId: faker.number.int(),
    title: updateProductRequest.title,
    description: updateProductRequest.description,
  };

  describe('Successful case', () => {
    it('should call findUnique with correct arguments', async () => {
      const findUniqueSpy = jest
        .spyOn(db.product, 'findUnique')
        .mockResolvedValue(dummyProductRaw);

      jest.spyOn(db.product, 'update').mockResolvedValue(productEditedRaw);

      await ProductService.updateProductService(
        productId,
        updateProductRequest
      );

      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });

    it('should call update with correct arguments', async () => {
      jest.spyOn(db.product, 'findUnique').mockResolvedValue(dummyProductRaw);

      const updateSpy = jest
        .spyOn(db.product, 'update')
        .mockResolvedValue(productEditedRaw);

      await ProductService.updateProductService(
        productId,
        updateProductRequest
      );

      expect(updateSpy).toHaveBeenCalledWith({
        data: { ...updateProductRequest },
        where: { id: productId },
      });
    });

    it('should return the edited product', async () => {
      jest.spyOn(db.product, 'findUnique').mockResolvedValue(dummyProductRaw);
      jest.spyOn(db.product, 'update').mockResolvedValue(productEditedRaw);

      const result = await ProductService.updateProductService(
        productId,
        updateProductRequest
      );

      expect(result).toEqual(ProductSerializer.serialize(productEditedRaw));
    });
  });

  describe('Error case', () => {
    it('should throw an ApiError (NOT_FOUND) when product is not found', async () => {
      jest.spyOn(db.product, 'findUnique').mockResolvedValue(null);

      await expect(
        ProductService.updateProductService(productId, updateProductRequest)
      ).rejects.toThrow(new ApiError(errors.NOT_FOUND));
    });

    it('should throw an Error on database error', async () => {
      jest.spyOn(db.product, 'findUnique').mockResolvedValue(dummyProductRaw);
      jest
        .spyOn(db.product, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        ProductService.updateProductService(productId, updateProductRequest)
      ).rejects.toThrow(new Error('Database error'));
    });
  });
});

describe('Delete Product', () => {
  describe('Successful case', () => {
    it('should call findUnique with correct arguments', async () => {
      const findUniqueSpy = jest
        .spyOn(db.product, 'findUnique')
        .mockResolvedValue(productRandomRaw);
      jest.spyOn(db.product, 'delete').mockResolvedValue(productRandomRaw);

      const { id } = productRandomRaw;

      await ProductService.deleteProductService(id);

      expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id } });
    });

    it('should call delete with correct arguments', async () => {
      jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
      const deleteSpy = jest
        .spyOn(db.product, 'delete')
        .mockResolvedValue(productRandomRaw);

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

      await expect(
        ProductService.deleteProductService(productId)
      ).rejects.toThrow(new ApiError(errors.NOT_FOUND));
    });

    it('should throw an Error on database error', async () => {
      jest.spyOn(db.product, 'findUnique').mockResolvedValue(productRandomRaw);
      jest
        .spyOn(db.product, 'delete')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        ProductService.deleteProductService(productId)
      ).rejects.toThrow(new Error('Database error'));
    });
  });
});
