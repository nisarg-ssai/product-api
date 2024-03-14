import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AddProductDto, ProductDto } from "./dto";

@Controller("p")
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get("list")
    list(@Query() query): Promise<ProductDto> {
        return this.productService.listProduct(query);
    }

    @Post("add")
    add(@Body() product: AddProductDto): Promise<string> {
        return this.productService.addProduct(product);
    }
}
