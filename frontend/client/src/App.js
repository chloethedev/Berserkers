import React, { useEffect, useState } from 'react';
import Berserkers from './contracts/Berserkers.json';
import { getWeb3 } from './utils.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
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
  const [playerVault, setPlayerVault] = useState(undefined);
  const [contractAddress, setContractAddress] = useState(undefined);
  const [userStake, setUserStake] = useState(undefined);
  const [dividendsOwing, setDividendsOwing] = useState(undefined);
  const [unclaimedDividends, setUnclaimedDividends] = useState(undefined);
  const [totalDividendPoints, setTotalDividendPoints] = useState(undefined);


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
      const contractAddress = deployedNetwork.address

      const totalSupplyStake = await contract.methods
        .totalSupplyStake()
        .call();

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setContractAddress(contractAddress);
      setTotalSupplyStake(totalSupplyStake);

    }
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
    }, []);

  const isReady = () => {
    return (
      typeof contract !== 'undefined' 
      && typeof web3 !== 'undefined'
      && typeof accounts !== 'undefined'
    );
  }

    useEffect(() => {
      if(isReady()) {
        updateAuctionStartTime0();
        updateAuctionStartTime1();
        updateAuctionStartTime2();
        updateUnitsLeftForSale0();
        updateUnitsLeftForSale1();
        updateUnitsLeftForSale2();
        updateUnitsPrice0();
        updateUnitsPrice1();
        updateUnitsPrice2();
        updateUnitsOwned0();
        updateUnitsOwned1();
        updateUnitsOwned2();
        updatePlayerVault();
        updateUserStake();
        updateUnclaimedDividends();
        updateTotalDividendPoints();
        updateDividendsOwing();

      }
    }, [accounts, contract, web3,]);

// UI FUNCTIONS

  async function getPlayerInfo() {
    await contract.methods
      .getPlayerInfo(accounts[0])
      .call();
  }

  async function getAuctionInfo() {
    await contract.methods
      .getAuctionInfo()
      .call();
  }

  async function getBattlefieldInfo() {
    await contract.methods
      .getBattlefieldInfo()
      .call
  }

  // AUCTION/UNIT FUNCTIONS

  async function updateAuctionStartTime0() {
    const auctionStartTime0 = await contract.methods
      .auctionStartTime(0)
      .call();
    setAuctionStartTime0(auctionStartTime0);
  }

  async function updateAuctionStartTime1() {
    const auctionStartTime1 = await contract.methods
      .auctionStartTime(1)
      .call();
    setAuctionStartTime1(auctionStartTime1);
  }

  async function updateAuctionStartTime2() {
    const auctionStartTime2 = await contract.methods
      .auctionStartTime(2)
      .call();
    setAuctionStartTime2(auctionStartTime2);
  }

  async function updateUnitsLeftForSale0() {
    const unitsLeftForSale0 = await contract.methods
      .unitsLeftForSale(0)
      .call();
    setUnitsLeftForSale0(unitsLeftForSale0);
  }

  async function updateUnitsLeftForSale1() {
    const unitsLeftForSale1 = await contract.methods
      .unitsLeftForSale(1)
      .call();
    setUnitsLeftForSale1(unitsLeftForSale1);
  }

  async function updateUnitsLeftForSale2() {
    const unitsLeftForSale2 = await contract.methods
      .unitsLeftForSale(2)
      .call();
    setUnitsLeftForSale2(unitsLeftForSale2);
  }

  async function updateUnitsPrice0() {
    const unitsPrice0 =  web3.utils.fromWei(await contract.methods
      .unitsPrice(0)
      .call(), 'ether');
    setUnitsPrice0(unitsPrice0);
  }

  async function updateUnitsPrice1() {
    const unitsPrice1 = web3.utils.fromWei(await contract.methods
      .unitsPrice(1)
      .call(), 'ether');
    setUnitsPrice1(unitsPrice1);
  }

  async function updateUnitsPrice2() {
    const unitsPrice2 = web3.utils.fromWei(await contract.methods
      .unitsPrice(2)
      .call(), 'ether');
    setUnitsPrice2(unitsPrice2);
  }

  async function updateUnitsOwned0() {
    const unitsOwned0 = await contract.methods
      .unitsOwned(accounts[0], 0)
      .call();
    setUnitsOwned0(unitsOwned0);
  }

  async function updateUnitsOwned1() {
    const unitsOwned1 = await contract.methods
      .unitsOwned(accounts[0], 1)
      .call();
    setUnitsOwned1(unitsOwned1);
  }

  async function updateUnitsOwned2() {
    const unitsOwned2 = await contract.methods
      .unitsOwned(accounts[0], 2)
      .call();
    setUnitsOwned2(unitsOwned2);
  }

// SOLDIER BUYING BUTTONS
  async function DutchAuctionBuy(e) {
    e.preventDefault();
    await contract.methods
      .DutchAuctionBuy(0)
      .send(
        {from:accounts[0]}
      );
    await getPlayerInfo();
    await getAuctionInfo();
    await updateDividendsOwing();
  }

  async function DutchAuctionBuy1(e) {
    e.preventDefault();
    await contract.methods
      .DutchAuctionBuy(1)
      .send(
        {from: accounts[0]}
      );
    await getPlayerInfo();
    await getAuctionInfo();
    await updateDividendsOwing();
  }

  async function DutchAuctionBuy2(e) {
    e.preventDefault();
    await contract.methods
      .DutchAuctionBuy(2)
      .send(
        {from: accounts[0]}
      );
    await getPlayerInfo();
    await getAuctionInfo();
    await updateDividendsOwing();
  }

// ATTACK
  async function Attack(e) {
    e.preventDefault();
    const spot = e.target.elements[0].value;
    const unitType = e.target.elements[1].value;
    await contract.methods
      .Attack(spot, unitType)
      .send(
        {from: accounts[0]}
      );
    await getBattlefieldInfo();
    await updateUserStake();
    await updateDividendsOwing(0);
    await getPlayerInfo();
    }


  // VAULT STAKE  and DIV FUNCTIONS

  async function updatePlayerVault() {
    const playerVault = web3.utils.fromWei(await contract.methods
      .playerVault(accounts[0])
      .call(), 'ether');
    setPlayerVault(playerVault);
  } 

  async function updateUserStake() {
    const userStake = await contract.methods
      .stake(accounts[0])
      .call();
    setUserStake(userStake);
  } 

  async function updateUnclaimedDividends() {
    const unclaimedDividends = web3.utils.fromWei(await contract.methods
      .unclaimedDividends()
      .call(), 'ether');
    setUnclaimedDividends(unclaimedDividends);
  } 

  async function fillPlayerVault(e) {
    e.preventDefault();
    const deposit = e.target.elements[0].value;
    await (web3.eth.sendTransaction({
      from: accounts[0],
      to: contractAddress,
      value: deposit
    })
    .then(function(reciept) {
      return reciept;
    }));
    await getPlayerInfo();
    }


  async function fetchdivs() {
    await contract.methods
      .fetchdivs(accounts[0])
      .send(
        {from: accounts[0]}
      );
    await updateDividendsOwing(0);
  }

  async function vaultToWallet() {
    await contract.methods
      .vaultToWallet()
      .send(
        {from: accounts[0]}
      );
    await updateDividendsOwing();
  }

  async function updateTotalDividendPoints() {
    const totalDividendPoints = web3.utils.fromWei(await contract.methods
      .totalDividendPoints()
      .call(), 'ether')
    setTotalDividendPoints(totalDividendPoints);
  }

  async function updateDividendsOwing() {
    const dividendsOwing = await contract.methods
      .dividendsOwing(accounts[0])
      .call();
    setDividendsOwing(dividendsOwing);
  }

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  return (

    // NAVBAR
<>
    <div className="container">

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Berserkers</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">PlincHub</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Plinc Games</a>
              </li>
              <li className="nav-item mr-auto">
                <a className="nav-link" href="#">Account: {accounts[0]}</a>
              </li>
            </ul>
          </div>
      </nav>

    </div>

    <br></br>

  <div className="container m-auto pb-5">

      <h1 className="text-center">Welcome to Berserkers</h1>
      {/* <p className="text-center">Contract Address: {contractAddress}</p> */}
      <p className="text-center">Your have conquered {userStake} out of a possible {totalSupplyStake} battlefields.</p>

    <hr/>

      <div className="row">
        <div className="col-4 text-center">Your Unclaimed Dividends: {dividendsOwing} {unclaimedDividends}
        <br></br>
        <button type="submit" className="btn btn-primary text-center" onClick={e => fetchdivs(e)}>Fetch Divies!</button>
        </div>
        {/* <div className="col-4"> Dunno what this is {totalDividendPoints} </div> */}
        <div className="col-4">
          <form onSubmit={e => fillPlayerVault(e)}>
            <div className='form-group text-center'>
              <label htmlFor="deposit">Input how much ETH you would like to deposit to your Vault. </label>
              <input/>
              <button>Send Funds to Player Vault</button>
            </div>
          </form>
        </div>

        <div className="col-4 text-center">
          Current Funds in Player Vault {playerVault} ETH 
          <button type="submit" className="btn btn-primary text-center" onClick={e => vaultToWallet(e)}>WIthdraw From Vault</button>
        </div>

      </div>

   

      <hr/>

      <div className="row">
        <div className="col-12">
        <div className="col-8">
            <p className="text-center float-right">THIS WILL SHOW THE BATTLEFIELDS</p>
            
        </div>
          <form className="col-4" onSubmit={e => Attack(e)}>
              <div className="form-group">
                <label htmlFor="name">Battlefield Spot # (0-99)</label>
                <input type="text" className="form-control" id="name" />
              </div>
              <div className="form-group">
                <label htmlFor="choices">Unit to attack with (0 - cav / 1 - sw / 2 - pike)</label>
                <input type="text" className="form-control" id="choices" />
              </div>
              <button type="submit" className="btn btn-primary">ATTACK!</button>
          </form>
        </div>

      </div>

      <hr/>

      <div className="row">
        <div className="col-4">
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
    
        <div className="col-4">
          <h2>Swordsmen</h2>
              <h4>Auction Start Time for Sword Swingers: {(new Date(parseInt(auctionStartTime1)*1000)).toLocaleString()}</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="swordsmen">Price: {unitsPrice1} ETH </label>
                  <p>Units left for sale: {unitsLeftForSale1}</p>
                  <p>You have {unitsOwned1} Swordsmen </p>
                </div>
                <button onClick={e => DutchAuctionBuy1(e)} type="submit" className="btn btn-primary">Purchace 1000 Swordswingers</button>
              </form>
        </div>

        <hr/>

        <div className="col-4">
          <h2>Pikemen</h2>
          <h4>Auction Start Time for Pike Pokers: {(new Date(parseInt(auctionStartTime2)*1000)).toLocaleString()}</h4>
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
   </div>
   </>
  );
}

export default App;
