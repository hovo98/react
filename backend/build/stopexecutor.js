"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const db = require("./db");
const { getTokenprice_ethmatic } = require("./getprice");
const monitorStopPrice = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        db.init_mysql();
        const pendings = db.get_records("SELECT * FROM positions where trstatus='confirm' and orderstatus='pending' ");
        pendings.map((pending) => __awaiter(void 0, void 0, void 0, function* () {
            const price = yield getTokenprice_ethmatic(pending.chainid, pending.token);
            const ordertype = pending.ordertype;
            console.log(pending.tokenname, 'price=', price);
            if (price > 0) {
                if (ordertype == "stoplimit_buy" && price > pending.stopprice ||
                    ordertype == "stoplimit_sell" && price < pending.stopprice) { //trigger
                    db.update_record("positions", pending.id, { "orderstatus": "open" });
                }
            }
        }));
    }
    catch (e) {
        console.log(e.message);
    }
    setTimeout(monitorStopPrice, 10000);
});
module.exports = {
    monitorStopPrice
};
