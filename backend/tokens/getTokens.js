"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.fetchTokenData = void 0;
var graphql_request_1 = require("graphql-request");
var endpoints_1 = require("../config/endpoints");
var infoQueryHelpers_1 = require("../utils/infoQueryHelpers");
var getBlocksFromTimestamps_1 = require("../utils/getBlocksFromTimestamps");
var bnbprices_1 = require("../utils/bnbprices");
var infoDataHelpers_1 = require("../utils/infoDataHelpers");
var tokens_1 = require("../config/tokens");
/**
 * Main token data to display on Token page
 */
var TOKEN_AT_BLOCK = function (block, tokens) {
    var addressesString = "[\"".concat(tokens.join('","'), "\"]");
    var blockString = block ? "block: {number: ".concat(block, "}") : "";
    return "tokens(\n      where: {id_in: ".concat(addressesString, "}\n      ").concat(blockString, "\n      orderBy: tradeVolumeUSD\n      orderDirection: desc\n    ) {\n      id\n      symbol\n      name\n      derivedBNB\n      derivedUSD\n      tradeVolumeUSD\n      totalTransactions\n      totalLiquidity\n    }\n  ");
};
var _fetchTokenData = function (block24h, block48h, block7d, block14d, tokenAddresses) { return __awaiter(void 0, void 0, void 0, function () {
    var query, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = (0, graphql_request_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query tokens {\n        now: ", "\n        oneDayAgo: ", "\n        twoDaysAgo: ", "\n        oneWeekAgo: ", "\n        twoWeeksAgo: ", "\n      }\n    "], ["\n      query tokens {\n        now: ", "\n        oneDayAgo: ", "\n        twoDaysAgo: ", "\n        oneWeekAgo: ", "\n        twoWeeksAgo: ", "\n      }\n    "])), TOKEN_AT_BLOCK(null, tokenAddresses), TOKEN_AT_BLOCK(block24h, tokenAddresses), TOKEN_AT_BLOCK(block48h, tokenAddresses), TOKEN_AT_BLOCK(block7d, tokenAddresses), TOKEN_AT_BLOCK(block14d, tokenAddresses));
                return [4 /*yield*/, (0, graphql_request_1.request)(endpoints_1.INFO_CLIENT, query)];
            case 1:
                data = _a.sent();
                return [2 /*return*/, { data: data, error: false }];
            case 2:
                error_1 = _a.sent();
                console.error('Failed to fetch token data', error_1);
                return [2 /*return*/, { erro: true }];
            case 3: return [2 /*return*/];
        }
    });
}); };
var fixedLength = function (y) {
    var num = y;
    var prec = 6;
    while (num > 10) {
        num /= 10;
        prec--;
    }
    return y.toFixed(prec);
};
// Transforms tokens into "0xADDRESS: { ...TokenFields }" format and cast strigns to numbers
var parseTokenData = function (tokens) {
    if (!tokens) {
        return {};
    }
    return tokens.reduce(function (accum, tokenData) {
        var derivedBNB = tokenData.derivedBNB, derivedUSD = tokenData.derivedUSD, tradeVolumeUSD = tokenData.tradeVolumeUSD, totalTransactions = tokenData.totalTransactions, totalLiquidity = tokenData.totalLiquidity;
        accum[tokenData.id] = __assign(__assign({}, tokenData), { derivedBNB: parseFloat(derivedBNB), derivedUSD: parseFloat(derivedUSD), tradeVolumeUSD: parseFloat(tradeVolumeUSD), totalTransactions: parseFloat(totalTransactions), totalLiquidity: parseFloat(totalLiquidity) });
        return accum;
    }, {});
};
var fetchTokenData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, t24h, t48h, t7d, t14d, result, _b, block24h, block48h, block7d, block14d, tokenAddresses, _c, error, data, _d, bnbPrices_1, fetchError, parsed_1, parsed24_1, parsed48_1, parsed7d_1, parsed14d_1, formatted, e_1;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 4, , 5]);
                _a = (0, infoQueryHelpers_1.getDeltaTimestamps)(), t24h = _a[0], t48h = _a[1], t7d = _a[2], t14d = _a[3];
                return [4 /*yield*/, (0, getBlocksFromTimestamps_1.getBlocksFromTimestamps)([t24h, t48h, t7d, t14d])];
            case 1:
                result = _e.sent();
                _b = result !== null && result !== void 0 ? result : [], block24h = _b[0], block48h = _b[1], block7d = _b[2], block14d = _b[3];
                tokenAddresses = Object.keys(tokens_1.tokenList);
                return [4 /*yield*/, _fetchTokenData(block24h.number, block48h.number, block7d.number, block14d.number, tokenAddresses)];
            case 2:
                _c = _e.sent(), error = _c.error, data = _c.data;
                if (error) {
                    return [2 /*return*/, undefined];
                }
                return [4 /*yield*/, (0, bnbprices_1.fetchBnbPrices)(block24h.number, block48h.number, block7d.number)];
            case 3:
                _d = _e.sent(), bnbPrices_1 = _d.bnbPrices, fetchError = _d.error;
                if (fetchError) {
                    return [2 /*return*/, undefined];
                }
                else {
                    parsed_1 = parseTokenData(data === null || data === void 0 ? void 0 : data.now);
                    parsed24_1 = parseTokenData(data === null || data === void 0 ? void 0 : data.oneDayAgo);
                    parsed48_1 = parseTokenData(data === null || data === void 0 ? void 0 : data.twoDaysAgo);
                    parsed7d_1 = parseTokenData(data === null || data === void 0 ? void 0 : data.oneWeekAgo);
                    parsed14d_1 = parseTokenData(data === null || data === void 0 ? void 0 : data.twoWeeksAgo);
                    formatted = tokenAddresses.map(function (address) {
                        var current = parsed_1[address];
                        var oneDay = parsed24_1[address];
                        var twoDays = parsed48_1[address];
                        var week = parsed7d_1[address];
                        var twoWeeks = parsed14d_1[address];
                        var _a = (0, infoDataHelpers_1.getChangeForPeriod)(current === null || current === void 0 ? void 0 : current.tradeVolumeUSD, oneDay === null || oneDay === void 0 ? void 0 : oneDay.tradeVolumeUSD, twoDays === null || twoDays === void 0 ? void 0 : twoDays.tradeVolumeUSD), volumeUSD = _a[0], volumeUSDChange = _a[1];
                        var volumeUSDWeek = (0, infoDataHelpers_1.getChangeForPeriod)(current === null || current === void 0 ? void 0 : current.tradeVolumeUSD, week === null || week === void 0 ? void 0 : week.tradeVolumeUSD, twoWeeks === null || twoWeeks === void 0 ? void 0 : twoWeeks.tradeVolumeUSD)[0];
                        var liquidityUSD = current ? current.totalLiquidity * current.derivedUSD : 0;
                        var liquidityUSDOneDayAgo = oneDay ? oneDay.totalLiquidity * oneDay.derivedUSD : 0;
                        var liquidityUSDChange = (0, infoDataHelpers_1.getPercentChange)(liquidityUSD, liquidityUSDOneDayAgo);
                        // Prices of tokens for now, 24h ago and 7d ago
                        var reversed = tokens_1.tokenList[address].quote != "BNB";
                        var priceUSD = current ? (reversed == false ? current.derivedBNB * (bnbPrices_1 ? bnbPrices_1.current : 0) : (bnbPrices_1 ? bnbPrices_1.current : 0)) : 0;
                        var priceBNB = current ? (reversed == false ? current.derivedBNB : 1 / current.derivedBNB) : 0;
                        var liquidityToken = current ? current.totalLiquidity : 0;
                        var liquidityBNB = priceBNB > 0 ? liquidityToken * current.derivedBNB : 0;
                        var priceBNBOneDay = oneDay ? (reversed == false ? oneDay.derivedBNB : 1 / oneDay.derivedBNB) : 0;
                        var priceBNBWeek = week ? (reversed == false ? week.derivedBNB : 1 / week.derivedBNB) : 0;
                        var priceBNBChange = (0, infoDataHelpers_1.getPercentChange)(priceBNB, priceBNBOneDay);
                        var priceBNBChangeWeek = (0, infoDataHelpers_1.getPercentChange)(priceBNB, priceBNBWeek);
                        var txCount = (0, infoDataHelpers_1.getAmountChange)(current === null || current === void 0 ? void 0 : current.totalTransactions, oneDay === null || oneDay === void 0 ? void 0 : oneDay.totalTransactions);
                        var data = {
                            exists: !!current,
                            address: address,
                            name: current ? current.name : '',
                            symbol: tokens_1.tokenList[address].symbol,
                            volumeUSD: volumeUSD,
                            volumeUSDChange: volumeUSDChange,
                            volumeUSDWeek: volumeUSDWeek,
                            txCount: txCount,
                            liquidityUSD: liquidityUSD,
                            liquidityUSDChange: liquidityUSDChange,
                            liquidityToken: liquidityToken,
                            liquidityBNB: liquidityBNB,
                            priceBNB: fixedLength(priceBNB),
                            priceBNBChange: priceBNBChange,
                            priceBNBChangeWeek: priceBNBChangeWeek,
                            priceUSD: priceUSD,
                            info: tokens_1.tokenList[address]
                        };
                        return data;
                    });
                    return [2 /*return*/, formatted];
                }
                return [3 /*break*/, 5];
            case 4:
                e_1 = _e.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, undefined];
        }
    });
}); };
exports.fetchTokenData = fetchTokenData;
var templateObject_1;
/**
 * Fetch top addresses by volume
 
const fetchedTokenDatas = async(): any => {
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const [block24h, block48h, block7d, block14d] = blocks ?? []
  const tokenAddresses = useTopTokenAddresses();

  useEffect(() => {
    const fetch = async () => {
      console.log("fetch fetchTokenData",tokenAddresses);
      const { error, data } = await fetchTokenData(
        block24h.number,
        block48h.number,
        block7d.number,
        block14d.number,
        tokenAddresses,
      )
      if (error) {
        setFetchState({ error: true })
      } else {
        const parsed = parseTokenData(data?.now)
        const parsed24 = parseTokenData(data?.oneDayAgo)
        const parsed48 = parseTokenData(data?.twoDaysAgo)
        const parsed7d = parseTokenData(data?.oneWeekAgo)
        const parsed14d = parseTokenData(data?.twoWeeksAgo)
        
        // Calculate data and format
        const formatted = tokenAddresses.reduce((accum: { [address: string]: TokenData }, address) => {
          const current: FormattedTokenFields | undefined = parsed[address]
          const oneDay: FormattedTokenFields | undefined = parsed24[address]
          const twoDays: FormattedTokenFields | undefined = parsed48[address]
          const week: FormattedTokenFields | undefined = parsed7d[address]
          const twoWeeks: FormattedTokenFields | undefined = parsed14d[address]

          const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
            current?.tradeVolumeUSD,
            oneDay?.tradeVolumeUSD,
            twoDays?.tradeVolumeUSD,
          )
          const [volumeUSDWeek] = getChangeForPeriod(
            current?.tradeVolumeUSD,
            week?.tradeVolumeUSD,
            twoWeeks?.tradeVolumeUSD,
          )
          const liquidityUSD = current ? current.totalLiquidity * current.derivedUSD : 0
          const liquidityUSDOneDayAgo = oneDay ? oneDay.totalLiquidity * oneDay.derivedUSD : 0
          const liquidityUSDChange = getPercentChange(liquidityUSD, liquidityUSDOneDayAgo)
          const liquidityToken = current ? current.totalLiquidity : 0
          // Prices of tokens for now, 24h ago and 7d ago
          const priceUSD = current ? current.derivedBNB  : 0
          
          const priceUSDOneDay = oneDay ? oneDay.derivedBNB  : 0
          const priceUSDWeek = week ? week.derivedBNB  : 0
          const priceUSDChange = getPercentChange(priceUSD, priceUSDOneDay)
          const priceUSDChangeWeek = getPercentChange(priceUSD, priceUSDWeek)
          const txCount = getAmountChange(current?.totalTransactions, oneDay?.totalTransactions)


          accum[address] = {
            exists: !!current,
            address,
            name: current ? current.name : '',
            symbol: current ? current.symbol : '',
            volumeUSD,
            volumeUSDChange,
            volumeUSDWeek,
            txCount,
            liquidityUSD,
            liquidityUSDChange,
            liquidityToken,
            priceUSD,
            priceUSDChange,
            priceUSDChangeWeek,
          }

          return accum
        }, {})
        setFetchState({ data: formatted, error: false })
      }
    }
    const allBlocksAvailable = block24h?.number && block48h?.number && block7d?.number && block14d?.number
    if (tokenAddresses.length > 0 && allBlocksAvailable && !blockError && bnbPrices) {
      fetch()
    }
  }, [tokenAddresses, block24h, block48h, block7d, block14d, blockError, bnbPrices])

  return fetchState
}

*/ 
