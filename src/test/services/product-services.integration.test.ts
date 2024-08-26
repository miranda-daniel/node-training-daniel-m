// import { faker } from '@faker-js/faker';
// import { db } from '@root/prisma/db';
// import { createProduct, createUser } from '@test/helpers/utils';
// import { ProductService } from '@services/product-services';
// import { PartialProduct, ProductRaw } from '@typing/product';

// describe('Products Service', () => {
//   let userId: number;

//   const productFake: PartialProduct = {
//     title: faker.commerce.productName(),
//     description: faker.commerce.productDescription(),
//   };

//   const expectVerifyFakeProductStructure = (product: ProductRaw) => {
//     expect(product).toEqual(
//       expect.objectContaining({
//         id: expect.any(Number),
//         title: productFake.title,
//         description: productFake.description,
//         userId,
//       })
//     );
//   };

//   beforeAll(async () => {
//     userId = (await createUser()).id;
//   });

//   afterAll(async () => {
//     await db.user.delete({
//       where: { id: userId },
//     });
//   });

//   describe('Get Products', () => {
//     it('should get an empty array of products', async () => {
//       await db.product.deleteMany();

//       const productsResponse = await ProductService.getProductsService();
//       expect(productsResponse).toEqual([]);
//     });

//     it('should get an array of products', async () => {
//       const productCreated = await createProduct({ userId });

//       const productsResponse = await ProductService.getProductsService();

//       expect(Array.isArray(productsResponse)).toBe(true);

//       await db.product.delete({ where: { id: productCreated!.id } });
//     });
//   });

//   describe('Create Product', () => {
//     it('should create a product', async () => {
//       const initialCount = await db.product.count();

//       const productCreated: ProductRaw = await createProduct({
//         ...productFake,
//         userId,
//       });

//       expectVerifyFakeProductStructure(productCreated);

//       const newCount = await db.product.count();

//       expect(newCount).toBe(initialCount + 1);

//       const product: ProductRaw | null = await db.product.findUnique({
//         where: { id: productCreated.id },
//       });
//       expect(product).not.toBeNull();

//       expectVerifyFakeProductStructure(product as ProductRaw);

//       await db.product.delete({ where: { id: productCreated.id } });
//     });
//   });

//   describe('Update Product', () => {
//     it('should update the product', async () => {
//       const productCreated = await createProduct({ userId });

//       const { id } = productCreated;

//       const newTitle = productCreated.title + '111';
//       const newDescription = productCreated.description + '111';

//       const expectVerifyProductEditedStructure = (product: ProductRaw) => {
//         expect(product).toEqual(
//           expect.objectContaining({
//             id,
//             title: newTitle,
//             description: newDescription,
//             userId,
//           })
//         );
//       };

//       const productEdited = await ProductService.updateProductService(id, {
//         title: newTitle,
//         description: newDescription,
//       });

//       expectVerifyProductEditedStructure(productEdited);

//       const product: ProductRaw | null = await db.product.findUnique({
//         where: { id },
//       });
//       expect(product).not.toBeNull();

//       expectVerifyProductEditedStructure(product as ProductRaw);

//       await db.product.delete({ where: { id } });
//     });
//   });

//   describe('Delete Product', () => {
//     it('should delete the product', async () => {
//       const productCreated = await createProduct({ ...productFake, userId });

//       const initialCount = await db.product.count();

//       const { id } = productCreated;

//       const productDeleted = await ProductService.deleteProductService(id);

//       expectVerifyFakeProductStructure(productDeleted);

//       const newCount = await db.product.count();

//       expect(newCount).toBe(initialCount - 1);

//       const product: ProductRaw | null = await db.product.findUnique({
//         where: { id },
//       });
//       expect(product).toBeNull();
//     });
//   });
// });
