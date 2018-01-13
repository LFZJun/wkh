/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const FULL = "full";
/* harmony export (immutable) */ __webpack_exports__["b"] = FULL;

const VALUE = "value";
/* harmony export (immutable) */ __webpack_exports__["f"] = VALUE;

const HOME = "/inject/home";
/* harmony export (immutable) */ __webpack_exports__["c"] = HOME;

const MARKET = "/inject/market";
/* harmony export (immutable) */ __webpack_exports__["d"] = MARKET;

const ALERT = "/inject/alert";
/* harmony export (immutable) */ __webpack_exports__["a"] = ALERT;

const TRANSACTION = "/background/transaction";
/* harmony export (immutable) */ __webpack_exports__["e"] = TRANSACTION;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function Next(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let handlers = ctx.handlers;
        let n = ctx.handlerIndex(-1) + 1;
        if (n < handlers.length) {
            ctx.handlerIndex(n);
            try {
                yield handlers[n](ctx);
            }
            catch (err) {
                throw err;
            }
        }
    });
}
class Context {
    constructor(handlers = [], values = {}, currentHandlerIndex = 0) {
        this.handlers = handlers;
        this.values = values;
        this.currentHandlerIndex = currentHandlerIndex;
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Next(this);
            }
            catch (err) {
                throw err;
            }
        });
    }
    handlerIndex(n) {
        if (n < 0 || n > this.handlers.length - 1) {
            return this.currentHandlerIndex;
        }
        return this.currentHandlerIndex = n;
    }
}
/* unused harmony export Context */

class Route {
    constructor(handlers = []) {
        this.handlers = handlers;
    }
    join(...handlers) {
        this.handlers.push(...handlers);
    }
}
/* unused harmony export Route */

class Router {
    constructor(middleware = [], routes = {}) {
        this.middleware = middleware;
        this.routes = routes;
    }
    use(...handlers) {
        this.middleware.push(...handlers);
    }
    handle(key, ...handlers) {
        if (this.routes[key] == null) {
            this.routes[key] = new Route([...handlers]);
        }
        this.routes[key].join(...handlers);
    }
    serve(key, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let route = this.routes[key];
            if (route == null) {
                return;
            }
            ctx.handlers = [...this.middleware, ...route.handlers];
            try {
                yield Next(ctx);
            }
            catch (err) {
                throw err;
            }
        });
    }
    run() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            let context = new Context();
            context.request = request;
            context.sender = sender;
            context.response = {};
            this.serve(request.path, context).catch(function (err) {
                sendResponse(context.response);
                throw err;
            }).then(function () {
                sendResponse(context.response);
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Router;



/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__feed__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(6);





console.log("background");

const feedingCenter = new __WEBPACK_IMPORTED_MODULE_1__feed__["a" /* FeedingCenter */]();
const router = new __WEBPACK_IMPORTED_MODULE_2__router__["a" /* Router */]();

router.handle(__WEBPACK_IMPORTED_MODULE_0__consts__["e" /* TRANSACTION */], ctx => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
            "wallet": null,
            "coin": null
        }, function (result) {
            let {request} = ctx;
            const {mode, feeding, limit, id} = request;
            const {coin} = result;
            if (mode === __WEBPACK_IMPORTED_MODULE_0__consts__["b" /* FULL */]) {
                console.log(`需要喂养${feedingCenter.fullyFeeds(id, feeding, limit, coin)}次`);
                console.log(feedingCenter);
            } else {
                resolve()
            }
        })
    });
});

router.run();

/**
 * 监听页面变化
 */
chrome.webRequest.onCompleted.addListener(
    function (details) {
        chrome.tabs.query({active: true}, function (tabs) {
            chrome.storage.sync.get({
                "mode": __WEBPACK_IMPORTED_MODULE_0__consts__["f" /* VALUE */],
                "min": 0.1,
                "kg": false,
                "wallet": null,
                "coin": 0
            }, function (result) {
                const tab = tabs[0];
                let path = null;
                if (result.wallet === null || result.wallet === "") {
                    chrome.tabs.sendMessage(tab.id, {
                        path: __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* ALERT */],
                        alert: "需要配置钱包文件"
                    });
                    return
                }
                if (result.coin === 0) {
                    chrome.tabs.sendMessage(tab.id, {
                        path: __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* ALERT */],
                        alert: "请填写单次玩客币数量"
                    });
                    return
                }
                result.wallet = JSON.parse(result.wallet);
                Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* whiteList */])().then(roll => {
                    if (roll.indexOf(`0x${result.wallet.address}`) === -1) {
                        chrome.tabs.sendMessage(tab.id, {
                            path: __WEBPACK_IMPORTED_MODULE_0__consts__["a" /* ALERT */],
                            alert: "需要加入白名单"
                        });
                        return
                    }
                    if (tab.url === "http://h.miguan.in/home") {
                        path = __WEBPACK_IMPORTED_MODULE_0__consts__["c" /* HOME */];
                    } else if (tab.url.indexOf("http://h.miguan.in/market") !== -1) {
                        path = __WEBPACK_IMPORTED_MODULE_0__consts__["d" /* MARKET */];
                    } else {
                        return
                    }
                    result.path = path;
                    chrome.tabs.sendMessage(tab.id, result, function (response) {
                        console.log(response);
                    });
                });
            })
        });
        return true;
    },
    {urls: ["http://*.miguan.in/*"]}
);


const FeedingUrl = "http://api.h.miguan.in/game/balanceFeed";
let globalMonkeyID = "";
chrome.webRequest.onBeforeSendHeaders.addListener(details => {
    let count = 0;
    for (let n in details.requestHeaders) {
        const name = details.requestHeaders[n].name;
        if (name === "Origin") {
            details.requestHeaders[n].value = "http://h.miguan.in";
        } else if (name === "accessToken") {
            count++;
        } else if (name === "Access-Control-Request-Method") {
            count++;
        }
    }
    if (count === 0) {
        details.requestHeaders.push({name: "Referer", value: `http://h.miguan.in/monkey/${globalMonkeyID}`});
    } else if (count === 1) {
        details.requestHeaders.push({name: "Access-Control-Request-Headers", value: "accesstoken,x-requested-with"});
        details.requestHeaders.push({name: "Access-Control-Request-Method", value: "POST"});
        details.requestHeaders.push({name: "Referer", value: "http://h.miguan.in/monkey/"})
    }
    return {requestHeaders: details.requestHeaders};
}, {urls: [FeedingUrl]}, ["blocking", "requestHeaders"]);


function sleep() {
    return new Promise(resolve => {
        chrome.storage.sync.get({
            "interval": 5,
        }, function (result) {
            const interval = result.interval < 1 ? 1000 : result.interval * 1000;
            setTimeout(resolve, interval)
        })
    })
}

const TransactionLoop = async () => {
    console.log("TransactionLoop begin");
    while (true) {
        let feedings = feedingCenter.back();
        if (feedings === undefined) {
            await sleep();
            console.log("TransactionLoop idle");
            continue;
        }
        let feeding = feedings.shift();
        while (feeding !== undefined) {
            let coin = feeding.coin;
            let monkeyID = feedings.monkeyID;
            $.ajax({
                type: 'OPTIONS',
                url: FeedingUrl,
                success: (data) => {
                    console.log(data);
                    chrome.cookies.get({url: "http://api.h.miguan.in", name: "token"}, (cookie => {
                        console.log(`开始喂养 ${monkeyID} ${coin}`);
                        globalMonkeyID = monkeyID;
                        $.ajax({
                            type: 'POST',
                            url: FeedingUrl,
                            data: {
                                coin: coin,
                                monkeyId: monkeyID
                            },
                            headers: {
                                Accept: "application/json, text/plain, */*",
                                accessToken: `${cookie.value}`,
                            },
                            success: function (data) {
                                console.log(data);
                            },
                            error: function (error) {
                                console.log(error);
                            }
                        });
                    }));
                }
            });
            await sleep();
            feeding = feedings.shift();
        }
    }
};

setTimeout(TransactionLoop, 0);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class FeedingCenter {
    constructor(monkeys = {}) {
        this.monkeys = monkeys;
    }
    fullyFeeds(monkeyID, feeding, limit, coin) {
        let feedings = this.monkeys[monkeyID];
        if (feedings === undefined || feedings.isEmpty()) {
            feedings = this.monkeys[monkeyID] = new Feedings(monkeyID, feeding, limit);
        }
        let times = 0;
        while (feedings.push(new Feeding(coin))) {
            times++;
        }
        return times;
    }
    back() {
        let monkeyIDs = Object.keys(this.monkeys);
        for (let monkeyID of monkeyIDs) {
            let feeding = this.monkeys[monkeyID];
            if (feeding.isEmpty()) {
                delete this.monkeys[monkeyID];
                continue;
            }
            return feeding;
        }
        return undefined;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FeedingCenter;

class Feedings {
    constructor(monkeyID, currentFeedings, limitFeedings) {
        this.monkeyID = monkeyID;
        this.currentFeedings = currentFeedings;
        this.limitFeedings = limitFeedings;
        this.feedings = currentFeedings;
        this.taskQueue = [];
    }
    push(feeding) {
        let coin = Number(feeding.coin);
        if (this.feedings + coin > this.limitFeedings) {
            return false;
        }
        this.feedings += coin;
        this.taskQueue.push(feeding);
        return true;
    }
    shift() {
        if (this.isEmpty()) {
            return undefined;
        }
        let feeding = this.taskQueue.shift();
        this.currentFeedings += Number(feeding.coin);
        return feeding;
    }
    back() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.taskQueue[0];
    }
    isEmpty() {
        return this.taskQueue.length == 0;
    }
}
/* unused harmony export Feedings */

class Feeding {
    constructor(coin) {
        this.coin = coin;
    }
}
/* unused harmony export Feeding */



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export bestFeeding */
/* harmony export (immutable) */ __webpack_exports__["a"] = whiteList;
class Combination {
    constructor(list = [], sum = 0) {
        this.list = list;
        this.sum = sum;
    }
}
function bestFeeding(limit, base) {
    let cs = [];
    let naiveBestFeeding = (newBase, p) => {
        for (let i = newBase; i < limit; i++) {
            let sum = p.sum + i;
            if (sum > limit) {
                if (p.list.length == 0 || p.sum + base < limit) {
                    return;
                }
                if (cs.length == 0 || cs[0].sum == p.sum) {
                    cs.push(new Combination(p.list, p.sum));
                }
                else if (cs[0].sum < p.sum) {
                    cs = [new Combination(p.list, p.sum)];
                }
                return;
            }
            let slice = p.list.slice();
            slice.push(`${i | 0}.${base.toString().slice(2)}`);
            naiveBestFeeding(i, new Combination(slice, sum));
        }
    };
    naiveBestFeeding(base, new Combination());
    cs.sort(((a, b) => {
        if (a.list.length < b.list.length) {
            return -1;
        }
        if (a.list.length > b.list.length) {
            return 1;
        }
        return 0;
    }));
    return cs;
}
function whiteList() {
    return new Promise((rs, rj) => {
        $.getJSON("http://mxz-upload-public.oss-cn-hangzhou.aliyuncs.com/wkh/whitelist.json", function (resp) {
            rs(resp);
        });
    });
}


/***/ })
/******/ ]);