import WebSocket from 'ws';

const ws = new WebSocket('wss://stream.binance.com:9443/ws/BNBBTC@depth20');

ws.on('message', function incoming(data:any) {
	const trade = JSON.parse(data);
    console.log(trade);
});