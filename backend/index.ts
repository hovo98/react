import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from "axios";
import {Tokens} from "./tokenlist"
import {providers,Contract,utils,BigNumber,ethers} from "ethers";
import {RPCURL,rangourl,rangokey} from "./config/endpoints"
import { RangoClient } from "rango-sdk"
import {wbnb} from "./config/tokens"

import { createServer } from "https";
// import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";

import {checkConfirmAlls} from "./confirm";
import {executeAll} from "./orderexecutor";
import * as db from './db';

const rangoClient = new RangoClient(rangokey)

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors({
    origin: '*'
}));
app.use('/',express.static("../frontend/build"))

app.get('/api/metadata', async(req:any, res:any) => {
    const response = await axios.get(rangourl+"/meta?apiKey="+rangokey);
    res.json(response.data)
})
app.post('/api/routing', async(req:any, res:any) => {
    const param = req.body
    const bestRoute = await rangoClient.getBestRoute(param)
    console.log({bestRoute});
    res.json(bestRoute)
    return;
    const response = await axios.post(rangourl+"/routing/best?apiKey="+rangokey,
      JSON.stringify(req.body),{
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      });
    res.json(response.data)
})
app.get('/api/getdata', (req:any, res:any) => {
  const symbol = req.query.symbol;
  const op = req.query.op;
  if(op=='pairs24h'){
    res.json(tokenlist.pairs24h);
    return;
  }
  if(op=='pairsinfo'){
    let pairsInfo:any = {}
    if(tokenlist.pairs24h){
      for(let i=0;i<tokenlist.pairs24h.length;i++){
        const pair:any = tokenlist.pairs24h[i];
        const key:string =pair.info.base+pair.info.quote 
        pairsInfo[key] = {
          "base_id": pair.info.base==wbnb.symbol?wbnb.address:pair.address,
          "base_name": pair.info.base,
          "base_symbol": pair.info.base,
          "quote_id": pair.info.quote==wbnb.symbol?wbnb.address:pair.address,
          "quote_name": pair.info.quote,
          "quote_symbol": pair.info.quote,
          "last_price": pair.priceBNB,
          "base_volume": pair.info.base==wbnb.symbol? pair.liquidityBNB:pair.liquidityToken,
          "quote_volume": pair.info.quote==wbnb.symbol? pair.liquidityBNB:pair.liquidityToken,

        }
      }
    
    }
      res.json(pairsInfo);
    return;
  }

  tokenlist.items.forEach((token)=>{
    if(token.symbol==symbol){
      if(op=="orderbook"){
        res.json(token.orderbook);
        return;    
      }
      if(op=="transactions"){
        res.json(token.transantions);
        return;    
      }
    }
  })
  res.json({});
});

app.post('/api/subgraphs',async  (req:any, res:any) => {
    try{
      const headers = {
        'origin': "https://pancakeswap.finance",
        'referer': 'https://pancakeswap.finance/',
        'content-type': 'application/json'
      }
      const response0 = await axios.post(
        "https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2", 
        req.body, 
        {
          headers
        });
      res.json(response0.data);
    }catch(e:any){
      res.json({});
      console.log(e.message)
    }
});

app.get('/api/createorder',async  (req:any, res:any) => {
    try {
      let data = req.query;
      data.trstatus = "pending";
      const ret = db.insert_record("positions",data);
        res.json(ret);
    } catch (e:any) {
        console.log(e.message)
        res.json({});
    }
});

app.get('/api/getorder',async  (req:any, res:any) => {
    try {

      const chainid = req.query.chainid;
      const owner = req.query.owner;
      const openclose = req.query.openclose;
      const buysell = req.query.buysell;
      const timestamp = req.query.timestamp;
      const ordertype = req.query.ordertype;
      const pairs = req.query.pairs;

      let query = "SELECT * FROM positions WHERE trstatus='confirm' AND chainid="+(chainid?chainid:"56");
      
      if(openclose=="open"){//open order
        query = query+" AND (orderstatus='open' or orderstatus='pending') ";
      }else if(openclose=="trade"){//closed order
        query = query+" AND (orderstatus='executed') ";
      }
      if(pairs){
         query = query+" pairs='"+pairs+"'"; 
      }
      if(ordertype){//my order
        query = query+" AND ordertype='"+ordertype+"' ";
      }
      if(timestamp){
        const dt = new Date(Number(timestamp))
        query = query+" AND timestamp>'"+dt.toISOString().replace('T'," ").substring(0,19)+"' ";
      }
      if(owner){
        query = query+" AND owner='"+owner+"' ";
      }
      if(Number(buysell)==1){
       query = query+" AND buysell='buy' "; 
      }
      if(Number(buysell)==2){
       query = query+" AND buysell='sell' "; 
      }
      query = query +" ORDER BY id DESC";
      const ret = db.get_records(query);
      res.json(ret);
    } catch (e:any) {
        console.log(e.message)
        res.json([]);
    }
});

const httpServer = createServer({
  key: fs.readFileSync('./server.pem'),
  cert: fs.readFileSync('./server.cert')
},app);
//const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


io.on("connection", (socket) => {
  socket.on('join', function(room) {
      console.log("connected a room");
      socket.join(room);
  });
});

httpServer.listen(443, () => {
  console.log("Running at localhost:443");
});


let provider = new providers.StaticJsonRpcProvider(RPCURL);
const tokenlist = new Tokens(io,provider);

db.init_mysql();
checkConfirmAlls();
executeAll();

const callLink = ()=>{
  const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
  const addr = "0xB38722F6A608646a538E882Ee9972D15c86Fc597";//bnbusd price
  const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)
  priceFeed.latestRoundData()
      .then((roundData:any) => {
          // Do something with roundData
          //console.log("Latest Round Data", roundData)
      })  
}
setInterval(callLink,30000)
