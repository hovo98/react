import {Token} from "./token";
import {tokenList} from "./config/tokens";
import {fetchTokenData} from "./tokens/getTokens"

export class Tokens {

  public items:Array<Token>;
  public pairs24h:any;
  constructor(socket_handler:any,provider:any){
    this.items =[] ;     
    Object.keys(tokenList).forEach((address)=>{
      const token = new Token(address,tokenList[address as keyof typeof tokenList],socket_handler,provider);
      this.items.push(token);
    });
    const self=this;
    setInterval(async()=>{
      let data:any = await fetchTokenData();

      if(data){
        self.pairs24h = data;
        if(socket_handler){
          socket_handler.to("pairs24h").emit("data",data);
        }else{
          console.log(data);
        }
      }else{
        console.log('1')
        if(!(self.pairs24h)){
          console.log('set default data')

          let emptytokens:Array<any> =  [];
          Object.keys(tokenList).forEach((address)=>{
            const tk = tokenList[address as keyof typeof tokenList];
            emptytokens.push({
              exists:true,
                address,
                name: tk.symbol,
                symbol: tk.symbol,
                volumeUSD:0,
                volumeUSDChange:0,
                volumeUSDWeek:0,
                txCount:0,
                liquidityUSD:0,
                liquidityUSDChange:0,
                liquidityToken:0,
                priceBNB:0,
                priceBNBChange:0,
                priceBNBChangeWeek:0,
                priceUSD:0,
                info:tk
            })
          });
          self.pairs24h = emptytokens;
          if(socket_handler){
            socket_handler.to("pairs24h").emit("data",emptytokens);
          }else{
            console.log(emptytokens);
          }        
        }
  

      }  
    },10000)
    //24hours handle

  }
}


// const mytoken = new Tokens(null);