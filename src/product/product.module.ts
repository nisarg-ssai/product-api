import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
// import { ElasticsearchModule } from "@nestjs/elasticsearch";

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    // imports: [
    //     ElasticsearchModule.register({
    //         node: process.env.ELASTIC_URL,
    //         auth: {
    //             apiKey: {
    //                 id: "stream",
    //                 api_key: process.env.ELASTIC_KEY,
    //             },
    //         },
    //     }),
    // ],
})
export class ProductModule {}
