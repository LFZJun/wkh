import HttpHeader = chrome.webRequest.HttpHeader;

export type hd = (headers: HttpHeader[], key: string, value: string) => void;

export class HeaderHandler {
    handlers: ({ name: string, callback: (header: HttpHeader) => void })[];
    fuckHandlers: { [name: string]: hd };

    constructor(handlers: ({ name: string, callback: (header: HttpHeader) => void })[] = [], fuckHandlers: { [p: string]: hd } = {}) {
        this.handlers = handlers;
        this.fuckHandlers = fuckHandlers;
    }

    build(headers: HttpHeader[]): HttpHeader[] {
        let remove: number[] = [];
        let filters = this.handlers.slice();
        for (let index in headers) {
            let header = headers[index];
            let {name} = header;
            // fuck_add_{name}: {value}
            if (name.startsWith("Fuck-")) {
                remove.splice(0, 0, Number(index));
                name = name.slice(5);
                let delimiter = name.indexOf("-");
                let handlerName = name.slice(0, delimiter);
                let handler = this.fuckHandlers[handlerName];
                if (handler == undefined) {
                    continue
                }
                handler(headers, name.slice(delimiter + 1), header.value);
                continue
            }
            // replace
            for (let i in filters) {
                let filter = filters[i];
                if (filter.name === header.name) {
                    filter.callback(header);
                    filters.splice(Number(i), 1);
                    break
                }
            }
        }
        // remove
        for (let i of remove) {
            headers.splice(i, 1);
        }
        return headers;
    }
}

export const ADD = "Add";

export function action(ac: string): string {
    return `Fuck-${ac}-`;
}

export function newHeaderHandler() {
    let headerHandler = new HeaderHandler();
    headerHandler.fuckHandlers[ADD] = (headers: HttpHeader[], key: string, value: string) => {
        headers.push({name: key, value: value});
    };
    return headerHandler;
}

