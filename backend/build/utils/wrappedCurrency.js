"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@pancakeswap/sdk");
function wrappedCurrency(currency, chainId) {
    return chainId && currency === sdk_1.ETHER ? sdk_1.WETH[chainId] : currency instanceof sdk_1.Token ? currency : undefined;
}
exports.wrappedCurrency = wrappedCurrency;
function wrappedCurrencyAmount(currencyAmount, chainId) {
    const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined;
    return token && currencyAmount ? new sdk_1.TokenAmount(token, currencyAmount.raw) : undefined;
}
exports.wrappedCurrencyAmount = wrappedCurrencyAmount;
function unwrappedToken(token) {
    if (token.equals(sdk_1.WETH[token.chainId]))
        return sdk_1.ETHER;
    return token;
}
exports.unwrappedToken = unwrappedToken;
