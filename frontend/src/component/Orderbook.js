import useSharedState from '../hook/useSharedState'
import React ,{useState,useEffect,useCallback,useMemo} from "react";
import io from 'socket.io-client';

const orderbookcount =9;

function Orderbook() {
  const {selectedToken,setSelectedToken,bnbPrice,long,setLong,ask,setAsk,setBid}=useSharedState();//useState(undefined);
  const [orderbook,setOrderbook]=useState({});//useState(undefined);
  const fixedLength=(y)=> {
    let num = y;
    let prec = 6;
    while(num > 10) {
        num /= 10;
        prec--;
    }
    return y.toFixed(prec);
  }
  const getPercent = (lst,value,start,end)=>{

    let max = Number(lst[0][1]);
    let min = Number(lst[0][1]);
    for(let i=start;i<=end;i++){
      const order = lst[i];
      if(max<Number(order[1])) max = Number(order[1]);
      if(min>Number(order[1])) min = Number(order[1]);

    }
    let percent = max==min?0:(Number(value)-min)/(max-min);
    percent = Math.floor(percent*4) *25;
    // if(window.innerWidth > 992) {
    //   percent=percent/6;
    // }else{
    //   percent=percent/2;
    // }
    //if(window.innerWidth <= 760) percent=percent/2;

    return(percent)

  }
  const getUsdValue = (ask)=>{
    let value =0;
    if(selectedToken.info.quote=="BNB"){
      value = Number(ask)*bnbPrice;
    }else{
      value = bnbPrice;
    }
    return(value);
  }
  useEffect(() => {
      let socket=undefined;
      const init=async()=>{
        setOrderbook({});
        const prefix = window.location.protocol+"//"+window.location.hostname;
        const url = prefix+"/api/getdata?op=orderbook&symbol="+selectedToken.symbol;
        const response = await fetch(url);
        const rdata = await response.json();
        setOrderbook(rdata);
        setAsk(Number(rdata.asks[0][0]));
        setBid(Number(rdata.bids[0][0]));
        
        if(!socket){
          socket = io(prefix);
        }else{
          socket.leaveAll();
        }
        socket.emit("join",selectedToken.info.symbol);
        socket.on("orderbook", function(data) {
            setAsk((ask)=>{
              setLong(ask<=Number(data.asks[0][0]));
              return Number(data.asks[0][0])
            });
            setBid((bid)=>Number(data.bids[0][0]));
            setOrderbook(data);
        });
      }
      if(selectedToken) init();
      return () => {
        if (socket) {
          socket.disconnect();
        }
      }
  }, [selectedToken]) 

  return (
  <div className="order-3 order-lg-3 col-12 col-lg-2 p-1 bg-dark text-white" style={{"position":"relative"}}>
      <div className="d-none d-xl-block">
        <ul className="nav nav-pills mb-1 " id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link bg-transparent" id="pills-graph-tab" data-bs-toggle="pill" data-bs-target="#pills-graph" type="button" role="tab" aria-controls="pills-graph" aria-selected="false">
              <i className="bi bi-graph-up text-white" />
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link bg-transparent" id="pills-graph-up-tab" data-bs-toggle="pill" data-bs-target="#pills-graph-up" type="button" role="tab" aria-controls="pills-graph-up" aria-selected="false">
              <i className="bi bi-graph-up-arrow text-success" />
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link bg-transparent" id="pills-graph-down-tab" data-bs-toggle="pill" data-bs-target="#pills-graph-down" type="button" role="tab" aria-controls="pills-graph-down" aria-selected="false">
              <i className="bi bi-graph-down-arrow text-danger" />
            </button>
          </li>
        </ul>
      </div>
      {orderbook.bids && 
      <div className="tab-content" id="pills-graph-tabContent" style={{"position":"relative"}}>
        <div style={{"position":"relative"}} className="tab-pane fade show active" id="pills-graph" role="tabpanel" aria-labelledby="pills-graph-tab">
          <div className="row">
          <div className="xl-6 col-6 col-lg-12" style={{"position":"relative"}}>
            <div className="table-responsive" style={{"position":"relative"}}>
              <table style={{"position":"relative"}} className="table text-white table-sm table-borderless">
                <thead className="text-muted">
                  <tr>
                    <th scope="col">Price</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody style={{"position":"relative"}}>
                  { 
                    (function (rows, i, len) {
                      if(orderbook.asks){
                        while (i < len) {
                          rows.push(
                            <tr key={i}  className="relativetr">
                              <td className="text-danger">{fixedLength(Number(orderbook.asks[len-i-1][0]))}</td>
                              <td>{fixedLength(Number(orderbook.asks[len-i-1][1]))}</td>
                              <td>{fixedLength(Number(orderbook.asks[len-i-1][1])*Number(orderbook.asks[len-i-1][0]))}</td>
                              <td className="tr-shadow" style={{"background": "rgba(234, 0, 112, 0.15)", "width": getPercent(orderbook.asks,orderbook.asks[len-i-1][1],0,orderbookcount-1)+"%"}}></td>
                            </tr>
                          );
                          i++;
                        }
                      }
                      return rows;
                    })([], 0, orderbookcount)
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-6 col-lg-12 d-none d-xl-block">
            <div className="table-responsive">
              <table className="table text-white table-sm table-borderless">
                <tbody>
                  <tr>
                    <td className={"h6 "+(long?"text-success":"text-danger")}>
                      {orderbook.asks ? fixedLength(Number(orderbook.asks[0][0])):""}
                      <i className={"bi bi-arrow-"+(long?"up":"down")} />
                    </td>
                    <td className="h6 text-warning">
                      ${orderbook.bids ? fixedLength(getUsdValue(orderbook.bids[0][0])):0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="xl-6 col-6 col-lg-12" style={{"position":"relative"}}>

            <div className="table-responsive" style={{"position":"relative"}}>
              <table className="table text-white table-sm table-borderless" style={{"position":"relative"}}>
                <thead className="text-muted">
                  <tr>
                    <th scope="col">Price</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody style={{"position":"relative"}}>
                  { 
                    (function (rows, i, len) {
                      if(orderbook.bids){
                        while (i < len) {
                          rows.push(
                            <tr key={i} style={{"position": "relative"}}>
                              <td className="text-success">{fixedLength(Number(orderbook.bids[i][0]))}</td>
                              <td>{fixedLength(Number(orderbook.bids[i][1]))}</td>
                              <td>{fixedLength(Number(orderbook.bids[i][1])*Number(orderbook.bids[i][0]))}</td>
                              <td className="tr-shadow" style={{"background": "rgba(0, 192, 135, 0.15)", "width": getPercent(orderbook.bids,orderbook.bids[i][1],0,orderbookcount-1)+"%"}}></td>
                            </tr>
                          );
                          i++;
                        }
                      }
                      return rows;
                    })([], 0, orderbookcount)
                  }
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-graph-down" role="tabpanel" aria-labelledby="pills-graph-down-tab">
          <div className="table-responsive">
            <table className="table text-white table-sm table-borderless">
              <thead className="text-muted">
                <tr>
                  <th scope="col">Price</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                { 
                  (function (rows) {
                    if(orderbook.asks){
                      const len = orderbook.asks.length;
                      let i=0;
                      while (i < len) {
                        rows.push(
                          <tr key={i}  style={{"position": "relative"}}>
                            <td className="text-danger">{fixedLength(Number(orderbook.asks[len-i-1][0]))}</td>
                            <td>{fixedLength(Number(orderbook.asks[len-i-1][1]))}</td>
                            <td>{fixedLength(Number(orderbook.asks[len-i-1][1])*Number(orderbook.asks[len-i-1][0]))}</td>
                            <td className="tr-shadow" style={{"background": "rgba(234, 0, 112, 0.15)", "width": getPercent(orderbook.asks,orderbook.asks[len-i-1][1],0,orderbook.asks.length-1)+"%"}}></td>
                          </tr>
                        );
                        i++;
                      }
                    }
                    return rows;
                  })([])
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-graph-up" role="tabpanel" aria-labelledby="pills-graph-up-tab">
          <div className="table-responsive">
            <table className="table text-white table-sm table-borderless">
              <thead className="text-muted">
                <tr>
                  <th scope="col">Price</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                { 
                  (function (rows, i, len) {
                    if(orderbook.bids){
                      const len =  orderbook.bids.length;
                      let i=0;

                      while (i < len) {
                        rows.push(
                          <tr key={i}  style={{"position": "relative"}}>
                            <td className="text-success">{fixedLength(Number(orderbook.bids[i][0]))}</td>
                            <td>{fixedLength(Number(orderbook.bids[i][1]))}</td>
                            <td>{fixedLength(Number(orderbook.bids[i][1])*Number(orderbook.bids[i][0]))}</td>
                            <td className="tr-shadow" style={{"background": "rgba(0, 192, 135, 0.15)", "width": getPercent(orderbook.bids,orderbook.bids[i][1],0,orderbook.asks.length-1)+"%"}}></td>

                          </tr>
                        );
                        i++;
                      }
                    }
                    return rows;
                  })([], 0, 6)
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      }
    </div>
  );
}

export default Orderbook;
