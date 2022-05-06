import WebSocket from 'ws';
import {V2FACTORY_ABI} from "./abi/V2FACTORY";
import {V2POOL_ABI} from "./abi/V2POOL";
import {ERC20_ABI} from "./abi/ERC20";
import {providers,Contract,utils,BigNumber,ethers} from "ethers";
import {pancakeswapV2Factory,wbnb,limit_transaction} from "./config/tokens"

export class Token {

  public address:string;
  public listed:Boolean;
  public symbol:string;
  public base:string;
  public quote:string;
  public socketHandle:any;
  public decimals:number;

  public bsc_symbol:string;
  public transantions:Array<any>;
  public orderbook:any;
  constructor(address:string,tokenInfo:any,socketHandle:any,provider:any){
    this.address = address;
    this.symbol = tokenInfo.symbol;
    this.listed = tokenInfo.listed;
    this.base = tokenInfo.base;
    this.quote = tokenInfo.quote;
    this.socketHandle = socketHandle;
    this.bsc_symbol = tokenInfo.base+tokenInfo.quote;
    this.bsc_symbol = this.bsc_symbol.toLowerCase();
    this.decimals=0;
    this.transantions =[];
    this.orderbook=undefined;
    const self = this;
    if(this.listed){
      const ws = new WebSocket('wss://stream.binance.com:9443/ws/'+this.bsc_symbol+'@depth20');
      ws.on('message', function incoming(data:any) {
        const orderbook = JSON.parse(data);
        self.orderbook = orderbook;
        //console.log(orderbook);
        if(socketHandle){
          socketHandle.to(tokenInfo.symbol).emit("orderbook",orderbook);
        }
      });
      const ws_trade = new WebSocket('wss://stream.binance.com:9443/ws/'+this.bsc_symbol+'@trade');
      ws_trade.on('message', function incoming(data:any) {
        const trade = JSON.parse(data);
        const trdata = {amount:trade.q,price:self.fixedLength(Number(trade.p)),time:trade.T,isbuy:trade.m==false};
        self.sendTransaction(trdata);
        //console.log(trade);
        // if(socketHandle){
        //   socketHandle.to(tokenInfo.symbol).emit("trade",trade);
        // }
      });  
    }else{//transaction history on chain
      //get pair
      setTimeout(async()=>{
        const erc20 = new Contract(this.address,ERC20_ABI,provider);
        this.decimals = (await erc20.functions.decimals())[0];
        const factory = new Contract(pancakeswapV2Factory,V2FACTORY_ABI,provider);
        const pooladdress = await factory.functions.getPair(address,wbnb.address);
        const pool_contract = new Contract(pooladdress[0],V2POOL_ABI,provider);
        let eventFilter = pool_contract.filters.Swap()
        let events = await pool_contract.queryFilter(eventFilter, -50, "latest") //not working if I specify blocks
        for(let i=0;i<events.length;i++){
          const params = events[i];
          const event:any = params.args;
          const block = await params.getBlock();
          await this.addTransaction({timestamp:block.timestamp*1000,transactionHash:params.transactionHash,sender:event.sender,amount0In:event.amount0In,amount1In:event.amount1In,amount0Out:event.amount0Out,amount1Out:event.amount1Out,to:event.to})
        }
        const filter = pool_contract.filters.Swap();
        pool_contract.on(filter, async(...params:any)=>{
          const event:any = params.args;
          if(!event) return;
          try{
            const timestamp = Date.now();
            await this.addTransaction({timestamp,
              transactionHash:params.transactionHash,
              sender:event.sender,
              amount0In:event.amount0In,
              amount1In:event.amount1In,
              amount0Out:event.amount0Out,
              amount1Out:event.amount1Out,
              to:event.to
            });
          }catch(e){
            console.log(e);
          }
        });
      },100)

    }
  }
  fixedLength(y:number) {
    let num = y;
    let prec = 6;
    while(num > 10) {
        num /= 10;
        prec--;
    }
    return y.toFixed(prec);
  }
  sendTransaction(data:any){
    this.transantions.push(data);
    if(this.transantions.length>limit_transaction) {
      this.transantions.shift();
    }
    if(this.socketHandle){
      this.socketHandle.to(this.symbol).emit("transactions",this.transantions);
    }

  }
  async addTransaction(tr:any){
    const is0 = wbnb.address.toLowerCase()>this.address.toLowerCase();
    const amount0 = (Number(tr.amount0In)>0?Number(tr.amount0In):Number(tr.amount0Out));
    const amount1 =(Number(tr.amount1In)>0?Number(tr.amount1In):Number(tr.amount1Out));
    const amount = ((is0?amount0:amount1)/Math.pow(10,this.decimals)).toFixed(Math.min(6,this.decimals));
    const price =is0?(amount1/amount0):(amount0/amount1);
    const price_decimal =this.fixedLength( price/Math.pow(10,wbnb.decimals-this.decimals));
    const time =tr.timestamp;
    const isbuy = is0?(Number(tr.amount0In)>0?true:false):(Number(tr.amount1In)>0?true:false);
    const data = {hash:tr.transactionHash,amount,price:price_decimal,time,isbuy};
    this.sendTransaction(data);
  }
}
// const provider =new providers.StaticJsonRpcProvider("https://bsc.getblock.io/mainnet/?api_key=2beae857-cbee-479d-852e-9a4d000e65a0");
// const mytoken = new Token("0x2170ed0880ac9a755fd29b2688956bd959f933f8",{"symbol":"ETH","listed":true,"base":"BNB","quote":"ETH"},null,provider);