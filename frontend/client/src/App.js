import React, { useEffect, useState } from 'react';
import Berserkers from './contracts/Berserkers.json';
import { getWeb3 } from './utils.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [user, setUser] = useState(undefined)
  const [totalSupplyStake, setTotalSupplyStake] = useState(undefined);



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

      const auctionStartTime = await contract.methods
        .auctionStartTime[0]()
        .call();
      
      // const auctionStartTime = await contract.methods
      //   .auctionStartTime[1]()
      //   .call();

      // const auctionStartTime = await contract.methods
      //   .auctionStartTime[2]()
      //   .call();

      // const unitsLeftForSale = await contract.methods
      //   .unitsLeftForSale[0]()
      //   .call();

      // const unitsLeftForSale = await contract.methods
      //   .unitsLeftForSale[1]()
      //   .call();

      // const unitsLeftForSale = await contract.methods
      //   .unitsLeftForSale[2]()
      //   .call();

      // const unitsPrice = await contract.methods
      //   .unitsPrice[0]()
      //   .call();

      // const unitsPrice = await contract.methods
      //   .unitsPrice[1]()
      //   .call();

      // const unitsPrice = await contract.methods
      //   .unitsPrice[2]()
      //   .call();

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setTotalSupplyStake(totalSupplyStake);
      setUser(user);
    }
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
    }, []);

    useEffect(() => {
      if(isReady()) {
        // updateBallots();
      }
    }, [accounts, contract, web3,]);

  const isReady = () => {
    return (
      typeof contract !== 'undefined' 
      && typeof web3 !== 'undefined'
      && typeof accounts !== 'undefined'
    );
  }

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
<h1 className="text-center">Welcome to Berserkers {user}</h1>

      <div className="row">
        <div className="col-sm-12">
          <h2>Total Supply Stake: {totalSupplyStake}</h2>
          <form onSubmit>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" />
            </div>
            <div className="form-group">
              <label htmlFor="choices">Choices</label>
              <input type="text" className="form-control" id="choices" />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration (s)</label>
              <input type="text" className="form-control" id="duration" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col-sm-12">
          <h2>Buy Swordsmen</h2>
          <form onSubmit>
            <div className="form-group">
              <label htmlFor="voters">Price of Srowdsmen: </label>
              <input type="text" className="form-control" id="voters" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col-sm-12">
          <h2>Buy Pikemen</h2>
          <form onSubmit>
            <div className="form-group">
              <label htmlFor="voters">Price of Pikemen: </label>
              <input type="text" className="form-control" id="voters" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col-sm-12">
          <h2>Buy Cavalry</h2>
          <form onSubmit>
            <div className="form-group">
              <label htmlFor="voters">Price of Cavalry: </label>
              <input type="text" className="form-control" id="voters" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col-sm-12">
          <h2>Votes</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Votes</th>
                <th>Vote</th>
                <th>Ends on</th>
              </tr>
            </thead>
            <tbody>
                <tr key>
                    <td>{}</td>
                    <td>{}</td>
                    <td>
                      <ul>
                          <li key>
                            id:,
                            name:,
                            votes:
                          </li>
                      </ul>
                    </td>
                    <td>
                          <form onSubmit>
                            <div className="form-group">
                              <label htmlFor="choice">Choice</label>
                              <select id="choice" className="form-control">
                                  <option>
                                  </option>
                            </select>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary">
                            Submit
                          </button>
                        </form>
                    </td>
                    <td>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
