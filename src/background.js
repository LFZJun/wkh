import { FULL, VALUE, HOME, TRANSACTION, MARKET, ALERT } from "./consts";
import { FeedingCenter } from "./feed";
import { Router } from "./router";
import { whiteList } from "./utils";

console.log("background");

const feedingCenter = new FeedingCenter();
const router = new Router();

router.handle(TRANSACTION, ctx => {
    return new Promise((resolve, reject) => {
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
    function (details) {
        chrome.tabs.query({active: true}, function (tabs) {
            chrome.storage.sync.get({
                "mode": VALUE,
                "min": 0.1,
                "kg": false,
                "wallet": null,
                "coin": 0
            }, function (result) {
                const tab = tabs[0];
                let path = null;
                if (result.wallet === null || result.wallet === "") {
                    chrome.tabs.sendMessage(tab.id, {
                        path: ALERT,
                        alert: "需要配置钱包文件"
                    });
                    return
                }
                if (result.coin === 0) {
                    chrome.tabs.sendMessage(tab.id, {
                        path: ALERT,
                        alert: "请填写单次玩客币数量"
                    });
                    return
                }
                result.wallet = JSON.parse(result.wallet);
                whiteList().then(roll => {
                    if (roll.indexOf(`0x${result.wallet.address}`) === -1) {
                        chrome.tabs.sendMessage(tab.id, {
                            path: ALERT,
                            alert: "需要加入白名单"
                        });
                        return
                    }
                    if (tab.url === "http://h.miguan.in/home") {
                        path = HOME;
                    } else if (tab.url.indexOf("http://h.miguan.in/market") !== -1) {
                        path = MARKET;
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