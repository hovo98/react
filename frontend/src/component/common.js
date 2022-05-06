export  const fixedLength=(y)=> {
    let num = y;
    let prec = 6;
    while(num > 10) {
        num /= 10;
        prec--;
    }
    return y.toFixed(prec);
  }

export const adjustDate =(dString)=>{
	return(dString.replace('T'," ").substring(0,19));
}