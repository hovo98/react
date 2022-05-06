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
const gql = require('graphql-tag');
var dayjs = require('dayjs');
const Web3 = require("web3");
const axios = require('axios');
const apiKey = 'BQYvhnv04csZHaprIBZNwtpRiDIwEIW9'; // replace this with your API Key
const GET_PRICE = (chainid, tokenAddress, mode) => {
    let chainnet, quoteCurrency, exchange;
    basecurrency = tokenAddress;
    if (chainid == 1) { //mainnet
        chainnet = "ethereum";
        quoteCurrency = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
        basecurrency = tokenAddress;
        exchange = "Uniswap";
    }
    else if (chainid == 56) { //binance
        console.log('check binance');
        chainnet = "bsc";
        quoteCurrency = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
        exchange = "Pancake";
        basecurrency = tokenAddress;
    }
    else { //polygon
        chainnet = "matic";
        quoteCurrency = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
        exchange = "QuickSwap";
        basecurrency = tokenAddress;
    }
    const query_init = `
    {
      ethereum(network: ${chainnet}) {
        dexTrades(
          baseCurrency: {is: "${basecurrency}"}
          quoteCurrency: {is: "${quoteCurrency}"}
          options: {desc: ["block.height", "transaction.index"], limit: 1}
        ) {
          block {
            height
            timestamp {
              time(format: "%Y-%m-%d %H:%M:%S")
            }
          }
          transaction {
            index
          }
          baseCurrency {
            symbol
          }
          quoteCurrency {
            symbol
          }
          quotePrice
        }
      }
    }
    
    `;
    const query = { "query": query_init, "variables": "{}" };
    return (query);
};
function getTokenprice_ethmatic(chianId, address) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        let priceResult = -1;
        try {
            result = yield axios.post('https://graphql.bitquery.io/', GET_PRICE(chianId, address, 1), { headers: { "X-API-KEY": apiKey } });
            price = ((_d = (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.ethereum) === null || _c === void 0 ? void 0 : _c.dexTrades) === null || _d === void 0 ? void 0 : _d.length) == 0 ? -1 : parseFloat((_f = (_e = result.data) === null || _e === void 0 ? void 0 : _e.data.ethereum) === null || _f === void 0 ? void 0 : _f.dexTrades[0].quotePrice);
            priceResult = price;
        }
        catch (e) {
            console.log(e.message);
        }
        console.log('price=', priceResult);
        return (priceResult);
    });
}
module.exports = {
    getTokenprice_ethmatic
};
