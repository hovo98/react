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
exports.fetchTokenData = void 0;
const graphql_request_1 = require("graphql-request");
const endpoints_1 = require("../config/endpoints");
const infoQueryHelpers_1 = require("../utils/infoQueryHelpers");
const getBlocksFromTimestamps_1 = require("../utils/getBlocksFromTimestamps");
const bnbprices_1 = require("../utils/bnbprices");
const infoDataHelpers_1 = require("../utils/infoDataHelpers");
const tokens_1 = require("../config/tokens");
/**
 * Main token data to display on Token page
 */
const TOKEN_AT_BLOCK = (block, tokens) => {
    const addressesString = `["${tokens.join('","')}"]`;
    const blockString = block ? `block: {number: ${block}}` : ``;
    return `tokens(
      where: {id_in: ${addressesString}}
      ${blockString}
      orderBy: tradeVolumeUSD
      orderDirection: desc
    ) {
      id
      symbol
      name
      derivedBNB
      derivedUSD
      tradeVolumeUSD
      totalTransactions
      totalLiquidity
    }
  `;
};
const _fetchTokenData = (block24h, block48h, block7d, block14d, tokenAddresses) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = (0, graphql_request_1.gql) `
      query tokens {
        now: ${TOKEN_AT_BLOCK(null, tokenAddresses)}
        oneDayAgo: ${TOKEN_AT_BLOCK(block24h, tokenAddresses)}
        twoDaysAgo: ${TOKEN_AT_BLOCK(block48h, tokenAddresses)}
        oneWeekAgo: ${TOKEN_AT_BLOCK(block7d, tokenAddresses)}
        twoWeeksAgo: ${TOKEN_AT_BLOCK(block14d, tokenAddresses)}
      }
    `;
        const data = yield (0, graphql_request_1.request)(endpoints_1.INFO_CLIENT, query);
        return { data, error: false };
    }
    catch (error) {
        console.error('Failed to fetch token data', error);
        return { erro: true };
    }
});
const fixedLength = (y) => {
    let num = y;
    let prec = 6;
    while (num > 10) {
        num /= 10;
        prec--;
    }
    return y.toFixed(prec);
};
// Transforms tokens into "0xADDRESS: { ...TokenFields }" format and cast strigns to numbers
const parseTokenData = (tokens) => {
    if (!tokens) {
        return {};
    }
    return tokens.reduce((accum, tokenData) => {
        const { derivedBNB, derivedUSD, tradeVolumeUSD, totalTransactions, totalLiquidity } = tokenData;
        accum[tokenData.id] = Object.assign(Object.assign({}, tokenData), { derivedBNB: parseFloat(derivedBNB), derivedUSD: parseFloat(derivedUSD), tradeVolumeUSD: parseFloat(tradeVolumeUSD), totalTransactions: parseFloat(totalTransactions), totalLiquidity: parseFloat(totalLiquidity) });
        return accum;
    }, {});
};
const fetchTokenData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [t24h, t48h, t7d, t14d] = (0, infoQueryHelpers_1.getDeltaTimestamps)();
        const result = yield (0, getBlocksFromTimestamps_1.getBlocksFromTimestamps)([t24h, t48h, t7d, t14d]);
        const [block24h, block48h, block7d, block14d] = result !== null && result !== void 0 ? result : [];
        const tokenAddresses = Object.keys(tokens_1.tokenList);
        const { error, data } = yield _fetchTokenData(block24h.number, block48h.number, block7d.number, block14d.number, tokenAddresses);
        if (error) {
            return undefined;
        }
        const { bnbPrices, error: fetchError } = yield (0, bnbprices_1.fetchBnbPrices)(block24h.number, block48h.number, block7d.number);
        if (fetchError) {
            return undefined;
        }
        else {
            const parsed = parseTokenData(data === null || data === void 0 ? void 0 : data.now);
            const parsed24 = parseTokenData(data === null || data === void 0 ? void 0 : data.oneDayAgo);
            const parsed48 = parseTokenData(data === null || data === void 0 ? void 0 : data.twoDaysAgo);
            const parsed7d = parseTokenData(data === null || data === void 0 ? void 0 : data.oneWeekAgo);
            const parsed14d = parseTokenData(data === null || data === void 0 ? void 0 : data.twoWeeksAgo);
            // Calculate data and format
            const formatted = tokenAddresses.map((address) => {
                const current = parsed[address];
                const oneDay = parsed24[address];
                const twoDays = parsed48[address];
                const week = parsed7d[address];
                const twoWeeks = parsed14d[address];
                const [volumeUSD, volumeUSDChange] = (0, infoDataHelpers_1.getChangeForPeriod)(current === null || current === void 0 ? void 0 : current.tradeVolumeUSD, oneDay === null || oneDay === void 0 ? void 0 : oneDay.tradeVolumeUSD, twoDays === null || twoDays === void 0 ? void 0 : twoDays.tradeVolumeUSD);
                const [volumeUSDWeek] = (0, infoDataHelpers_1.getChangeForPeriod)(current === null || current === void 0 ? void 0 : current.tradeVolumeUSD, week === null || week === void 0 ? void 0 : week.tradeVolumeUSD, twoWeeks === null || twoWeeks === void 0 ? void 0 : twoWeeks.tradeVolumeUSD);
                const liquidityUSD = current ? current.totalLiquidity * current.derivedUSD : 0;
                const liquidityUSDOneDayAgo = oneDay ? oneDay.totalLiquidity * oneDay.derivedUSD : 0;
                const liquidityUSDChange = (0, infoDataHelpers_1.getPercentChange)(liquidityUSD, liquidityUSDOneDayAgo);
                // Prices of tokens for now, 24h ago and 7d ago
                const reversed = tokens_1.tokenList[address].quote != "BNB";
                const priceUSD = current ? (reversed == false ? current.derivedBNB * (bnbPrices ? bnbPrices.current : 0) : (bnbPrices ? bnbPrices.current : 0)) : 0;
                const priceBNB = current ? (reversed == false ? current.derivedBNB : 1 / current.derivedBNB) : 0;
                const liquidityToken = current ? current.totalLiquidity : 0;
                const liquidityBNB = priceBNB > 0 ? liquidityToken * current.derivedBNB : 0;
                const priceBNBOneDay = oneDay ? (reversed == false ? oneDay.derivedBNB : 1 / oneDay.derivedBNB) : 0;
                const priceBNBWeek = week ? (reversed == false ? week.derivedBNB : 1 / week.derivedBNB) : 0;
                const priceBNBChange = (0, infoDataHelpers_1.getPercentChange)(priceBNB, priceBNBOneDay);
                const priceBNBChangeWeek = (0, infoDataHelpers_1.getPercentChange)(priceBNB, priceBNBWeek);
                const txCount = (0, infoDataHelpers_1.getAmountChange)(current === null || current === void 0 ? void 0 : current.totalTransactions, oneDay === null || oneDay === void 0 ? void 0 : oneDay.totalTransactions);
                const data = {
                    exists: !!current,
                    address,
                    name: current ? current.name : '',
                    symbol: tokens_1.tokenList[address].symbol,
                    volumeUSD,
                    volumeUSDChange,
                    volumeUSDWeek,
                    txCount,
                    liquidityUSD,
                    liquidityUSDChange,
                    liquidityToken,
                    liquidityBNB,
                    priceBNB: fixedLength(priceBNB),
                    priceBNBChange,
                    priceBNBChangeWeek,
                    priceUSD,
                    info: tokens_1.tokenList[address]
                };
                return data;
            });
            return formatted;
        }
    }
    catch (e) {
        //console.log(e.messages)
    }
    return undefined;
});
exports.fetchTokenData = fetchTokenData;
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
