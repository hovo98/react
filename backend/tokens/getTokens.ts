import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from '../config/endpoints'
import { getDeltaTimestamps } from '../utils/infoQueryHelpers'
import { getBlocksFromTimestamps } from '../utils/getBlocksFromTimestamps'
import { fetchBnbPrices } from '../utils/bnbprices'
import { getPercentChange, getChangeForPeriod, getAmountChange } from '../utils/infoDataHelpers'
import {tokenList} from "../config/tokens"
import { TokenData } from '../types/types'

interface TokenFields {
  id: string
  symbol: string
  name: string
  derivedBNB: string // Price in BNB per token
  derivedUSD: string // Price in USD per token
  tradeVolumeUSD: string
  totalTransactions: string
  totalLiquidity: string
}

interface FormattedTokenFields
  extends Omit<TokenFields, 'derivedBNB' | 'derivedUSD' | 'tradeVolumeUSD' | 'totalTransactions' | 'totalLiquidity'> {
  derivedBNB: number
  derivedUSD: number
  tradeVolumeUSD: number
  totalTransactions: number
  totalLiquidity: number
}
interface TokenQueryResponse {
  now: TokenFields[]
  oneDayAgo: TokenFields[]
  twoDaysAgo: TokenFields[]
  oneWeekAgo: TokenFields[]
  twoWeeksAgo: TokenFields[]
}

/**
 * Main token data to display on Token page
 */
const TOKEN_AT_BLOCK = (block: number | undefined | null, tokens: string[]) => {
  const addressesString = `["${tokens.join('","')}"]`
  const blockString = block ? `block: {number: ${block}}` : ``
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
  `
}
const _fetchTokenData = async (
  block24h: number,
  block48h: number,
  block7d: number,
  block14d: number,
  tokenAddresses: string[],
) => {
  try {
    const query = gql`
      query tokens {
        now: ${TOKEN_AT_BLOCK(null, tokenAddresses)}
        oneDayAgo: ${TOKEN_AT_BLOCK(block24h, tokenAddresses)}
        twoDaysAgo: ${TOKEN_AT_BLOCK(block48h, tokenAddresses)}
        oneWeekAgo: ${TOKEN_AT_BLOCK(block7d, tokenAddresses)}
        twoWeeksAgo: ${TOKEN_AT_BLOCK(block14d, tokenAddresses)}
      }
    `
    const data = await request<TokenQueryResponse>(INFO_CLIENT, query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch token data', error)
    return { erro: true }
  }
}
 const fixedLength=(y:number)=> {
    let num = y;
    let prec = 6;
    while(num > 10) {
        num /= 10;
        prec--;
    }
    return y.toFixed(prec);
  }

// Transforms tokens into "0xADDRESS: { ...TokenFields }" format and cast strigns to numbers
const parseTokenData = (tokens?: TokenFields[]) => {
  if (!tokens) {
    return {}
  }
  return tokens.reduce((accum: { [address: string]: FormattedTokenFields }, tokenData) => {
    const { derivedBNB, derivedUSD, tradeVolumeUSD, totalTransactions, totalLiquidity } = tokenData
    accum[tokenData.id] = {
      ...tokenData,
      derivedBNB: parseFloat(derivedBNB),
      derivedUSD: parseFloat(derivedUSD),
      tradeVolumeUSD: parseFloat(tradeVolumeUSD),
      totalTransactions: parseFloat(totalTransactions),
      totalLiquidity: parseFloat(totalLiquidity),
    }
    return accum
  }, {})
}

export const fetchTokenData = async()=>{
  try{
        const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
        const result = await getBlocksFromTimestamps([t24h, t48h, t7d, t14d]);
        const [block24h, block48h, block7d, block14d] = result ?? []
        const tokenAddresses = Object.keys(tokenList);
        const { error, data } = await _fetchTokenData(
          block24h.number,
          block48h.number,
          block7d.number,
          block14d.number,
          tokenAddresses
        )
        if(error){
          return undefined;
        }
        const { bnbPrices, error: fetchError } = await fetchBnbPrices(block24h.number, block48h.number, block7d.number)
        if (fetchError) {
          return undefined;
        } else {
          const parsed = parseTokenData(data?.now)
          const parsed24 = parseTokenData(data?.oneDayAgo)
          const parsed48 = parseTokenData(data?.twoDaysAgo)
          const parsed7d = parseTokenData(data?.oneWeekAgo)
          const parsed14d = parseTokenData(data?.twoWeeksAgo)
          
          // Calculate data and format
          const formatted = tokenAddresses.map((address:string) => {
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
            // Prices of tokens for now, 24h ago and 7d ago
            const reversed = tokenList[address as keyof typeof tokenList].quote!="BNB";
            const priceUSD = current ? (reversed==false ? current.derivedBNB*(bnbPrices?bnbPrices.current:0):(bnbPrices?bnbPrices.current:0)) : 0
            const priceBNB = current ? (reversed==false ? current.derivedBNB:1/current.derivedBNB) : 0

            const liquidityToken = current ? current.totalLiquidity : 0
            const liquidityBNB = priceBNB>0?liquidityToken*current.derivedBNB:0;
            
            const priceBNBOneDay = oneDay ? (reversed==false ? oneDay.derivedBNB:1/oneDay.derivedBNB) : 0
            const priceBNBWeek = week ? (reversed==false ? week.derivedBNB:1/week.derivedBNB) : 0
            const priceBNBChange = getPercentChange(priceBNB, priceBNBOneDay)
            const priceBNBChangeWeek = getPercentChange(priceBNB, priceBNBWeek)
            const txCount = getAmountChange(current?.totalTransactions, oneDay?.totalTransactions)


            const data = {
              exists: !!current,
              address,
              name: current ? current.name : '',
              symbol: tokenList[address as keyof typeof tokenList].symbol,
              volumeUSD,
              volumeUSDChange,
              volumeUSDWeek,
              txCount,
              liquidityUSD,
              liquidityUSDChange,
              liquidityToken,
              liquidityBNB,
              priceBNB:fixedLength(priceBNB),
              priceBNBChange,
              priceBNBChangeWeek,
              priceUSD,
              info:tokenList[address as keyof typeof tokenList]
            }

            return data
          })
          return formatted;
        }
  }catch(e:any){
    //console.log(e.messages)
  }
      
  return undefined;
}
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