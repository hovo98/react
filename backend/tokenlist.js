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
exports.Tokens = void 0;
var token_1 = require("./token");
var tokens_1 = require("./config/tokens");
var getTokens_1 = require("./tokens/getTokens");
var Tokens = /** @class */ (function () {
    function Tokens(socket_handler, provider) {
        var _this = this;
        this.items = [];
        Object.keys(tokens_1.tokenList).forEach(function (address) {
            var token = new token_1.Token(address, tokens_1.tokenList[address], socket_handler, provider);
            _this.items.push(token);
        });
        var self = this;
        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var data, emptytokens_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, getTokens_1.fetchTokenData)()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            self.pairs24h = data;
                            if (socket_handler) {
                                socket_handler.to("pairs24h").emit("data", data);
                            }
                            else {
                                console.log(data);
                            }
                        }
                        else {
                            console.log('1');
                            if (!(self.pairs24h)) {
                                console.log('set default data');
                                emptytokens_1 = [];
                                Object.keys(tokens_1.tokenList).forEach(function (address) {
                                    var tk = tokens_1.tokenList[address];
                                    emptytokens_1.push({
                                        exists: true,
                                        address: address,
                                        name: tk.symbol,
                                        symbol: tk.symbol,
                                        volumeUSD: 0,
                                        volumeUSDChange: 0,
                                        volumeUSDWeek: 0,
                                        txCount: 0,
                                        liquidityUSD: 0,
                                        liquidityUSDChange: 0,
                                        liquidityToken: 0,
                                        priceBNB: 0,
                                        priceBNBChange: 0,
                                        priceBNBChangeWeek: 0,
                                        priceUSD: 0,
                                        info: tk
                                    });
                                });
                                self.pairs24h = emptytokens_1;
                                if (socket_handler) {
                                    socket_handler.to("pairs24h").emit("data", emptytokens_1);
                                }
                                else {
                                    console.log(emptytokens_1);
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 10000);
        //24hours handle
    }
    return Tokens;
}());
exports.Tokens = Tokens;
// const mytoken = new Tokens(null);
