import { BadRequestException, Injectable } from "@nestjs/common";
// import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ElasticSearchClient } from "src/elastic";
import { AddProductDto, ProductDto, ProductTypeEnum } from "./dto";

@Injectable()
export class ProductService {
    constructor() {}

    async listProduct(query): Promise<any> {
        const pageSize = Number(query.pageSize) || 10;
        const pageNum = Number(query.pageNum) || 1;
        const from = (pageNum - 1) * pageSize;
        const filters = this.makeFilters(query);

        const searchQuery = {
            bool: {
                must: [{ match_all: {} }, filters],
            },
        };

        const res = await ElasticSearchClient.client.search({
            index: "intern",
            body: {
                size: pageSize,
                from,
                aggs: {
                    total_quantity: {
                        sum: { field: "quantity" },
                    },
                },
                query: searchQuery,
            },
        });

        // return res;
        return {
            docs: res.hits.hits,
            sellCount: res.aggregations.total_quantity.value,
        };
    }

    async addProduct(addProduct: AddProductDto): Promise<string> {
        console.log("in add", addProduct);

        const product: ProductDto = Object.assign(addProduct, {
            purchaseId: Date.now(),
            purchaseDate: new Date(),
        });

        // product.purchaseDate.setDate(product.purchaseDate.getDate() + 1);

        const res = await ElasticSearchClient.client.index({
            index: "intern",
            body: product,
        });

        console.log(res);

        return res.result;
    }

    private makeFilters(query): any {
        const dateFrom = query.dateFrom;
        const dateTo = query.dateTo;
        const priceFrom = Number(query.priceFrom);
        const priceTo = Number(query.priceTo);
        const quantityFrom = Number(
            query.quantityFrom < 1 ? 1 : query.quantityFrom
        );
        const quantityTo = Number(query.quantityTo);
        const name = query.name;
        const type = query.type;
        const buyer = query.buyer;
        const seller = query.seller;

        if (
            quantityFrom > quantityTo ||
            dateFrom > dateTo ||
            priceFrom > priceTo
        ) {
            throw new BadRequestException("Bad Search Filters");
        }

        const filters: any = {
            bool: {
                must: [
                    { range: { price: { gte: priceFrom, lte: priceTo } } },
                    { range: { purchaseDate: { gte: dateFrom, lte: dateTo } } },
                    {
                        range: {
                            quantity: { gte: quantityFrom, lte: quantityTo },
                        },
                    },
                ],
            },
        };

        if (name) {
            const nameFilter = { term: { name } };
            filters.bool.must.push(nameFilter);
        }
        if (type) {
            const typeFilter = { term: { type } };
            filters.bool.must.push(typeFilter);
        }
        if (buyer) {
            const buyerFilter = { term: { buyer } };
            filters.bool.must.push(buyerFilter);
        }
        if (seller) {
            const sellerFilter = { term: { seller } };
            filters.bool.must.push(sellerFilter);
        }
        return filters;
    }
}
