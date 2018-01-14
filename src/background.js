import Axios from "axios"
import { ALERT, FULL, HOME, MARKET, TRANSACTION, VALUE } from "./consts";
import { FeedingCenter } from "./feed";
import { Router } from "./router";
import { getToken, sleep } from "./utils";

console.log("background");

const feedingCenter = new FeedingCenter();
const router = new Router();
const FeedingUrl = "http://api.h.miguan.in/game/balanceFeed";
let globalMonkeyID = "";
let login = false;
let token = "";

router.handle(TRANSACTION, ctx => {
    return new Promise((resolve) => {
        chrome.storage.sync.get({
            "wallet": null,
            "coin": null
        }, function (result) {
            let {request} = ctx;
            const {mode, feeding, limit, id} = request;
            const {coin} = result;
            if (mode === FULL) {
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
    function () {
        if (!login) {
            return
        }
        chrome.tabs.query({active: true}, function (tabs) {
            const tab = tabs[0];
            let path = null;
            if (tab.url === "http://h.miguan.in/home") {
                path = HOME;
            } else if (tab.url.indexOf("http://h.miguan.in/market") !== -1) {
                path = MARKET;
            } else {
                return
            }
            chrome.storage.sync.get({
                "mode": VALUE,
                "min": 0.1,
                "kg": false,
                "coin": 0
            }, function (result) {
                if (result.coin === 0) {
                    chrome.tabs.sendMessage(tab.id, {
                        path: ALERT,
                        alert: "请填写单次玩客币数量"
                    });
                    return
                }
                // whiteList().then(response => {
                // const roll = response.data;
                // if (roll.indexOf(`0x${result.wallet.address}`) === -1) {
                //     chrome.tabs.sendMessage(tab.id, {
                //         path: ALERT,
                //         alert: "需要加入白名单"
                //     });
                //     return
                // }
                result.path = path;
                chrome.tabs.sendMessage(tab.id, result, function (response) {
                    console.log(response);
                });
                // });
            })
        });
        return true;
    },
    {urls: ["http://api.h.miguan.in/*"]}
);

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
            Axios({
                url: FeedingUrl,
                method: 'options',
            }).then(() => {
                return getToken();
            }).then((token) => {
                return Axios({
                    url: FeedingUrl,
                    method: 'post',
                    data: {
                        coin: coin,
                        monkeyId: monkeyID
                    },
                    headers: {
                        'Accept': "application/json, text/plain, */*",
                        'accessToken': token,
                    },
                });
            }).then((response) => {
                console.log(response)
            });
            await sleep();
            feeding = feedings.shift();
        }
    }
};

chrome.webRequest.onBeforeSendHeaders.addListener(details => {
    for (let n in details.requestHeaders) {
        const name = details.requestHeaders[n].name;
        if (name === "accessToken") {
            token = details.requestHeaders[n].value;
        }
    }
    console.log(details.requestHeaders);
    return {requestHeaders: details.requestHeaders};
}, {urls: ["http://api.h.miguan.in/*"]}, ["blocking", "requestHeaders"]);

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

// const LoginLoop = async () => {
//
// };

// 检查是否在白名单
// setTimeout(LoginLoop, 0);
// 检查是否登陆
setTimeout(TransactionLoop, 0);