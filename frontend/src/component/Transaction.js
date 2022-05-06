import useSharedState from '../hook/useSharedState'
import React ,{useState,useEffect,useCallback,useMemo} from "react";
import io from 'socket.io-client';


function Tradehistory() {

  const {selectedToken,setSelectedToken}=useSharedState();//useState(undefined);
  const [transactions,setTransactions]=React.useState([]);//useState(undefined);
  const [showtr,setShowTr]=useState(true);//useState(undefined);
  
  useEffect(() => {
      let socket=undefined;
      const init=async()=>{
        const prefix = window.location.protocol+"//"+window.location.hostname;
        const url = prefix+"/api/getdata?op=transactions&symbol="+selectedToken.symbol;
        const response = await fetch(url);
        const rdata = await response.json();
        setTransactions(rdata);
        if(!socket){
          socket = io(prefix);
        }else{
          socket.leaveAll();
        }
        socket.emit("join",selectedToken.info.symbol);
        socket.on("transactions", function(data) {
            setTransactions(data);
        });
      }
      if(selectedToken) init();
      return () => {
        if (socket) {
          socket.disconnect();
        }
      }
  }, [selectedToken]) 
  const changeShow=(e)=>{
    setShowTr(!showtr);    
  }
  return (
      <>
                <div className="d-flex justify-content-between align-items-center mt-2 mb-2" role="button" 
                  onClick={changeShow}>
                  <span className="text-warning text-1">Trading History</span>
                  <i className="bi bi-chevron-down" />
                </div>
                { showtr &&
                  <div className="table-responsive">
                    <table className="table text-white table-sm table-borderless">
                      <thead className="text-muted">
                        <tr>
                          <th scope="col">Price</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!transactions || transactions.length==0 &&
                          <tr>
                            <td colSpan="3">Loading...</td>
                          </tr>
                        }

                        {transactions?.map((transaction,idx)=>(
                          <tr key={idx}>
                            <td className={transaction.isbuy?"text-success":"text-danger"}>{transaction.price}</td>
                            <td>{transaction.amount}</td>
                            <td>{(new Date(transaction.time)).toLocaleTimeString()}</td>
                          </tr>
                         ))}
                      </tbody>
                    </table>
                  </div>                }

      </>
  );
}

export default Tradehistory;
