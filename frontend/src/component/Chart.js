import useSharedState from '../hook/useSharedState'
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import React ,{useState,useEffect,useRef,useCallback,useMemo} from "react";

function Chart() {
  const fixedLength=(y)=> {
    let num = y;
    let prec = 6;
    while(num > 10) {
        num /= 10;
        prec--;
    }
    return y.toFixed(prec);
  }

  const {selectedToken,setSelectedToken,long,setLong,ask,setAsk,tokensList}=useSharedState();//useState(undefined);
  
  return (
    <div className={"order-1 order-lg-2 text-white widget-header "+((!selectedToken || selectedToken.info.listed)?"col-lg-8 col-12":"col-lg-10 col-12")} style={{"paddingBottom":"15px"}} >
      <div className="d-flex d-lg-none justify-content-between align-items-center p-1 text-2">
        <div className="d-flex flex-column">
          <div className="btn-group">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="pairs" data-bs-toggle="dropdown" aria-expanded="false">
              {selectedToken?(selectedToken.info.base+" / "+selectedToken.info.quote):""} 
            </button>
            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="pairs">
            {tokensList.map((token,idx)=>(
              <li key={idx}>
                <a className="dropdown-item" role="button" onClick={()=>setSelectedToken(token)}>
                  <span className="text-white">{token.info.base+" / "+token.info.quote}</span>
                </a>
              </li>
            ))}
              
            </ul>
          </div>
          <span className={long?"text-success":"text-danger"} >{fixedLength(ask)}
                    <i className={"bi bi-arrow-"+(long?"up":"down")} /></span>
          <span className={(selectedToken?.priceBNBChange>0?" text-success":"text-danger")}>{selectedToken?.priceBNBChange>0?"+":""}{selectedToken?.priceBNBChange.toFixed(2)}%&nbsp;
            <span className="text-white ms-2">Vol&nbsp;
              {selectedToken?selectedToken.volumeUSD.toFixed(0):0} USD
            </span>
          </span>
        </div>
        { false && 
        <div className="d-flex flex-column">
          <span className="text-muted">High <span className="text-white ms-2">42210.0</span></span>
          <span className="text-muted">Low&nbsp; <span className="text-white ms-2">32210.0</span></span>
        </div>
        }
      </div>
      <div className="d-none d-lg-flex align-items-center p-1 text-2">
        <div className="d-flex flex-column me-3">
          <span className="fs-5">{selectedToken?(selectedToken.info.base+" / "+selectedToken.info.quote):""} </span>
        </div>
        <div className="d-flex flex-column me-3">
          <span className="text-muted">Last Price</span>
          <span className={long?"text-success":"text-danger"}>
                    {fixedLength(ask)}
                    <i className={"bi bi-arrow-"+(long?"up":"down")} />
          </span>
        </div>
        <div className="d-flex flex-column me-3">
          <span className="text-muted">24h change</span>
          <span className={(selectedToken?.priceBNBChange>0?" text-success":"text-danger")}>
            {selectedToken?.priceBNBChange>0?"+":""}{selectedToken?.priceBNBChange.toFixed(2)}%
          </span>
        </div>
        {false &&
          <>
        <div className="d-flex flex-column me-3">
          <span className="text-muted">24h High</span>
          <span className="text-white">
            43128.2
          </span>
        </div>
        <div className="d-flex flex-column me-3">
          <span className="text-muted">24h Low</span>
          <span className="text-white">
            42210.0
          </span>
        </div>
        </>
        }
        <div className="d-flex flex-column">
          <span className="text-muted">24h Volume</span>
          <span className="text-white">
            {selectedToken?selectedToken.volumeUSD.toFixed(0):0} USD
          </span>
        </div>

      </div>
      <div className="tradingview-widget-container" style={{"height":"450px"}}>
        <TradingViewWidget 
            symbol={selectedToken?(selectedToken.info.listed?(selectedToken.info.base+selectedToken.info.quote):"BNBUSDT"):"BNBUSDT"} 
            theme={Themes.DARK}
            interval = "60"
            locale="us"
            autosize
            allow_symbol_change={false}
            hide_legend={true}
        />   
      </div>
    </div>
  );
}

export default Chart;
