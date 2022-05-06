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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Token = void 0;
var ws_1 = require("ws");
var V2FACTORY_1 = require("./abi/V2FACTORY");
var V2POOL_1 = require("./abi/V2POOL");
var ERC20_1 = require("./abi/ERC20");
var ethers_1 = require("ethers");
var tokens_1 = require("./config/tokens");
var Token = /** @class */ (function () {
    function Token(address, tokenInfo, socketHandle, provider) {
        var _this = this;
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
        var self = this;
        if (this.listed) {
            var ws = new ws_1["default"]('wss://stream.binance.com:9443/ws/' + this.bsc_symbol + '@depth20');
            ws.on('message', function incoming(data) {
                var orderbook = JSON.parse(data);
                self.orderbook = orderbook;
                //console.log(orderbook);
                if (socketHandle) {
                    socketHandle.to(tokenInfo.symbol).emit("orderbook", orderbook);
                }
            });
            var ws_trade = new ws_1["default"]('wss://stream.binance.com:9443/ws/' + this.bsc_symbol + '@trade');
            ws_trade.on('message', function incoming(data) {
                var trade = JSON.parse(data);
                var trdata = { amount: trade.q, price: self.fixedLength(Number(trade.p)), time: trade.T, isbuy: trade.m == false };
                self.sendTransaction(trdata);
                //console.log(trade);
                // if(socketHandle){
                //   socketHandle.to(tokenInfo.symbol).emit("trade",trade);
                // }
            });
        }
        else { //transaction history on chain
            //get pair
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var erc20, _a, factory, pooladdress, pool_contract, eventFilter, events, i, params, event_1, block, filter;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            erc20 = new ethers_1.Contract(this.address, ERC20_1.ERC20_ABI, provider);
                            _a = this;
                            return [4 /*yield*/, erc20.functions.decimals()];
                        case 1:
                            _a.decimals = (_b.sent())[0];
                            factory = new ethers_1.Contract(tokens_1.pancakeswapV2Factory, V2FACTORY_1.V2FACTORY_ABI, provider);
                            return [4 /*yield*/, factory.functions.getPair(address, tokens_1.wbnb.address)];
                        case 2:
                            pooladdress = _b.sent();
                            pool_contract = new ethers_1.Contract(pooladdress[0], V2POOL_1.V2POOL_ABI, provider);
                            eventFilter = pool_contract.filters.Swap();
                            return [4 /*yield*/, pool_contract.queryFilter(eventFilter, -50, "latest")]; //not working if I specify blocks
                        case 3:
                            events = _b.sent() //not working if I specify blocks
                            ;
                            i = 0;
                            _b.label = 4;
                        case 4:
                            if (!(i < events.length)) return [3 /*break*/, 8];
                            params = events[i];
                            event_1 = params.args;
                            return [4 /*yield*/, params.getBlock()];
                        case 5:
                            block = _b.sent();
                            return [4 /*yield*/, this.addTransaction({ timestamp: block.timestamp * 1000, transactionHash: params.transactionHash, sender: event_1.sender, amount0In: event_1.amount0In, amount1In: event_1.amount1In, amount0Out: event_1.amount0Out, amount1Out: event_1.amount1Out, to: event_1.to })];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7:
                            i++;
                            return [3 /*break*/, 4];
                        case 8:
                            filter = pool_contract.filters.Swap();
                            pool_contract.on(filter, function () {
                                var params = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    params[_i] = arguments[_i];
                                }
                                return __awaiter(_this, void 0, void 0, function () {
                                    var event, timestamp, e_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                event = params.args;
                                                if (!event)
                                                    return [2 /*return*/];
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 3, , 4]);
                                                timestamp = Date.now();
                                                return [4 /*yield*/, this.addTransaction({ timestamp: timestamp, transactionHash: params.transactionHash,
                                                        sender: event.sender,
                                                        amount0In: event.amount0In,
                                                        amount1In: event.amount1In,
                                                        amount0Out: event.amount0Out,
                                                        amount1Out: event.amount1Out,
                                                        to: event.to })];
                                            case 2:
                                                _a.sent();
                                                return [3 /*break*/, 4];
                                            case 3:
                                                e_1 = _a.sent();
                                                console.log(e_1);
                                                return [3 /*break*/, 4];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                            return [2 /*return*/];
                    }
                });
            }); }, 100);
        }
    }
    Token.prototype.fixedLength = function (y) {
        var num = y;
        var prec = 6;
        while (num > 10) {
            num /= 10;
            prec--;
        }
        return y.toFixed(prec);
    };
    Token.prototype.sendTransaction = function (data) {
        this.transantions.push(data);
        if (this.transantions.length > tokens_1.limit_transaction) {
            this.transantions.shift();
        }
        if (this.socketHandle) {
            this.socketHandle.to(this.symbol).emit("transactions", this.transantions);
        }
    };
    Token.prototype.addTransaction = function (tr) {
        return __awaiter(this, void 0, void 0, function () {
            var is0, amount0, amount1, amount, price, price_decimal, time, isbuy, data;
            return __generator(this, function (_a) {
                is0 = tokens_1.wbnb.address.toLowerCase() > this.address.toLowerCase();
                amount0 = (Number(tr.amount0In) > 0 ? Number(tr.amount0In) : Number(tr.amount0Out));
                amount1 = (Number(tr.amount1In) > 0 ? Number(tr.amount1In) : Number(tr.amount1Out));
                amount = ((is0 ? amount0 : amount1) / Math.pow(10, this.decimals)).toFixed(Math.min(6, this.decimals));
                price = is0 ? (amount1 / amount0) : (amount0 / amount1);
                price_decimal = this.fixedLength(price / Math.pow(10, tokens_1.wbnb.decimals - this.decimals));
                time = tr.timestamp;
                isbuy = is0 ? (Number(tr.amount0In) > 0 ? true : false) : (Number(tr.amount1In) > 0 ? true : false);
                data = { hash: tr.transactionHash, amount: amount, price: price_decimal, time: time, isbuy: isbuy };
                this.sendTransaction(data);
                return [2 /*return*/];
            });
        });
    };
    return Token;
}());
exports.Token = Token;
// const provider =new providers.StaticJsonRpcProvider("https://bsc.getblock.io/mainnet/?api_key=2beae857-cbee-479d-852e-9a4d000e65a0");
// const mytoken = new Token("0x2170ed0880ac9a755fd29b2688956bd959f933f8",{"symbol":"ETH","listed":true,"base":"BNB","quote":"ETH"},null,provider);
