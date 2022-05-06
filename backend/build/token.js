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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const ws_1 = __importDefault(require("ws"));
const V2FACTORY_1 = require("./abi/V2FACTORY");
const V2POOL_1 = require("./abi/V2POOL");
const ERC20_1 = require("./abi/ERC20");
const ethers_1 = require("ethers");
const tokens_1 = require("./config/tokens");
class Token {
    constructor(address, tokenInfo, socketHandle, provider) {
        this.address = address;
        this.symbol = tokenInfo.symbol;
        this.listed = tokenInfo.listed;
        this.base = tokenInfo.base;
        this.quote = tokenInfo.quote;
        this.socketHandle = socketHandle;
        this.bsc_symbol = tokenInfo.base + tokenInfo.quote;
        this.bsc_symbol = this.bsc_symbol.toLowerCase();
        this.decimals = 0;
        this.transantions = [];
        this.orderbook = undefined;
        const self = this;
        if (this.listed) {
            const ws = new ws_1.default('wss://stream.binance.com:9443/ws/' + this.bsc_symbol + '@depth20');
            ws.on('message', function incoming(data) {
                const orderbook = JSON.parse(data);
                self.orderbook = orderbook;
                //console.log(orderbook);
                if (socketHandle) {
                    socketHandle.to(tokenInfo.symbol).emit("orderbook", orderbook);
                }
            });
            const ws_trade = new ws_1.default('wss://stream.binance.com:9443/ws/' + this.bsc_symbol + '@trade');
            ws_trade.on('message', function incoming(data) {
                const trade = JSON.parse(data);
                const trdata = { amount: trade.q, price: self.fixedLength(Number(trade.p)), time: trade.T, isbuy: trade.m == false };
                self.sendTransaction(trdata);
                //console.log(trade);
                // if(socketHandle){
                //   socketHandle.to(tokenInfo.symbol).emit("trade",trade);
                // }
            });
        }
        else { //transaction history on chain
            //get pair
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const erc20 = new ethers_1.Contract(this.address, ERC20_1.ERC20_ABI, provider);
                this.decimals = (yield erc20.functions.decimals())[0];
                const factory = new ethers_1.Contract(tokens_1.pancakeswapV2Factory, V2FACTORY_1.V2FACTORY_ABI, provider);
                const pooladdress = yield factory.functions.getPair(address, tokens_1.wbnb.address);
                const pool_contract = new ethers_1.Contract(pooladdress[0], V2POOL_1.V2POOL_ABI, provider);
                let eventFilter = pool_contract.filters.Swap();
                let events = yield pool_contract.queryFilter(eventFilter, -50, "latest"); //not working if I specify blocks
                for (let i = 0; i < events.length; i++) {
                    const params = events[i];
                    const event = params.args;
                    const block = yield params.getBlock();
                    yield this.addTransaction({ timestamp: block.timestamp * 1000, transactionHash: params.transactionHash, sender: event.sender, amount0In: event.amount0In, amount1In: event.amount1In, amount0Out: event.amount0Out, amount1Out: event.amount1Out, to: event.to });
                }
                const filter = pool_contract.filters.Swap();
                pool_contract.on(filter, (...params) => __awaiter(this, void 0, void 0, function* () {
                    const event = params.args;
                    if (!event)
                        return;
                    try {
                        const timestamp = Date.now();
                        yield this.addTransaction({ timestamp,
                            transactionHash: params.transactionHash,
                            sender: event.sender,
                            amount0In: event.amount0In,
                            amount1In: event.amount1In,
                            amount0Out: event.amount0Out,
                            amount1Out: event.amount1Out,
                            to: event.to
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                }));
            }), 100);
        }
    }
    fixedLength(y) {
        let num = y;
        let prec = 6;
        while (num > 10) {
            num /= 10;
            prec--;
        }
        return y.toFixed(prec);
    }
    sendTransaction(data) {
        this.transantions.push(data);
        if (this.transantions.length > tokens_1.limit_transaction) {
            this.transantions.shift();
        }
        if (this.socketHandle) {
            this.socketHandle.to(this.symbol).emit("transactions", this.transantions);
        }
    }
    addTransaction(tr) {
        return __awaiter(this, void 0, void 0, function* () {
            const is0 = tokens_1.wbnb.address.toLowerCase() > this.address.toLowerCase();
            const amount0 = (Number(tr.amount0In) > 0 ? Number(tr.amount0In) : Number(tr.amount0Out));
            const amount1 = (Number(tr.amount1In) > 0 ? Number(tr.amount1In) : Number(tr.amount1Out));
            const amount = ((is0 ? amount0 : amount1) / Math.pow(10, this.decimals)).toFixed(Math.min(6, this.decimals));
            const price = is0 ? (amount1 / amount0) : (amount0 / amount1);
            const price_decimal = this.fixedLength(price / Math.pow(10, tokens_1.wbnb.decimals - this.decimals));
            const time = tr.timestamp;
            const isbuy = is0 ? (Number(tr.amount0In) > 0 ? true : false) : (Number(tr.amount1In) > 0 ? true : false);
            const data = { hash: tr.transactionHash, amount, price: price_decimal, time, isbuy };
            this.sendTransaction(data);
        });
    }
}
exports.Token = Token;
// const provider =new providers.StaticJsonRpcProvider("https://bsc.getblock.io/mainnet/?api_key=2beae857-cbee-479d-852e-9a4d000e65a0");
// const mytoken = new Token("0x2170ed0880ac9a755fd29b2688956bd959f933f8",{"symbol":"ETH","listed":true,"base":"BNB","quote":"ETH"},null,provider);
