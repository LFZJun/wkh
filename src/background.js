import Axios from "axios"
import qs from 'qs';
import {ALERT, FULL, HOME, MARKET, TRANSACTION, VALUE, Origin, APIOrigin} from "./consts";
import {FeedingCenter} from "./feed";
import {action, ADD, newHeaderHandler} from "./header";
import {Router} from "./router";
import {sleep, whiteList} from "./utils";

console.log("background");

const FeedingUrl = `http://${APIOrigin}/game/balanceFeed`;

const feedingCenter = new FeedingCenter();
const router = new Router();
const headerHandler = newHeaderHandler();

let login = false;
let token = "";

chrome.storage.sync.get({token: ""}, (result) => {
    token = result.token;
});

headerHandler.handlers.push({
    name: "Origin", callback: (header) => {
        header.value = `http://${Origin}`;
    }
});

headerHandler.handlers.push({
    name: "accessToken",
    callback: header => {
        if (header.value !== "") {
            token = header.value;
            chrome.storage.sync.set({token: token});
        }
    }
});

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
        if (token === "") {
            console.log("token 为空");
            return
        }
        chrome.tabs.query({active: true}, tabs => {
            const tab = tabs[0];
            if (!login) {
                chrome.tabs.sendMessage(tab.id, {
                    path: ALERT,
                    alert: "需要加入白名单"
                });
                return
            }
            let path = null;
            if (tab.url === `http://${Origin}/home`) {
                path = HOME;
            } else if (tab.url.indexOf(`http://${Origin}/market`) !== -1) {
                path = MARKET;
            } else {
                return
            }
            chrome.storage.sync.get({
                "mode": VALUE,
                "min": 0.1,
                "kg": false,
                "coin": 0
            }, result => {
                if (result.coin === 0 || result.coin === "") {
                    chrome.tabs.sendMessage(tab.id, {
                        path: ALERT,
                        alert: "请填写单次玩客币数量"
                    });
                    return
                }
                result.path = path;
                chrome.tabs.sendMessage(tab.id, result);
            })
        });
        return true;
    },
    {urls: [`http://${APIOrigin}/*`]}
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
                method: 'post',
                data: qs.stringify({
                    coin: coin,
                    monkeyId: monkeyID
                }),
                headers: {
                    'Accept': "application/json, text/plain, */*",
                    'accessToken': token,
                    [`${action(ADD)}Referer`]: `http://${Origin}/monkey/${monkeyID}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then((response) => {
                console.log(response)
            });
            await sleep();
            feeding = feedings.shift();
        }
    }
};

chrome.webRequest.onBeforeSendHeaders.addListener(details => {
    return {requestHeaders: headerHandler.build(details.requestHeaders)};
}, {urls: [`http://${APIOrigin}/*`]}, ["blocking", "requestHeaders"]);

const LoginLoop = () => {
    if (token === "") {
        console.log("token 为空");
        return
    }
    let otc = "";
    Axios({
        url: `http://${APIOrigin}/game/myCenter`,
        headers: {
            accessToken: token,
            [`${action(ADD)}X-Requested-With`]: 'XMLHttpRequest',
            [`${action(ADD)}Referer`]: `http://${Origin}/mine`
        }
    }).then(response => {
        let data = response.data;
        if (data.msg !== "操作成功") {
            return
        }
        otc = data.result.otc;
        return whiteList()
    }).then(response => {
        let data = response.data;
        login = data.indexOf(otc) !== -1;
    });
};

// 检查是否在白名单
setInterval(LoginLoop, 15000);
// 检查是否登陆
setTimeout(TransactionLoop, 0);
setTimeout(LoginLoop, 0);