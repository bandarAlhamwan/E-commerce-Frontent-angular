import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  private baseUrl = 'http://localhost:8080/api/products';  // this url return 20 items by default
  private categoryUrl = 'http://localhost:8080/api/product-category';
  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product>{
    
    // need to build URL base on product id
    const productUrl = `${this.baseUrl}/${theProductId}`

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number, 
                          thePageSize: number, 
                          theCategoryId: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` 
    + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  // to map the Json data from spring data rest to Product array
  getProductList(theCategoryId: number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                          thePageSize: number,
                          theKeyword: string): Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      + `&page=${thePage}&size=${thePageSize}`;
    console.log(searchUrl);
    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}



// unwraps the json from spring data rest _embedded entry (the name of object inside the interface must be like spring response)
interface GetResponseProducts{
  _embedded: {
    products: Product[];
  },
  page:{
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}