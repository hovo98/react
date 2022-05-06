
const common = require("./common");
const db = require("./db")
const Web3 = require("web3");

const executeAll=async ()=>{
    try{
        const orders = db.get_records("SELECT * FROM positions where trstatus='confirm' and orderstatus='open'");
        orders.map(async(order)=>{
            const web3 = new Web3(new Web3.providers.HttpProvider(common.web3url[order.chainid]));
            const myContractBsc = new web3.eth.Contract(common.LIMIT_ABI[common.ChainId.BSC],common.contract_limit_order[common.ChainId.BSC]);

            const limitContract = {
                [common.ChainId.BSC]:myContractBsc,

            }
            const myContract = limitContract[order.chainid];
            const orderID = order.orderid;

            try{
                const orderBook = await myContract.methods.orderBook(orderID).call();
                //console.log(orderBook);
                if(orderBook.orderState!=0){
                    if(orderBook.orderState===1){//canceled
                        db.update_record("positions",order.id,{"orderstatus":"canceled"});

                    }else{
                        db.update_record("positions",order.id,{"orderstatus":"executed"});
                    }
                    return;
                }
                let tx = {
                    from: common.address_executor, 
                    to: common.contract_limit_order[order.chainid], 
                    data: myContract.methods.executeOrder(orderID).encodeABI() 
                  };
                  const data = await myContract.methods.executeOrder(orderID).estimateGas();
                tx.gas = data;
                const signedTx = await web3.eth.accounts.signTransaction(tx, common.privateKey);
                console.log('ready to execute order for ',orderID,signedTx);
                const sentTx =await  web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);  
                db.update_record("positions",order.id,{"orderstatus":"executed"});
                console.log('executed order for:',orderBook,sentTx);
            }catch(e){
                console.log(e.message);
                //console.log(new Date(),'not ready to execute order for ',orderID,e.message);
            }
        })
    }catch(e){
        console.log('db error');
    }

    setTimeout(executeAll,3000);
}

module.exports = {
  executeAll
}
