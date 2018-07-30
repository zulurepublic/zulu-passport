// <https://ethereum.stackexchange.com/questions/21210/syntaxerror-unexpected-token-import-on-truffle-test/21211#21211>
require("babel-register")({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require("babel-polyfill");

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    live: {
      network_id: 1, // Ethereum public network
      host: "localhost",
      port: 8545,
      gas: 6000000
    },
    testnet: {
      network_id: 3, // Official Ethereum test network (Ropsten)
      host: "localhost",
      port: 8545,
      gas: 6000000
    },
    rinkeby: {
      network_id: 4, // Rinkeby Ethereum test network
      host: "localhost",
      port: 8545,
      gas: 6000000
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    },
    development: {
      host: "localhost",
      network_id: "*",
      port: 8545,
      gas: 6000000
    }
  }
};
