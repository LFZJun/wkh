import {Router} from './router.ts';
import {HOME, MARKET, FULL, TRANSACTION, VALUE, ALERT} from './consts.ts';

const MONKEYS = "monkeys";
const ITEM = "item";

console.log("注入页面");
let confirmed = false;

const router = new Router();
router.use(ctx => {
    console.log("页面发生变化");
    ctx.next();
});

router.handle(ALERT, ctx => {
    return new Promise((resolve) => {
        alert(ctx.request.alert);
        resolve();
    });
});

router.handle(HOME, ctx => {
    return new Promise((resolve) => {
        $("div").forEach(element => {
            let element$ = $(element);

            if (element$.hasClass(MONKEYS)) {
                // 掘金分数
                element$.find(".panel").forEach(monkey => {
                    let elementMonkey = $(monkey);
                    ShowScore(elementMonkey);
                    let btns = [];

                    btns.push({
                        button: $('<button style="margin:1px;border-color:red;">喂饱</button>'),
                        mode: FULL
                    });
                    let percent = elementMonkey.find(".percent").first().text();
                    let doFeed = function (self, mode) {
                        let promptInfo = `请确定每次 ${ctx.request.coin} 喂到饱`;
                        if (!confirmed) {
                            if (!confirm(promptInfo)) {
                                return
                            }
                            confirmed = true
                        }
                        btns.forEach(btn => {
                            btn.button.hide()
                        });
                        chrome.runtime.sendMessage({
                            path: TRANSACTION,
                            id: elementMonkey.find(".id").first().text().split(' ')[1],
                            feeding: Number(percent.split('/')[0]),
                            limit: Number(percent.split('/')[1]),
                            mode: mode,
                        }, function (response) {
                            console.log(response);
                        });
                    };
                    btns.forEach(btn => {
                        btn.button.click(function () {
                            doFeed($(this), btn.mode);
                        });
                    });
                    if (elementMonkey.find("button").length === 0) {
                        btns.forEach(btn => {
                            elementMonkey.append(btn.button);
                        });
                    }
                })
            }
        });
        resolve();
    });
});


//market
router.handle(MARKET, ctx => {
    return new Promise((resolve) => {
        $("div").forEach(element => {
            let element$ = $(element);

            if (element$.hasClass(ITEM)) {
                let info = $(element$.find(".info")).text();
                let priceDiv = element$.find(".price span").first();
                let price = $(element$.find(".price span").get(0)).text();
                let gen = element$.find(".gen").text().replace("代", "");
                if (!info || !priceDiv || !price || !gen) {
                    return
                }
                let valueAndWeight = info.split('·');
                let values = valueAndWeight[0].split('/');
                let digValue = values[1];
                if (values.length === 3) {
                    digValue = values[2];
                }
                let weight = valueAndWeight[1].replace("kg", "");
                let wkc = price.split(' ')[0];
                let span = $(element$.find(".price").find(".price span").get(0));
                if (span.text().indexOf(";") !== -1) {
                    wkc = span.text().split(';')[0]
                }
                let request = ctx.request;
                let mark = Number(digValue) * (request.kg === "true" ? Number(weight) : 1) / GenerationFactor(gen);
                let showMark = request.mode === VALUE ? mark : mark / Number(wkc);
                span.text(`${wkc} 掘金价值:${(showMark).toFixed(5)}`);
                if (showMark >= request.min) {
                    element$.prop("style", "background:rgb(201,199,157);")
                }
            }
        });
        resolve();
    });
});

router.run();

const ShowScore = function (element$) {
    const lis = element$.find(".minfo li");
    if (lis.length === 0) {
        return
    }
    const rowOne = $(lis[0]);
    const showPosition = rowOne.text();
    if (showPosition.indexOf("掘金分数") !== -1) {
        return
    }
    let words = /(\d+) .*?([\d.]+)/.exec(showPosition);
    if (words === null) {
        console.log("匹配不到 代数 和 体重");
        return
    }
    const ps = element$.find(".info");
    if (ps.length < 1) {
        console.log("找不到猴子 属性");
        return
    }
    const params = ps.text().split("/");
    if (params.length < 2) {
        console.log("猴子属性拆分错误");
        return
    }
    const percents = element$.find(".percent").text().split("/");
    if (percents.length < 2) {
        console.log("找不到投食进度");
        return
    }
    const weight = words[2];
    const generation = words[1];
    const digValue = params[1];
    const feeding = percents[0];
    const score = Number(weight) * Number(digValue) * Number(feeding) / GenerationFactor(generation);
    rowOne.text(`${showPosition} 掘金分数${score === 0 ? 0 : score.toFixed(5)}`);
};

const GenerationFactor = (() => {
    const generationFactorDict = {};
    return (n) => {
        if (generationFactorDict[n] === undefined) {
            generationFactorDict[n] = 1.168 ** Number(n)
        }
        return generationFactorDict[n];
    }
})();