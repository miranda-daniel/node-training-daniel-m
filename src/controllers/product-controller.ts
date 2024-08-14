import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Path,
  Post,
  Put,
  Route,
  Security,
} from 'tsoa';
import { ProductService } from '@services/product-services';
import {
  CreateProductRequest,
  Product,
  ProductIndex,
  UpdateProductRequest,
} from '@typing/product';
import { Context } from '@typing/session';

@Route('products')
export class ProductController extends Controller {
  /**
   *  Get Products.
   * @summary Get all products.
   * @returns {Product[]} 200 - List of products
   */
  @Get('/')
  @Security('jwt')
  public async getAllProducts(): Promise<ProductIndex[]> {
    const productsResponse = await ProductService.getProductsService();
    return productsResponse;
  }

  /**
   *  Create Product.
   * @summary Create new product in database
   * @returns {Product} 200 - Product
   */
  @Post('/create')
  @Security('jwt')
  public async createProduct(
    @Request() context: Context,
    @Body() requestBody: CreateProductRequest
  ): Promise<Product> {
    const { userId } = context.user;

    const productResponse = await ProductService.createProductService(
      userId,
      requestBody
    );
    return productResponse;
  }

  /**
   *  Delete Product.
   * @summary Delete product from database
   * @returns {Product} 200 - Product
   */
  @Delete('/{productId}')
  @Security('jwt')
  public async deleteProduct(@Path() productId: number): Promise<Product> {
    // Add spaces to test prettier github action
    const productResponse =
      await ProductService.deleteProductService(productId);
    return productResponse;
  }

  /**
   *  Update Product.
   * @summary Update product from database
   * @returns {Product} 200 - Product
   */
  @Put('/{productId}')
  @Security('jwt')
  public async updateProduct(
    @Path() productId: number,
    @Body() requestBody: UpdateProductRequest
  ): Promise<Product> {
    const productResponse = await ProductService.updateProductService(
      productId,
      requestBody
    );
    return productResponse;
  }
}
