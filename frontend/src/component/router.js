import useSharedState from '../hook/useSharedState'
import React ,{useState,useEffect,useCallback,useMemo} from "react";

import { RangoClient } from "rango-sdk"
import {RANGO_API_KEY,supportChain} from "./config"
import axios from 'axios';


function Router() {
  
  const {
    swapInfo, setSwapInfo
  } = useSharedState();

  useEffect(()=>{

    const processCall = async()=>{
      const swapParam = {
        amount: "1",
        from: {"blockchain": "BSC", "symbol": "BNB", "address": null},
        to: {"blockchain": "TERRA", "symbol": "Luna", "address": null},
        checkPrerequisites: false,
        connectedWallets: [
            {blockchain: "TERRA", addresses: ["terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe"]},
            {blockchain: "BSC", addresses: ["0xeae6d42093eae057e770010ffd6f4445f7956613"]}
        ],
        selectedWallets: {
            "TERRA": "terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe",
            "BSC": "0xeae6d42093eae057e770010ffd6f4445f7956613",
        }        
      }
      const rt = await axios.post('https://beta.tide.exchange/api/routing',JSON.stringify(swapParam),{
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      })
      console.log(rt);
    }
    if(swapInfo.fromToken && swapInfo.fromAmount>0 && swapInfo.targetToken) processCall();
  },[swapInfo])
  return (
              <div className="bridge__wrapper">
                <div className="bridge__elements">
                  <div className="el__bridge">
                    <span><img src="img/incch.png" alt="inch" /></span>
                    <h6>1Inch</h6>
                    <p>Fee ≈ 1.62$</p>
                    <p>Time ≈ 00:30</p>
                  </div>
                  <div className="el__bridge">
                    <span><img src="img/incch.png" alt="inch" /></span>
                    <h6>cBridge</h6>
                    <p>Fee ≈ 0.15$</p>
                    <p>Time ≈ 08:00</p>
                  </div>
                </div>
                <div className="bridge__tokens">
                  <div className="bridge__token">
                    <span><img src="img/logo1.svg" alt="logo" /></span>
                    <h6>BTC</h6>
                    <p>BTC</p>
                  </div>
                  <div className="bridge__spacer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{/*! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. */}<path d="M504.3 273.6l-112.1 104c-6.992 6.484-17.18 8.218-25.94 4.406c-8.758-3.812-14.42-12.45-14.42-21.1L351.9 288H32C14.33 288 .0002 273.7 .0002 255.1S14.33 224 32 224h319.9l0-72c0-9.547 5.66-18.19 14.42-22c8.754-3.809 18.95-2.075 25.94 4.41l112.1 104C514.6 247.9 514.6 264.1 504.3 273.6z" /></svg>
                  </div>
                  <div className="bridge__token">
                    <span><img src="img/logo2.webp" alt="logo" /></span>
                    <h6>BNB</h6>
                    <p>BSC</p>
                  </div>
                  <div className="bridge__spacer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{/*! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. */}<path d="M504.3 273.6l-112.1 104c-6.992 6.484-17.18 8.218-25.94 4.406c-8.758-3.812-14.42-12.45-14.42-21.1L351.9 288H32C14.33 288 .0002 273.7 .0002 255.1S14.33 224 32 224h319.9l0-72c0-9.547 5.66-18.19 14.42-22c8.754-3.809 18.95-2.075 25.94 4.41l112.1 104C514.6 247.9 514.6 264.1 504.3 273.6z" /></svg>
                  </div>
                  <div className="bridge__token">
                    <span><img src="img/logo3.png" alt="logo" /></span>
                    <h6>USDT</h6>
                    <p>ETH</p>
                  </div>
                </div>
                <div className="bridge__info">
                  <div className="elem__bridge">
                    <div className="textline">
                      <p>1 BNB = 373.2 USDC</p>
                    </div>
                    <div className="textline">
                      <p>Total Fee: ≈ $1.77 </p>
                      <div className="info__icon">
                        <span className="info__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s13.1-32 32-32c17.1 0 32 14 32 32S273.1 400 256 400zM325.1 258L280 286V288c0 13-11 24-24 24S232 301 232 288V272c0-8 4-16 12-21l57-34C308 213 312 206 312 198C312 186 301.1 176 289.1 176h-51.1C225.1 176 216 186 216 198c0 13-11 24-24 24s-24-11-24-24C168 159 199 128 237.1 128h51.1C329 128 360 159 360 198C360 222 347 245 325.1 258z" /></svg></span>
                        <div className="info__dropdown">
                          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates quibusdam distinctio, optio ipsum quisquam, iure tenetur nihil repudiandae maiores incidunt.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="elem__bridge">
                    <div className="textline">
                      <p>1 USDC = 0.0027 BNB</p>
                    </div>
                    <div className="textline">
                      <p>Estimated Arrival Time: ≈ 8:30 </p>
                      <div className="info__icon">
                        <span className="info__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s13.1-32 32-32c17.1 0 32 14 32 32S273.1 400 256 400zM325.1 258L280 286V288c0 13-11 24-24 24S232 301 232 288V272c0-8 4-16 12-21l57-34C308 213 312 206 312 198C312 186 301.1 176 289.1 176h-51.1C225.1 176 216 186 216 198c0 13-11 24-24 24s-24-11-24-24C168 159 199 128 237.1 128h51.1C329 128 360 159 360 198C360 222 347 245 325.1 258z" /></svg></span>
                        <div className="info__dropdown">
                          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates quibusdam distinctio, optio ipsum quisquam, iure tenetur nihil repudiandae maiores incidunt.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>    
  );
}

export default Router;
