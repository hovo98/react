import { Modal } from "react-bootstrap";
import useSharedState from '../hook/useSharedState'

import React ,{useState,useEffect,useCallback,useMemo} from "react";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'

import { BigNumber } from '@ethersproject/bignumber'

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WETH,marketOrder,limitOrder,STAKEFEE,EXECUTOR_FEE,SLIPPAGE } from "./const";
import {ERC20_ABI} from "../abi/ERC20";
import {LIMIT_ABI} from "../abi/LIMIT";
import {MARKET_ABI} from "../abi/MARKET";
import {PAN_ABI} from "../abi/PAN";

import {getContract} from "./contract";
import {fixedLength} from "./common"

const workChainId = 56

function Trading() {

  const { chainId, account, activate, active,library } = useWeb3React()
  const [show, setShow] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [slippagePractice,setSlippagePractice] = useState(SLIPPAGE);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    if(active==false){
      setShow(true);
    }
  }
  const connectMetamask = async()=>{
    const injectedConnector = new InjectedConnector({supportedChainIds: [1,3,4,42,56,137],})
    activate(injectedConnector)
    handleClose();
  }

  
  const RPC = {
    56: 'https://bsc.getblock.io/mainnet/?api_key=7b87bee9-86e3-49d9-bd31-aa4bd5efed68'
  }
  
  const connectWalletConnect = async()=>{
    handleClose();
    const WalletConnect = new WalletConnectConnector({
     rpc: RPC,
     qrcode: true,
    });
    await activate(WalletConnect);
    setTimeout(()=>{activate(WalletConnect)},500)

  }  
  const toFixed = (_x)=> {
    let x=Math.floor(_x)
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x.toString();
  }


  const [orderType,setOrderType]=useState('market');
  const {selectedToken,setSelectedToken,bnbPrice,long,setLong,ask,bid}=useSharedState();//useState(undefined);
  const [priceBuy,setPriceBuy] = useState(0);
  const [priceSell,setPriceSell] = useState(0);
  const [amountBuy,setAmountBuy] = useState(0);
  const [amountSell,setAmountSell] = useState(0);
  const [totalSell,setTotalSell] = useState(0);
  const [totalBuy,setTotalBuy] = useState(0);
  const [timestamp,setTimestamp] = useState(0);
  const [balances,setBalances] = useState({base:0,quote:0})
  const [exactIn,setExactIn] = useState(false);
  const [disabled,setDisabled] = useState(false);
  const limitContract = getContract(limitOrder, LIMIT_ABI,library,account);
  const marketContract = getContract(marketOrder, MARKET_ABI,library,account);
  //const marketContract = getContract("0x10ED43C718714eb63d5aA57B78B54704E256024E", PAN_ABI,library,account);
  const resetAll = ()=>{
      setAmountBuy(0);
      setAmountSell(0);
      setTotalBuy(0);
      setTotalSell(0);

  }
  const setAmountBuyCall = (value)=>{
    setAmountBuy(value);
    setExactIn(false);
  }

  const setPercentBuy = (value)=>{
    if(!selectedToken) return;
    setExactIn(true);
    if((orderType=='limit') || 
        orderType=='market'
      ){
        const total =balances.quote*value/(1+STAKEFEE+Number(slippagePractice)/100); 
        setTotalBuy(Number(fixedLength(selectedToken.info.quote!="BNB"?total:total-EXECUTOR_FEE)));
    }
  }
  const setPercentSell = (value)=>{
    if(!selectedToken) return;
    const total =balances.base*value/(1+STAKEFEE+Number(slippagePractice)/100); 
    setAmountSell(Number(fixedLength(selectedToken.info.base!="BNB"?total:total-EXECUTOR_FEE)));
  }

  const convertAmount = (value,decimals)=>{
    return value/Math.pow(10,decimals);
  }
  const updateMarketData = async()=>{
    //buy
    console.log('update market data');
    let assetIn = selectedToken.info.quote=="BNB"?WETH.address:selectedToken.address;
    let assetOut = selectedToken.info.base=="BNB"?WETH.address:selectedToken.address;
    let decimalsIn = selectedToken.info.quote=="BNB"?WETH.decimals:selectedToken.info.decimals;
    let decimalsOut = selectedToken.info.base=="BNB"?WETH.decimals:selectedToken.info.decimals;
    let path = [assetIn,assetOut];
    if(exactIn){
      if(totalBuy>0) {
        const amountIn = getBigNumber((assetIn==WETH.address?Math.pow(10,WETH.decimals):Math.pow(10,selectedToken.info.decimals))*totalBuy);
        const _amountOut = await marketContract.getAmountsOut(amountIn, path);
        const amountOut = _amountOut[_amountOut.length-1];
        setAmountBuy(Number(fixedLength(convertAmount(Number(amountOut),decimalsOut))));
      }
    }else{
      if(amountBuy>0) {
        const amountOut = getBigNumber((assetOut==WETH.address?Math.pow(10,WETH.decimals):Math.pow(10,selectedToken.info.decimals))*amountBuy);
        const _amountIn = await marketContract.getAmountsIn(amountOut, path);
        const amountIn = _amountIn[0];
        setTotalBuy(Number(fixedLength(convertAmount(Number(amountIn),decimalsIn))));    
      }
    }
    //sell

    assetIn = selectedToken.info.base=="BNB"?WETH.address:selectedToken.address;;
    assetOut = selectedToken.info.quote=="BNB"?WETH.address:selectedToken.address;;
    path = [assetIn,assetOut];
    decimalsIn = selectedToken.info.base=="BNB"?WETH.decimals:selectedToken.info.decimals;
    decimalsOut = selectedToken.info.quote=="BNB"?WETH.decimals:selectedToken.info.decimals;

    if(amountSell==0) return;
    const amountIn = getBigNumber((assetIn==WETH.address?Math.pow(10,WETH.decimals):Math.pow(10,selectedToken.info.decimals))*amountSell);
    const _amountOut = await marketContract.getAmountsOut(amountIn,path);
    const amountOut = _amountOut[_amountOut.length-1];
    setTotalSell(Number(fixedLength(convertAmount(Number(amountOut),decimalsOut))));
  }

  useEffect(()=>{
    const update = async()=>{
      if(orderType=='limit'){
        if(Number(priceBuy)>0){
          if(exactIn){
            const buy =Number(fixedLength(Number(totalBuy)/Number(priceBuy))); 
            setAmountBuy(buy);
          }else{
            const total =Number(fixedLength(Number(amountBuy)*Number(priceBuy))); 
            setTotalBuy(total);
          }
        }
      }else{
        updateMarketData();
      }
    }
    if(selectedToken && account) update();
  },[selectedToken,account,priceBuy,amountBuy,totalBuy,orderType])

  useEffect(()=>{
    const update = async()=>{
      if(orderType=='limit'){
        if(Number(priceSell)>0){
          const total =Number(fixedLength(Number(amountSell)*Number(priceSell))); 
          setTotalSell(total);
        }
      }else{
        updateMarketData();
      }
    }
    if(selectedToken && account) update();
  },[selectedToken,account,priceSell,amountSell,orderType])

  const updateBalance = async()=>{

      const contract = getContract(selectedToken.address, ERC20_ABI,library,account);
      let ethBalance = Number(await library.getBalance(account));
      let tokenBalance = Number(await contract.balanceOf(account));
      ethBalance = Number(fixedLength(ethBalance / Math.pow(10,WETH.decimals)));
      tokenBalance=Number(fixedLength(tokenBalance / Math.pow(10,selectedToken.info.decimals)));
      let data = {... balances};
      data.base = selectedToken.info.base =="BNB"?ethBalance:tokenBalance;
      data.quote = selectedToken.info.quote =="BNB"?ethBalance:tokenBalance;
      setBalances(data);
  }
  useEffect(()=>{
    const update = async()=>{
      if(active && chainId==56){
        updateBalance();
        if(orderType=='market') updateMarketData();
      }
      setAmountBuy(0);
      setAmountSell(0);
      setTotalBuy(0);
      setTotalSell(0);

    }
    if(selectedToken && account) update();
  },[selectedToken,account,timestamp,active]);

  useEffect(() => {
    library?.on('block', () => {
      if(chainId==56){
        updateBalance();
      }
    })
    return () => {
      library?.removeAllListeners('block')
    }
  }, [library,chainId])

  const getBigNumber=(value)=>{
    return(BigNumber.from(toFixed(value)));
  }
  const getDeadLine = async()=>{
    let timestamp =0;
    if(library){
      const bn = await library.getBlockNumber();
      timestamp = (await library.getBlock(bn)).timestamp+3600*3;
    }
    return timestamp;
  }
  const sendMarketOrder=async(assetIn,assetOut,amountIn,amountOut)=>{
    setDisabled(true);
    console.log({assetIn,assetOut,amountIn,amountOut})

    try{
      let deadline =await getDeadLine();
      const path = [assetIn,assetOut];
      let options = {
            gasLimit : 0,
            value:getBigNumber(
              (WETH.address==assetIn?(amountIn*(1+STAKEFEE)):0)
              *Math.pow(10,WETH.decimals)
              )
      };        
      const ai = getBigNumber((assetIn==WETH.address?Math.pow(10,WETH.decimals):Math.pow(10,selectedToken.info.decimals))*amountIn)
      const ao = getBigNumber((amountOut==WETH.address?Math.pow(10,WETH.decimals):Math.pow(10,selectedToken.info.decimals))*(amountOut*(1-Number(slippagePractice)/100)));
      if(WETH.address!=assetIn){
        const allowai = getBigNumber(assetIn==WETH.address?Math.pow(10,WETH.decimals):Math.pow(10,selectedToken.info.decimals)*(amountIn*(1+STAKEFEE)))
        const contract = getContract(assetIn, ERC20_ABI,library,account);
        const result = (await contract.functions.allowance(account,marketOrder))[0];
        if(result.lt(allowai)){
          const rt = await contract.approve(marketOrder, getBigNumber(Math.pow(2,255)));
          await rt.wait();
        }
      }
      console.log({
        assetIn,
        assetOut,
        ai,
        ao,
        path,
        options})
      let gasLimit;
      if(assetIn==WETH.address) {
        console.log('1')
        gasLimit = await marketContract.estimateGas.myswapExactETHForTokens(ai,ao,path,account,deadline,options);
      }
      if(assetOut==WETH.address) {
        console.log('2')
        gasLimit = await marketContract.estimateGas.swapExactTokensForETH(ai,ao,path,account,deadline,options);
      }
      if (assetIn!=WETH.address && assetOut!=WETH.address){
        console.log('3')
        gasLimit = await marketContract.estimateGas.swapExactTokensForTokens(ai,ao,path,account,deadline,options);
      }
      options.gasLimit = gasLimit;
      let tx;
      if(assetIn==WETH.address) {
        tx = await marketContract.myswapExactETHForTokens(ai,ao,path,account,deadline,options);
      }
      if(assetOut==WETH.address) {
        tx = await marketContract.swapExactTokensForETH(ai,ao,path,account,deadline,options);
      }
      if (assetIn!=WETH.address && assetOut!=WETH.address){
        tx = await marketContract.swapExactTokensForTokens(ai,ao,path,account,deadline,options);
      }
      
      setAmountBuy(0);
      setAmountSell(0);
      setTotalBuy(0);
      setTotalSell(0);
      setDisabled(false);
      return(tx);
    }catch(e){
      setDisabled(false);
      console.log(e)
    }
    return(undefined);

  }

  const sendLimitOrder=async(assetIn,assetOut,amountIn,amountOut)=>{
    setDisabled(true);
    console.log({assetIn,assetOut,amountIn,amountOut})

    try{
      const ordertype = assetIn==WETH.address?0:assetOut==WETH.address?1:2;
      const path = [assetIn,assetOut];
      let options = {
            gasLimit : 0,
            value:getBigNumber(
              (WETH.address==assetIn?(amountIn*(1+STAKEFEE)+EXECUTOR_FEE):EXECUTOR_FEE)
              *Math.pow(10,WETH.decimals)
              )
      };        
      const ai = getBigNumber((assetIn==WETH.address?Math.pow(10,WETH.decimals):Math.pow(10,selectedToken.info.decimals))*amountIn)
      const ao = getBigNumber((amountOut==WETH.address?Math.pow(10,WETH.decimals):Math.pow(10,selectedToken.info.decimals))*amountOut)
      const efee = getBigNumber(EXECUTOR_FEE*Math.pow(10,WETH.decimals));
      if(WETH.address!=assetIn){
        const allowai = getBigNumber(assetIn==WETH.address?Math.pow(10,WETH.decimals):Math.pow(10,selectedToken.info.decimals)*(amountIn*(1+STAKEFEE)))
        const contract = getContract(assetIn, ERC20_ABI,library,account);
        const result = (await contract.functions.allowance(account,limitOrder))[0];
        if(result.lt(allowai)){
          console.log({allowai,result})
          const rt = await contract.approve(limitOrder, getBigNumber(Math.pow(2,255)));
          await rt.tx.wait();
        }
      }
      console.log({ordertype,
        assetIn,
        assetOut,
        ai,
        ao,
        path,
        efee,
        options})
      const gasLimit = await limitContract.estimateGas.createOrder(ordertype,assetIn,assetOut,ai,ao,path,efee,options)
      options.gasLimit = gasLimit;
      const tx = await limitContract.createOrder(
        ordertype,
        assetIn,
        assetOut,
        ai,
        ao,
        path,
        efee,
        options);
      setAmountBuy(0);
      setAmountSell(0);
      setTotalBuy(0);
      setTotalSell(0);
      setDisabled(false);
      return(tx);
    }catch(e){
      setDisabled(false);
      console.log(e)
    }
    return(undefined);

  }

  const onBuy = async()=>{
    if(orderType=='limit'){
      const response = await sendLimitOrder(
        selectedToken.info.quote=="BNB"?WETH.address:selectedToken.address,
        selectedToken.info.base=="BNB"?WETH.address:selectedToken.address,
        Number(totalBuy),
        Number(amountBuy)
      )      
      if(response){
        const regist = await fetch(getapiquery(response,'buy','limit',Number(totalBuy),selectedToken.info.quote));
      }
    }else{
      const response = await sendMarketOrder(
        selectedToken.info.quote=="BNB"?WETH.address:selectedToken.address,
        selectedToken.info.base=="BNB"?WETH.address:selectedToken.address,
        Number(totalBuy),
        Number(amountBuy)
      )      
      if(response){
        const regist = await fetch(getapiquery(response,'buy','market',Number(totalBuy),selectedToken.info.quote));
      }
    }
  }

  const onSell = async()=>{
    if(orderType=='limit'){
      const response = await sendLimitOrder(
        selectedToken.info.base=="BNB"?WETH.address:selectedToken.address,
        selectedToken.info.quote=="BNB"?WETH.address:selectedToken.address,
        Number(amountSell),
        Number(totalSell)
      )    
      if(response){
        const regist = await fetch(getapiquery(response,'sell','limit',Number(amountSell),selectedToken.info.base));
      }
    }else{
      const response = await sendMarketOrder(
        selectedToken.info.base=="BNB"?WETH.address:selectedToken.address,
        selectedToken.info.quote=="BNB"?WETH.address:selectedToken.address,
        Number(amountSell),
        Number(totalSell)
      )    
      if(response){
        const regist = await fetch(getapiquery(response,'sell','market',Number(amountSell),selectedToken.info.base));
      }

    }
  }

  const getapiquery=(response,side,ordertype,inAmount,inAsset)=>{
      let apiquery="";
      if(selectedToken){
          const trid =response.hash;
          const prefix = window.location.protocol+"//"+window.location.hostname;

          apiquery = prefix+"/api/createorder?chainid=56&owner="+account+
               "&pairs="+selectedToken.info.base+selectedToken.info.quote+"&side="+side+"&transactionid="+trid+"&trstatus=pending&ordertype="+ordertype;
          
          apiquery = apiquery+"&orderstatus=executed";
          apiquery = apiquery+"&orderid=0&inAmount="+inAmount+"&inAsset="+inAsset;
          if(ordertype.indexOf("market")>=0){
              const tokenprice = (
                    side=='buy'?Number(fixedLength(Number(totalBuy)/Number(amountBuy))):Number(fixedLength(Number(totalSell)/Number(amountSell)))
                  );
              apiquery = apiquery+"&price="+tokenprice;
          }else{
              apiquery = apiquery+"&price="+(
                      side=='buy'?priceBuy:priceSell
              );
          }
          apiquery = apiquery+"&amount="+(
                side=='buy'?amountBuy:amountSell
          );   
          console.log(apiquery);         
      }
  
      return  apiquery;   
  }  
  return (
     <div className="col-12 col-lg-4 bg-dark text-white">
      <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
        <div role="button" className={"text-1 "+(orderType=='limit'?"text-warning":"text-muted")} onClick={()=>{setOrderType('limit');resetAll()}}>Limit Order</div>
        <div role="button" className={"text-1 "+(orderType=='market'?"text-warning":"text-muted")} onClick={()=>{setOrderType('market');resetAll()}}>Market Order</div>
        <div className="ps-2 pe-2" id="buy-crypto">
          <img src="./assets/images/visa.svg" alt="" width={24} height={24} className="d-inline-block" />
          <img src="./assets/images/mastercard.svg" alt="" width={24} height={24} className="d-inline-block" />
          <span className="text-white smaller-text">Buy Crypto</span>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          {orderType=='limit' && 
          <>
            <label htmlFor={"basic-url"} className="form-label mb-1 d-flex justify-content-between text-1 text-light">
              <span>Price</span>
              <a className="text-light" role="button" onClick={()=>setPriceBuy(ask)}>Best Ask</a>
            </label>
            <div className="input-group input-group-sm mb-1">
              <input type="number" value={priceBuy} onChange={(e)=>setPriceBuy(e.currentTarget.value)} className="form-control bg-secondary text-white border-0" aria-label="Amount (to the nearest dollar)" />
              <span className="input-group-text bg-secondary text-light border-0">{selectedToken?.info.quote}</span>
            </div>
          </>
          }

          <label htmlFor={"basic-url"} className="form-label mb-1 d-flex justify-content-between text-1 text-light">
            <span>Amount</span>
            <span>
              <a className="text-light" role="button" style={{"padding":"3px"}} onClick={()=>setPercentBuy(0.25)}>25%</a>
              <a className="text-light" role="button" style={{"padding":"3px"}} onClick={()=>setPercentBuy(0.5)}>50%</a>
              <a className="text-light" role="button" style={{"padding":"3px"}} onClick={()=>setPercentBuy(0.75)}>75%</a>
              <a className="text-light" role="button" style={{"padding":"3px"}} onClick={()=>setPercentBuy(1)}>100%</a>
            </span>
          </label>
          <div className="input-group input-group-sm mb-1">
            <input type="number" value={amountBuy} onChange={(e)=>{setAmountBuyCall(e.currentTarget.value);}}  className="form-control bg-secondary text-white border-0" aria-label="Amount (to the nearest dollar)" />
            <span className="input-group-text bg-secondary text-light border-0">{selectedToken?.info.base}</span>
          </div>
          <label htmlFor={"basic-url"} className="form-label mb-1 d-flex justify-content-between text-1 text-light">
            <span>Total</span>
            <span>Avbl&nbsp;{balances.quote}{selectedToken?.info.quote}</span>

          </label>
          <div className="input-group input-group-sm mb-1">
            <input type="number"  readOnly = {true} value={totalBuy} className="form-control bg-secondary text-white border-0" aria-label="Amount (to the nearest dollar)" />
            <span className="input-group-text bg-secondary text-light border-0">{selectedToken?.info.quote}</span>
          </div>
          <div className="d-grid mt-3">
          {active==false &&
            <button className="btn btn-buy btn-sm" type="button" onClick={handleShow}>Connect Wallet</button>
          }
          {active &&
            <button className="btn btn-buy btn-sm" type="button" disabled={disabled || balances.quote<totalBuy} onClick={onBuy}>Buy {selectedToken?selectedToken.info.base:""}</button>
          }
          </div>
        </div>
        <div className="col-6">
        {orderType=='limit' && 
          <>
          <label htmlFor={"basic-url"} className="form-label mb-1 d-flex justify-content-between text-1 text-light">
            <span>Price</span>
            <a className="text-light"  role="button" onClick={()=>setPriceSell(bid)}>Best Bid</a>
          </label>
          <div className="input-group input-group-sm mb-1">
            <input type="number" value={priceSell} onChange={(e)=>setPriceSell(e.currentTarget.value)}  className="form-control bg-secondary text-white border-0" aria-label="Amount (to the nearest dollar)" />
            <span className="input-group-text bg-secondary text-light border-0">{selectedToken?.info.quote}</span>
          </div>
          </>
         }
          <label htmlFor={"basic-url"} className="form-label mb-1 d-flex justify-content-between text-1 text-light">
            <span>Amount</span>
            <span>
              <a className="text-light" role="button" onClick={()=>setPercentSell(0.25)} style={{"padding":"3px"}}>25%</a>
              <a className="text-light" role="button" onClick={()=>setPercentSell(0.5)} style={{"padding":"3px"}}>50%</a>
              <a className="text-light" role="button" onClick={()=>setPercentSell(0.75)} style={{"padding":"3px"}}>75%</a>
              <a className="text-light" role="button" onClick={()=>setPercentSell(1)}  style={{"padding":"3px"}}>100%</a>
            </span>
          </label>
          <div className="input-group input-group-sm mb-1">
            <input type="number" value={amountSell} onChange={(e)=>{setAmountSell(e.currentTarget.value);}} className="form-control bg-secondary text-white border-0" aria-label="Amount (to the nearest dollar)" />
            <span className="input-group-text bg-secondary text-light border-0">{selectedToken?.info.base}</span>
          </div>
          <label htmlFor={"basic-url"} className="form-label mb-1 d-flex justify-content-between text-1 text-light">
            <span>Total</span>
            <span>Avbl&nbsp;{balances.base}{selectedToken?.info.base}</span>
          </label>
          <div className="input-group input-group-sm mb-1">
            <input type="number"  readOnly = {true} value={totalSell} className="form-control bg-secondary text-white border-0" aria-label="Amount (to the nearest dollar)" />
            <span className="input-group-text bg-secondary text-light border-0">{selectedToken?.info.quote}</span>
          </div>
          <div className="d-grid mt-3">
            {active==false &&
            <button className="btn btn-sell btn-sm" type="button"  onClick={handleShow}>Connect Wallet </button>
            }
            {active &&
            <button className="btn btn-sell btn-sm" disabled={disabled || balances.base<amountSell} type="button" onClick={onSell}>Sell {selectedToken?selectedToken.info.base:""}</button>
            }

          </div>
        </div>
        <div className="col-1  pt-2">
          <i class="bi bi-gear-fill" role="button"  onClick={()=>setShowMore(!showMore)}></i>
         </div>
         {showMore && 
           <>
          <div className="col-11 ">
            <div className="row text-1 ">
              <div className="col-9 text-light  pt-2">
                <span>slip page</span>
                <a className="text-light" role="button" onClick={()=>setSlippagePractice(0.1)} style={{"padding":"3px"}}>0.1%</a>
                <a className="text-light" role="button" onClick={()=>setSlippagePractice(0.3)} style={{"padding":"3px"}}>0.3%</a>
                <a className="text-light" role="button" onClick={()=>setSlippagePractice(0.75)} style={{"padding":"3px"}}>0.75%</a>
                <a className="text-light" role="button" onClick={()=>setSlippagePractice(1)}  style={{"padding":"3px"}}>1%</a>
              </div>
            </div>
          </div>
          <div className="col-12 ">
            <div  className="row text-1 ">
              <div className="col-6">
                <div className="input-group input-group-sm mb-1">
                  <input type="number"  value={slippagePractice} className="form-control bg-secondary text-white border-0" aria-label="slippage" onChange={(e)=>setSlippagePractice(e.target.value)}/>
                  <span className="input-group-text bg-secondary text-light border-0">%</span>
                </div>
              </div>
            </div>
          </div>
          </>
         }


      </div>
        <Modal show={show} onHide={handleClose} 
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >      
        <Modal.Header closeButton 
          style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          }}>
            <Modal.Title>
            <h6 className="text-center flex-grow-1 text-white" >Connect Wallet</h6>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-none d-xl-block d-flex align-items-center justify-content-between m-3 p-3 bg-secondary" data-bs-dismiss="modal"  >
              <div role="button" onClick={connectMetamask}>
                <div>Metamask</div>
                <div className="fs-6 text-muted">
                  Available as a browser extension and as a mobile app, MetaMask equips you with a key vault, secure login, token wallet, and token exchange.
                </div>
              </div>
              <i className="bi bi-boxes text-warning fs-3" />
            </div>
            <div role="button" onClick={connectWalletConnect} className="d-flex align-items-center justify-content-between m-3 p-3 bg-secondary">
                <div>WalletConnect</div>
                <i className="bi bi-water text-primary fs-3"></i>
            </div>

            <div className="text-warning fs-6 p-3 text-end">
              Don't have a wallet? Click here.
            </div>
          </Modal.Body>
        </Modal>      
    </div>

  );
}

export default Trading;
