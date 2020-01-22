const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "special home leg another stable mushroom heavy ranch another resist matter promote"; // 12 word mnemonic



module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: '0.5.2'
    }
  },
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/6d5167011b5f4b24a3f144f8e6d38498");
      },
      network_id: '3',
    },
    test: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/");
      },
      network_id: '*',
    },
  }
};
