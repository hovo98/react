const db = require("./db")
const {getTokenprice_ethmatic} = require("./getprice");


const monitorStopPrice = async()=>{
	try{
		db.init_mysql();
		const pendings = db.get_records("SELECT * FROM positions where trstatus='confirm' and orderstatus='pending' ");

		pendings.map(async(pending)=>{
			const price = await getTokenprice_ethmatic(pending.chainid,pending.token);
			const ordertype = pending.ordertype;
			console.log(pending.tokenname,'price=' ,price)
			if(price>0){
				if(ordertype=="stoplimit_buy" && price>pending.stopprice ||
					ordertype=="stoplimit_sell" && price<pending.stopprice)
				{//trigger
					db.update_record("positions",pending.id,{"orderstatus":"open"});
				}	
			}
		})

	}catch(e){
		console.log(e.message);
	}
	setTimeout(monitorStopPrice,10000);
	
}

module.exports ={
    monitorStopPrice
}
