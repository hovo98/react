import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import Swap from './component/swap'
import Router from './component/router';
import Headersmall from './component/headersmall';
import Headernorm from './component/headernorm';
import Footer from './component/footer';

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App() {
  return (
  <Web3ReactProvider getLibrary={getLibrary}>
      <div>
        <div className="main__wallet dark__theme">
          <Headersmall/>
          <Headernorm/>
          <div className="main__wrapper">
            <div className="head__main">
              <h6>Multi-chain Dex Smart Routing</h6>
              <p>Total Trade Volume: <span>$210,481,891</span></p>
            </div>
            <div className="double__main">
              <Router/>
              <Swap/>
            </div>
            <Footer/>
          </div>
        </div>
      </div>  
  </Web3ReactProvider>
  );
}

export default App;
