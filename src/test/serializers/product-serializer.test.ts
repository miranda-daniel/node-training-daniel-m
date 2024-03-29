import { Product } from '@prisma/client';
import {
  productIndexRandomRaw,
  productRandomRaw,
} from '@test/helpers/data-generators';
import { ProductSerializer } from '@serializers/product-serializer';
import { ProductIndex } from '@typing/product';

describe('Serializer Product', () => {
  it('should serialize a product response', async () => {
    const productSerialized: Product = {
      id: productRandomRaw.id,
      title: productRandomRaw.title,
      description: productRandomRaw.description,
      userId: productRandomRaw.userId,
    };

    expect(productSerialized).toEqual(
      ProductSerializer.serialize(productRandomRaw)
    );
  });

  it('should serialize index view', async () => {
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

    expect(productIndexSerialized).toEqual(
      ProductSerializer.serializeProductListIndex([productIndexRandomRaw])
    );
  });
});
