
const gql=require('graphql-tag')
var dayjs = require('dayjs')
const Web3 = require("web3");
const axios = require('axios');

const apiKey = 'BQYvhnv04csZHaprIBZNwtpRiDIwEIW9' // replace this with your API Key
     
const GET_PRICE = (chainid,tokenAddress,mode)=>{
    
    let chainnet,quoteCurrency,exchange;
    basecurrency = tokenAddress
    if(chainid==1){//mainnet
        chainnet="ethereum";
        quoteCurrency="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
        basecurrency = tokenAddress;
        exchange="Uniswap"
    }else if (chainid==56) {//binance
        console.log('check binance');
        chainnet="bsc";
        quoteCurrency="0xe9e7cea3dedca5984780bafc599bd69add087d56";
        exchange="Pancake"
        basecurrency = tokenAddress;
    }else{//polygon
        chainnet="matic";
        quoteCurrency="0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
        exchange="QuickSwap"
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
    
    `
    const query = {"query":query_init,"variables":"{}"}
    
    return(query)
}


async function getTokenprice_ethmatic(chianId,address){
    
    let priceResult =-1; 
    try{
        result = await axios.post('https://graphql.bitquery.io/', GET_PRICE(chianId,address,1), { headers:{"X-API-KEY":apiKey} })
        price = result.data?.data?.ethereum?.dexTrades?.length==0?-1:parseFloat(result.data?.data.ethereum?.dexTrades[0].quotePrice)
        priceResult = price ;
    }catch (e){
        console.log(e.message);
    }
    console.log('price=',priceResult);
    return(priceResult);    
}
  
module.exports ={
    getTokenprice_ethmatic
}