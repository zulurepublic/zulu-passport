const PassportCloneFactory = artifacts.require("./PassportCloneFactory.sol");
const Passport = artifacts.require("./Passport.sol");
const { keccak256, getNextContractAddress } = require("./utils");

let passportCloneFactory, zulu, passport, register;

const createPassportCloneFactory = async user => {
  passport = await Passport.new({ from: user });
  zulu = user;
  passportCloneFactory  = await PassportCloneFactory.new(passport.address, {
    from: user
  });


  return {passportCloneFactory };
};


//only 1 is implemented
const scheme = 1; //uint type of encription ECDSA ..     ECDSA: 1,
const uri = "www.zulurepublic.io"; //The location of the claim
const addCitizen = async (user, data) => {
  const topic = 77; //77 is citizen in example

  await passportCloneFactory.createPassport({from: user});
  let userPassport = Passport.at(await passportCloneFactory.passports(user))

  let toSign = keccak256(userPassport.address, topic, data);
  let signedClaim = web3.eth.sign(zulu, toSign);

  userPassport.addClaim(topic, scheme, zulu, signedClaim, data, uri, {from: user});
  return userPassport;
};

const addMerchant = async (user, data) => {
  const topic = 78; //78 is Merchant in example

  await passportCloneFactory.createPassportByOwner(user);
  let userPassport = Passport.at(await passportCloneFactory.passports(user))

  let toSign = keccak256(userPassport.address, topic, data);
  let signedClaim = web3.eth.sign(zulu, toSign);

  userPassport.addClaim(topic, scheme, zulu, signedClaim, data, uri, {from: user});
  return userPassport;
};

module.exports = {
  createPassportCloneFactory,
  addCitizen,
  addMerchant
};
