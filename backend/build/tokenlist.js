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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokens = void 0;
const token_1 = require("./token");
const tokens_1 = require("./config/tokens");
const getTokens_1 = require("./tokens/getTokens");
class Tokens {
    constructor(socket_handler, provider) {
        this.items = [];
        Object.keys(tokens_1.tokenList).forEach((address) => {
            const token = new token_1.Token(address, tokens_1.tokenList[address], socket_handler, provider);
            this.items.push(token);
        });
        const self = this;
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            let data = yield (0, getTokens_1.fetchTokenData)();
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
                    let emptytokens = [];
                    Object.keys(tokens_1.tokenList).forEach((address) => {
                        const tk = tokens_1.tokenList[address];
                        emptytokens.push({
                            exists: true,
                            address,
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
                    self.pairs24h = emptytokens;
                    if (socket_handler) {
                        socket_handler.to("pairs24h").emit("data", emptytokens);
                    }
                    else {
                        console.log(emptytokens);
                    }
                }
            }
        }), 10000);
        //24hours handle
    }
}
exports.Tokens = Tokens;
// const mytoken = new Tokens(null);
