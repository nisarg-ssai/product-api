require("dotenv").config();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ElasticSearchClient } from "./elastic";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    new ElasticSearchClient();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        })
    );

    await app.listen(3000);
}
bootstrap();
