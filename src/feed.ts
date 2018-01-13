export class FeedingCenter {
    monkeys: { [monkeyID: string]: Feedings };

    constructor(monkeys: { [p: string]: Feedings } = {}) {
        this.monkeys = monkeys;
    }

    fullyFeeds(monkeyID: string, feeding: number, limit: number, coin: string): number {
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

    back(): Feedings | undefined {
        let monkeyIDs = Object.keys(this.monkeys);
        for (let monkeyID of monkeyIDs) {
            let feeding = this.monkeys[monkeyID];
            if (feeding.isEmpty()) {
                delete this.monkeys[monkeyID];
                continue
            }
            return feeding;
        }
        return undefined;
    }
}

export class Feedings {
    monkeyID: string;
    currentFeedings: number;
    feedings: number;
    limitFeedings: number;
    taskQueue: Feeding[];


    constructor(monkeyID: string, currentFeedings: number, limitFeedings: number) {
        this.monkeyID = monkeyID;
        this.currentFeedings = currentFeedings;
        this.limitFeedings = limitFeedings;

        this.feedings = currentFeedings;
        this.taskQueue = [];
    }

    push(feeding: Feeding): boolean {
        let coin = Number(feeding.coin);
        if (this.feedings + coin > this.limitFeedings) {
            return false
        }
        this.feedings += coin;
        this.taskQueue.push(feeding);
        return true;
    }

    shift(): Feeding | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        let feeding = this.taskQueue.shift();
        this.currentFeedings += Number(feeding.coin);
        return feeding;
    }

    back(): Feeding | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.taskQueue[0];
    }

    isEmpty(): boolean {
        return this.taskQueue.length == 0;
    }
}

export class Feeding {
    coin: string;

    constructor(coin: string) {
        this.coin = coin;
    }
}
