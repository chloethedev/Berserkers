import React, { useEffect, useState } from 'react';
import Berserkers from './contracts/Berserkers.json';
import { getWeb3 } from './utils.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [user, setUser] = useState(undefined)
  const [totalSupplyStake, setTotalSupplyStake] = useState(undefined);
  const [auctionStartTime0, setAuctionStartTime0] = useState(undefined);
  const [auctionStartTime1, setAuctionStartTime1] = useState(undefined);
  const [auctionStartTime2, setAuctionStartTime2] = useState(undefined);
  const [unitsLeftForSale0, setUnitsLeftForSale0] = useState(undefined);
  const [unitsLeftForSale1, setUnitsLeftForSale1] = useState(undefined);
  const [unitsLeftForSale2, setUnitsLeftForSale2] = useState(undefined);
  const [unitsPrice0, setUnitsPrice0] = useState(undefined);
  const [unitsPrice1, setUnitsPrice1] = useState(undefined);
  const [unitsPrice2, setUnitsPrice2] = useState(undefined);
  const [unitsOwned0, setUnitsOwned0] = useState(undefined);
  const [unitsOwned1, setUnitsOwned1] = useState(undefined);
  const [unitsOwned2, setUnitsOwned2] = useState(undefined);


  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Berserkers.networks[networkId];
      const contract = new web3.eth.Contract(
        Berserkers.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const user = accounts[0];

      const totalSupplyStake = await contract.methods
        .totalSupplyStake()
        .call();

      const auctionStartTime0 = await contract.methods
        .auctionStartTime(0)
        .call();
      
      const auctionStartTime1 = await contract.methods
        .auctionStartTime(1)
        .call();

      const auctionStartTime2 = await contract.methods
        .auctionStartTime(2)
        .call();

      const unitsLeftForSale0 = await contract.methods
        .unitsLeftForSale(0)
        .call();

      const unitsLeftForSale1 = await contract.methods
        .unitsLeftForSale(1)
        .call();

      const unitsLeftForSale2 = await contract.methods
        .unitsLeftForSale(2)
        .call();

      const unitsPrice0  = web3.utils.fromWei(await contract.methods
        .unitsPrice(0)
        .call(), 'ether');

      const unitsPrice1 = web3.utils.fromWei(await contract.methods
        .unitsPrice(1)
        .call(), 'ether');

      const unitsPrice2 = web3.utils.fromWei(await contract.methods
        .unitsPrice(2)
        .call(), 'ether');

      const unitsOwned0 = await contract.methods
        .unitsOwned(accounts[0], 0)
        .call();

      const unitsOwned1 = await contract.methods
        .unitsOwned(accounts[0], 1)
        .call();

      const unitsOwned2 = await contract.methods
        .unitsOwned(accounts[0], 2)
        .call();

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setUser(user);
      setTotalSupplyStake(totalSupplyStake);
      setAuctionStartTime0(auctionStartTime0);
      setAuctionStartTime1(auctionStartTime1);
      setAuctionStartTime2(auctionStartTime2);
      setUnitsLeftForSale0(unitsLeftForSale0);
      setUnitsLeftForSale1(unitsLeftForSale1);
      setUnitsLeftForSale2(unitsLeftForSale2);
      setUnitsPrice0(unitsPrice0);
      setUnitsPrice1(unitsPrice1);
      setUnitsPrice2(unitsPrice2);
      setUnitsOwned0(unitsOwned0);
      setUnitsOwned1(unitsOwned1);
      setUnitsOwned2(unitsOwned2);

    }
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
    }, []);

    useEffect(() => {
      if(isReady()) {
        // updateSoldiers();
      }
    }, [accounts, contract, web3,]);

  const isReady = () => {
    return (
      typeof contract !== 'undefined' 
      && typeof web3 !== 'undefined'
      && typeof accounts !== 'undefined'
    );
  }

  async function DutchAuctionBuy(e) {
    e.preventDefault();
    await contract.methods
      .DutchAuctionBuy(0)
      .send(
        {from:accounts[0]}
      );
  }

  async function DutchAuctionBuy1(e) {
    e.preventDefault();
    await contract.methods
      .DutchAuctionBuy(1)
      .send(
        {from: accounts[0]}
      );
  }

  async function DutchAuctionBuy2(e) {
    e.preventDefault();
    await contract.methods
      .DutchAuctionBuy(2)
      .send(
        {from: accounts[0]}
      );
  }

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center">Welcome to Berserkers</h1>
      <h5 className="text-center">{user}</h5>

    <hr/>
      <div className="row">
        <div className="col-sm-12">
          <h2>Cavalry</h2>
          <h4>Auction Start Time for Horse Riders: {(new Date(parseInt(auctionStartTime0)*1000)).toLocaleString()}</h4>
            <form>
              <div className="form-group">
                <label htmlFor="cavalry">Price: {unitsPrice0} ETH </label>
                <p>Units left for sale: {unitsLeftForSale0}</p>
                <p>You have {unitsOwned0} Cavalry </p>
                <button onClick={e => DutchAuctionBuy(e)} type="submit" className="btn btn-primary">Purchace 1000 Horsies</button>
              </div>
          </form>
        </div>
      </div>

      <hr/>
      
      <div className="row">
        <div className="col-sm-12">
          <h2>Swordsmen</h2>
          <h3>Auction Start Time for Sword Swingers: {(new Date(parseInt(auctionStartTime1)*1000)).toLocaleString()}</h3>
          <form>
            <div className="form-group">
              <label htmlFor="swordsmen">Price: {unitsPrice1} ETH </label>
              <p>Units left for sale: {unitsLeftForSale1}</p>
              <p>You have {unitsOwned1} Swordsmen </p>
            </div>
            <button onClick={e => DutchAuctionBuy1(e)} type="submit" className="btn btn-primary">Purchace 1000 Swordswingers</button>
          </form>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col-sm-12">
          <h2>Pikemen</h2>
          <h3>Auction Start Time for Pike Pokers: {(new Date(parseInt(auctionStartTime2)*1000)).toLocaleString()}</h3>
          <form>
            <div className="form-group">
              <label htmlFor="pikemen">Price: {unitsPrice2} ETH </label>
              <p>Units left for sale: {unitsLeftForSale2}</p>
              <p>You have {unitsOwned2} Pikemen </p>
            </div>
            <button onClick={e => DutchAuctionBuy2(e)} type="submit" className="btn btn-primary">Purchace 1000 Pikepokers</button>
          </form>
        </div>
      </div>
    <hr/>
   </div>
  );
}

export default App;
