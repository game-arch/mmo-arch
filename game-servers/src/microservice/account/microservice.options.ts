import {config} from "../../lib/config";

export const options = {
    transport: config.microservice.transport,
    options: {
        url: config.microservice.options.url,
        queue: 'account'
    }
};
