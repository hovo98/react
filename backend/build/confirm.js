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
const common = require("./common");
const db = require("./db");
const Web3 = require("web3");
const abiDecoderBsc = require('abi-decoder'); // NodeJS
abiDecoderBsc.addABI(common.LIMIT_ABI[common.ChainId.BSC]);
const abiDecoder = {
    [common.ChainId.BSC]: abiDecoderBsc,
};
const typesArray = [
    { type: 'uint256', name: 'orderid' }
];
const checkConfirmAlls = () => {
    try {
        const trans = db.get_records("SELECT * FROM positions where trstatus='pending'");
        trans.map((tr) => __awaiter(void 0, void 0, void 0, function* () {
            const hash = tr.transactionid;
            const web3 = new Web3(new Web3.providers.HttpProvider(common.web3url[tr.chainid]));
            const transaction = yield web3.eth.getTransaction(hash);
            if (!transaction) {
                console.log('wrong transaction', hash);
                db.update_record("positions", tr.id, { "trstatus": "wrong" });
                return;
            }
            if (transaction.blockHash) { //confirm
                let timestamp = new Date();
                timestamp = timestamp.toISOString().replace('T', ' ').replace('Z', '').slice(0, 19);
                if (tr.ordertype.indexOf("market") >= 0) { //market order
                    db.update_record("positions", tr.id, { "trstatus": "confirm", "timestamp": timestamp });
                }
                else { //limit order
                    let indexid = 2;
                    if (tr.chainid == 137)
                        indexid = 1;
                    const transactionDetail = yield web3.eth.getTransactionReceipt(hash);
                    let decodedParameters;
                    transactionDetail.logs.forEach((log) => {
                        if (log.topics && log.topics.length == 1) {
                            decodedParameters = web3.eth.abi.decodeParameters(typesArray, log.data);
                        }
                    });
                    //const decodedParameters = web3.eth.abi.decodeParameters(typesArray, transactionDetail.logs[indexid].data);
                    const orderid = decodedParameters.orderid;
                    if (tr.ordertype.indexOf("stop") >= 0) {
                        db.update_record("positions", tr.id, { "trstatus": "confirm", "orderid": orderid, "orderstatus": "pending", "timestamp": timestamp });
                    }
                    else {
                        db.update_record("positions", tr.id, { "trstatus": "confirm", "orderid": orderid, "orderstatus": "open", "timestamp": timestamp });
                    }
                }
            }
        }));
    }
    catch (e) {
        console.log(e);
    }
    setTimeout(checkConfirmAlls, 3000);
};
module.exports = {
    checkConfirmAlls
};
