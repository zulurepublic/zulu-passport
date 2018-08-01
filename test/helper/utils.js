const leftPad = require('left-pad')
const RLP = require("rlp");

const getNextContractAddress = deployedBy => {
  // https://ethereum.stackexchange.com/questions/2527/is-there-a-way-to-find-an-accounts-current-transaction-nonce
  let nonce = web3.eth.getTransactionCount(deployedBy);
  // https://stackoverflow.com/questions/18879880/how-to-display-nodejs-raw-buffer-data-as-hex-string
  let rlp = RLP.encode([deployedBy, nonce]).toString("hex");
  // https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed
  let hash = web3.sha3(rlp, { encoding: "hex" });
  let address = "0x" + hash.slice(26);
  return address;
};

function keccak256(...args) {
  args = args.map(arg => {
    if (typeof arg === "string") {
      if (arg.substring(0, 2) === "0x") {
        return arg.slice(2);
      } else {
        return web3.toHex(arg).slice(2);
      }
    }

    if (typeof arg === "number") {
      return leftPad(arg.toString(16), 64, 0);
    } else {
      return "";
    }
  });

  args = args.join("");

  return web3.sha3(args, { encoding: "hex" });
}

module.exports = {
  keccak256,
  getNextContractAddress
};
