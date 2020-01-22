pragma solidity ^0.5.0;

// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
library SafeMath {
    /**
     * @dev Multiplies two unsigned integers, reverts on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    /**
     * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Adds two unsigned integers, reverts on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    /**
     * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
     * reverts when dividing by zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}

// Berserkers contract
contract Berserkers  {
    using SafeMath for uint;
    // unit ownership
    mapping(address => mapping(uint256 => uint256))public unitsOwned;//address =>unittype =>amount owned
    
    // battlefield setup
    mapping(uint256 => address)public owner;
    mapping(uint256 => uint256)public soldierAmount;
    mapping(uint256 => uint256)public soldiertype;
    mapping(uint256 => mapping(uint256 => uint256))public attackMod;
    mapping(uint256=> mapping(uint256 => uint256))public defenseMod;
    
    //auction sale setup
    mapping(uint256 => uint256)public auctionStartTime;
    mapping(uint256 => uint256)public unitsLeftForSale;
    mapping(uint256 => uint256)public unitsPrice;
    
    //divsection    
    uint256 public pointMultiplier = 10e18;
    struct Account {
        uint balance;
        uint lastDividendPoints;
    }
    mapping(address=>Account) accounts;

    uint256 public totalDividendPoints;
    uint256 public unclaimedDividends;
    uint256 public totalSupplyStake;
    mapping(address => uint256)public playerVault;
    mapping(address => uint256)public stake;

    function dividendsOwing(address account) public view returns(uint256) {
        uint256 newDividendPoints = totalDividendPoints.sub(accounts[account].lastDividendPoints);
        return (stake[account] * newDividendPoints) / pointMultiplier;
    }
    modifier updateAccount(address account) {
        uint256 owing = dividendsOwing(account);
        if(owing > 0) {
            unclaimedDividends = unclaimedDividends.sub(owing);
            playerVault[account] = playerVault[account].add(owing);
            }
        accounts[account].lastDividendPoints = totalDividendPoints;
    _;
    }   
    function () external payable{playerVault[msg.sender] = playerVault[msg.sender].add(msg.value);}
    function fetchdivs(address account) public updateAccount(account){}
    function vaultToWallet() public updateAccount(msg.sender)
    {
        address payable sender = msg.sender;
        require(playerVault[sender] > 0,"nothing in playerVault");
        uint256 amount = playerVault[sender];
        playerVault[sender] = 0;
        sender.transfer(amount);
    }
    function disburse(uint256 amount) internal {
        totalDividendPoints = totalDividendPoints.add(amount.mul(pointMultiplier).div(totalSupplyStake));
        unclaimedDividends = unclaimedDividends.add(amount);
    }
    // Dutch auction sale logics
    function DutchAuctionBuy(uint256 unit) public {
        address sender = msg.sender;
        uint256 time = block.timestamp;
        uint256 unitTime = auctionStartTime[unit];
        require(time > unitTime,"Auction hasn't started yet");
        require(unit < 3,"Only 3 units in game");
        uint256 diff = time.sub(unitTime);
        uint256 price = 100000;
        if(diff < 86400){price = unitsPrice[unit].sub(unitsPrice[unit].div(86400)*diff);}
        emit pricing(price, diff);
        require(playerVault[sender] >= price,"not enough funds in playerVault");
        require(unitsLeftForSale[unit] >= 1000,"not enough units left for sale");
        playerVault[sender] = playerVault[sender].sub(price);
        unitsPrice[unit] = price.mul(2);
        auctionStartTime[unit] = time;
        unitsLeftForSale[unit] = unitsLeftForSale[unit].sub(1000);
        unitsOwned[sender][unit] = unitsOwned[sender][unit].add(1000);
        disburse(price);
        emit unitsBought(sender,price,unit);
    }
    // battlefield functions
    function Attack(uint256 spot, uint256 unit) public {
        address sender = msg.sender;
        address defender = owner[spot];
        require(unitsOwned[sender][unit] >= 1000, "not enough units");
        require(defender != sender, "cannot attack yourself");
        // determine winner
        uint256 defenderType = soldiertype[spot];
        uint256 totalattack = attackMod[unit][defenderType].mul(1000);
        uint256 totaldefense = soldierAmount[spot].mul(defenseMod[defenderType][unit]);
        if(totalattack > totaldefense)
        {
            // fetch divs defender
            fetchdivs(defender);
            // fetch divs attacker
            fetchdivs(sender);
            // remove losers stake
            stake[defender] = stake[defender].sub(1);
            // change ownership
            owner[spot] = sender;
            // change defender unit and type
            soldierAmount[spot] = (totalattack.sub(totaldefense)).div(10);
            soldiertype[spot] = unit;
            // deduct spent units
            unitsOwned[sender][unit] = unitsOwned[sender][unit].sub(1000);
            // add winners stake
             stake[sender] = stake[sender].add(1);
             // emit event
             emit battle(sender,defender,spot,sender);
        }
        if(totalattack <= totaldefense)
        {
            // change casualties
            soldierAmount[spot] = (totaldefense.sub(totalattack)).div(10);
            // deduct spent units
            unitsOwned[sender][unit] = unitsOwned[sender][unit].sub(1000);
            // emit event
            emit battle(sender,defender,spot,defender);
        }
    }
    // UI functions
    function getBattlefieldInfo() public view returns(address[] memory _Owner, uint256[] memory locationData ){
          uint i;
          address[] memory _locationOwner = new address[](100); //owner
          uint[] memory _locationData = new uint[](100*4); //amount-type
          uint y;
          for(uint x = 0; x < 100; x+=1){

                _locationOwner[i] = owner[i];
                _locationData[y] = soldierAmount[i];
                _locationData[y+1] = soldiertype[i];
              y += 2;
              i+=1;
            }
          return (_locationOwner,_locationData);
        }
    function getPlayerInfo(address account) public view returns( uint256[] memory locationData ){
          uint i;
          uint[] memory _locationData = new uint[](3); //amount 
          for(uint x = 0; x < 3; x+=1){
                _locationData[i] = unitsOwned[account][i];
              i+=1;
            }
          return (_locationData);
        }
    function getAuctionInfo() public view returns( uint256[] memory locationData ){
          uint i;
          uint[] memory _locationData = new uint[](3*3); //time - units-price 
          for(uint x = 0; x < 3; x+=1){
                _locationData[i] = auctionStartTime[x];
                _locationData[i+1] = unitsLeftForSale[x];
                _locationData[i+2] = unitsPrice[x];
              i+=3;
            }
          return (_locationData);
        }
    // startup setups
    constructor()
        public
    {
        totalSupplyStake = 100;
        auctionStartTime[0] = block.timestamp;
        auctionStartTime[1] = block.timestamp;
        auctionStartTime[2] = block.timestamp;
        unitsLeftForSale[0] = 1000000;
        unitsLeftForSale[1] = 1000000;
        unitsLeftForSale[2] = 1000000;
        unitsPrice[0] = 1 finney;
        unitsPrice[1] = 1 finney;
        unitsPrice[2] = 1 finney;/*
        for(uint256 i=0;i<totalSupplyStake;i++){
            owner[i] = 0x0B0eFad4aE088a88fFDC50BCe5Fb63c6936b9220;
            soldierAmount[i]= 200;
        }*/
        // 0 : cav
        // 1 : S
        // 2 : P
        attackMod[0][0] = 10;
        attackMod[0][1] = 35;
        attackMod[0][2] = 1;
        attackMod[1][0] = 10;
        attackMod[1][1] = 5;
        attackMod[1][2] = 25;
        attackMod[2][0] = 20;
        attackMod[2][1] = 1;
        attackMod[2][2] = 5;

        defenseMod[0][0] = 30;
        defenseMod[0][1] = 30;
        defenseMod[0][2] = 10;
        defenseMod[1][0] = 5;
        defenseMod[1][1] = 20;
        defenseMod[1][2] = 30;
        defenseMod[2][0] = 45;
        defenseMod[2][1] = 5;
        defenseMod[2][2] = 15;

        stake[0x0] = 100;
    }
     // events
  
    event unitsBought(address indexed player, uint256 indexed price, uint256 indexed unit);
    event battle (address indexed attacker, address indexed defender, uint256 indexed spot, address winner);
    event pricing ( uint256 indexed price, uint256 indexed time);
}