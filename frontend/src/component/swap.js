
import useSharedState from '../hook/useSharedState'
import React ,{useState,useEffect,useCallback,useMemo} from "react";

import { RangoClient } from "rango-sdk"
import {RANGO_API_KEY,supportChain} from "./config"
import axios from 'axios';
import $ from 'jquery';

function Swap() {
  
  const {
    swapInfo, setSwapInfo,
    blockchains,setBlockChain,
    swapper, setSwapper, 
    tokens, setTokens} = useSharedState();
  
  const rangoClient = new RangoClient(RANGO_API_KEY);
  
  const [fromChain,setFromChain]=useState("BSC");
  const [targetChain,setTargetChain]=useState("BSC");
  const [fromToken,setFromToken]=useState(undefined);
  const [targetToken,setTargetToken]=useState(undefined);
  const [fromAmount,setFromAmount]=useState(0);
  const [targetAmount,setTargetAmount]=useState(0);
  const [fromBalance,setFromBalance]=useState(0);
  const [targetBalance,setTargetBalance]=useState(0);
    
  const filterdToken = (chain)=>{
    const f = tokens.filter((token)=>{
      return token.blockchain == chain; 
    })   
    const d = f.sort((a,b)=>a.symbol.toLowerCase()>b.symbol.toLowerCase()?1:-1)
    return d; 
  }
  const isSupportChain = (chainname)=>{
    for(let i=0;i<supportChain.length;i++){
        if(supportChain[i]== chainname) return(true);
    }
    return(false);
  }
  useEffect(()=>{
    setTargetToken(undefined);
  },[targetChain])
  
  useEffect(()=>{
    setTargetAmount(0);
  },[targetToken])

  useEffect(()=>{
    setFromToken(undefined);
  },[fromChain])
  useEffect(()=>{
    setFromAmount(0);
  },[fromToken])
 
 const timeout = React.useRef(null);
 const updateRoute = ()=>{
   const newSwapInfo = {...swapInfo};
   newSwapInfo.fromToken = fromToken;
   newSwapInfo.targetToken = targetToken;
   newSwapInfo.fromChain = fromChain;
   newSwapInfo.targetChain = targetChain;
   newSwapInfo.fromAmount = fromAmount;
   newSwapInfo.targetAmount = targetAmount;
   setSwapInfo(newSwapInfo);
 }
 const onChangeHandler = (value,isFrom) => {
   clearTimeout(timeout.current);
   if(isFrom){
     setFromAmount(value);
   }else{
     setTargetAmount(value);
   }
   timeout.current = setTimeout(()=>{
      updateRoute()
   }, 2000);
 }


  const revert =()=>{
    const _fromChain = fromChain;
    const _fromToken = fromToken;
    const _fromAmount = fromAmount;
    const _targetChain = targetChain;
    const _targetToken = targetToken;
    const _targetAmount = targetAmount;
    
    setFromChain(_targetChain);
    setFromToken(_targetToken);
    setFromAmount(_targetAmount);

    setTargetChain(_fromChain);
    setTargetToken(_fromToken);
    setTargetAmount(_fromAmount);

  }
  useEffect(()=>{
    const process = async()=>{
      const rt = await axios.get('https://beta.tide.exchange/api/metadata')
      if(rt.data){
        
        let newchain = [];
        rt.data.blockchains.forEach((chaindata)=>{
          if(isSupportChain(chaindata.name)){
            newchain.push(chaindata)
          }
        })
        setBlockChain(newchain);
        let newTokens = [];
        rt.data.tokens.forEach((token)=>{
          if(isSupportChain(token.blockchain)){
            newTokens.push(token)
          }
        })
        setTokens(newTokens);
        setSwapper(rt.data.swappers);
        console.log({newchain,newTokens,swap:rt.data.swappers});

      }
    }
    process();
  },[]);


  return (
              <div className="swap__main">
                <div className="swap__top">
                  <h2>Swap in 30+ Blockchains <span>Instantly</span></h2>
                  <div className="swap__buttons">
                    <a role="button">5 Gwei <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M32 64C32 28.65 60.65 0 96 0H256C291.3 0 320 28.65 320 64V256H328C376.6 256 416 295.4 416 344V376C416 389.3 426.7 400 440 400C453.3 400 464 389.3 464 376V221.1C436.4 214.9 416 189.8 416 160V96L384 64C375.2 55.16 375.2 40.84 384 32C392.8 23.16 407.2 23.16 416 32L493.3 109.3C505.3 121.3 512 137.5 512 154.5V376C512 415.8 479.8 448 440 448C400.2 448 368 415.8 368 376V344C368 321.9 350.1 303.1 328 303.1H320V448C337.7 448 352 462.3 352 480C352 497.7 337.7 512 320 512H32C14.33 512 0 497.7 0 480C0 462.3 14.33 448 32 448V64zM96 176C96 184.8 103.2 192 112 192H240C248.8 192 256 184.8 256 176V80C256 71.16 248.8 64 240 64H112C103.2 64 96 71.16 96 80V176z" /></svg></span></a>
                    <a role="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z" /></svg></a>
                  </div>
                </div>
                <div className="swap__fields">
                  <div className="swap__field">
                    <div className="head__swap--field">
                      <span>You Pay:</span>
                      <span className="nav-link dropdown-toggle" role="button" 
                        id="network" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span>{fromChain}</span>
                      </span>
                      <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="network">
                        {supportChain.map((chain,idx)=>(
                          <li key={idx}><a className="dropdown-item" role="button" onClick={()=>{setFromChain(chain)}}> {chain}</a></li>
                        ))}
                      </ul>

                    </div>
                    <div className="swap__input">
                      <div className="top__input">
                        <div className="dropdown__input">
                          <a role="button">
                            {fromToken && 
                              <>
                                <span className="dropdown__logo"><img src="img/logo2.webp" alt="logo" /></span>
                                <span className="text__dropdown">{fromToken.symbol}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z" /></svg>
                              </>
                            }
                            {fromToken==undefined && 
                              <>
                                <span className="text__dropdown">select</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z" /></svg>
                              </>
                            }

                            </a>
                          <div className="dropdown__box" style={{display: 'none'}}>
                          <ul>
                              {(filterdToken(fromChain)).map((token,idx)=>(
                                <li key={idx}><a role="button" onClick={()=>{$('.dropdown__box').css("display" , "none");setFromToken(token)}}><span className="logo__crypto"><img src={token.image} alt="logo" /></span> <span className="text__drop">{token.symbol}</span></a></li>
                              ))}
                           </ul>

                          </div>
                        </div>
                        <input type="text" value={fromAmount} onChange={(e)=>onChangeHandler(e.currentTarget.value,true)}/>
                      </div>
                      <div className="bottom__input">
                        <p>Balance: {fromBalance} {fromToken?.symbol}</p>
                        <a role="button">Select Max</a>
                      </div>
                    </div>
                  </div>
                  <div className="swap__button">
                    <a role="button" onClick={revert}><svg width={15} height={20} xmlns="http://www.w3.org/2000/svg" className="fill-gray-4 group-hocus:fill-gray-8"><path fillRule="evenodd" clipRule="evenodd" d="M.673 3.382L3.903.164a.57.57 0 01.81.011l3.23 3.219a.573.573 0 01-.405.984H5.466v6.957c0 .637-.521 1.158-1.158 1.158a1.161 1.161 0 01-1.158-1.158v-6.97H1.078c-.51 0-.776-.624-.405-.983zm9.667 16.453l-3.23-3.218a.573.573 0 01.405-.984h2.072V8.675c0-.637.521-1.158 1.158-1.158.637 0 1.158.521 1.158 1.158v6.958h2.083c.51 0 .776.625.405.984l-3.23 3.218a.594.594 0 01-.821 0z" /></svg></a>
                  </div>
                  <div className="swap__field">
                    <div className="head__swap--field">
                      <span>You Receive:</span>  
                      <span className="nav-link dropdown-toggle" role="button" 
                        id="tonetwork" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span>{targetChain}</span>
                      </span>
                      <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="tonetwork">
                        {supportChain.map((chain,idx)=>(
                          <li key={idx}><a className="dropdown-item" role="button" onClick={()=>{setTargetChain(chain)}}> {chain}</a></li>
                        ))}
                      </ul>
                    </div>
                    <div className="swap__input">
                      <div className="top__input">
                        <div className="dropdown__input">
                          <a role="button">
                            {targetToken && 
                              <>
                                <span className="dropdown__logo"><img src="img/logo3.png" alt="logo" /></span> 
                                <span className="text__dropdown">{targetToken.symbol}</span> 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z" /></svg>
                              </>
                            }
                            {targetToken==undefined && 
                              <>
                                <span className="text__dropdown">select</span> 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z" /></svg>
                              </>
                            }
                          </a>
                          <div className="dropdown__box" style={{display: 'none'}}>
                            <ul>
                              {(filterdToken(targetChain)).map((token,idx)=>(
                                <li key={idx}><a role="button" onClick={()=>{$('.dropdown__box').css("display" , "none");setTargetToken(token)}}><span className="logo__crypto"><img src={token.image} alt="logo" /></span> <span className="text__drop">{token.symbol}</span></a></li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <input type="text" value={targetAmount} onChange={(e)=>onChangeHandler(e.currentTarget.value,false)}/>
                      </div>
                      <div className="bottom__input">
                        <p>Balance: {targetBalance} {targetToken?.symbol}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swap__submit">
                  <input type="submit" defaultValue="Swap" />
                </div>
              </div>    
  );
}

export default Swap;
