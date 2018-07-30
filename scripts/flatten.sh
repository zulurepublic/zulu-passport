#!/usr/bin/env bash

rm -rf flats/*
./node_modules/.bin/truffle-flattener contracts/ZuluToken.sol > flats/ZuluToken.sol
./node_modules/.bin/truffle-flattener contracts/AirDropper.sol > flats/AirDropper.sol
./node_modules/.bin/truffle-flattener contracts/MultiSigWallet.sol > flats/MultiSigWallet.sol
./node_modules/.bin/truffle-flattener contracts/Rewards.sol > flats/Rewards.sol
./node_modules/.bin/truffle-flattener contracts/Votable.sol > flats/Votable.sol
./node_modules/.bin/truffle-flattener contracts/ZuluPassport.sol > flats/ZuluPassport.sol
./node_modules/.bin/truffle-flattener contracts/identity/Identity.sol > flats/Identity.sol
./node_modules/.bin/truffle-flattener contracts/identity/CloneFactory/IdentityCloneFactory.sol > flats/IdentityCloneFactory.sol
