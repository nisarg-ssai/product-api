const elasticsearch = require("elasticsearch");

export class ElasticSearchClient {
    static client;
    constructor() {
        ElasticSearchClient.client = new elasticsearch.Client({
            host: process.env.ELASTIC_URL,
            log: { type: "stdio", levels: [] },
            ssl: { rejectUnauthorized: false, pfx: [] },
            requestTimeout: 100000,
        });
        ElasticSearchClient.setup();
        ElasticSearchClient.ping();
    }

    private static async setup() {
        const indexName = "intern";
        const exists = await ElasticSearchClient.client.indices.exists({
            index: indexName,
        });
        if (exists) {
            console.log(`Index '${indexName}' exists.`);
        } else {
            console.log(`Index '${indexName}' does not exist.`);
            await ElasticSearchClient.client.create({ index: indexName });
            console.log("Created index:", indexName);
        }
    }

    static ping = async () => {
        let attempts = 0;
        const pinger = ({ resolve, reject }) => {
            console.log("attempts", attempts);
            attempts += 1;
            this.client
                .ping({ requestTimeout: 600000 })
                .then(() => {
                    console.log("Elasticsearch server available");
                    resolve(true);
                })
                .catch(() => {
                    if (attempts > 100)
                        reject(new Error("Elasticsearch failed to ping"));
                    //this.logger.error('Waiting for elasticsearch server...');
                    setTimeout(() => {
                        pinger({ resolve, reject });
                    }, 1000);
                });
        };

        return new Promise((resolve, reject) => {
            pinger({ resolve, reject });
        });
    };

    static async pushData(data) {
        let res = await this.client.bulk({
            body: [
                {
                    index: "intern",
                },
                data,
            ],
        });
        console.log(res);
    }
}
