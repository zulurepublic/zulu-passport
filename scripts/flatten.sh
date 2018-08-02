#!/usr/bin/env bash

rm -rf flats/*

./node_modules/.bin/truffle-flattener contracts/passport/passport.sol > flats/Passport.sol
./node_modules/.bin/truffle-flattener contracts/cloneFactory/PassportCloneFactory.sol > flats/PassportCloneFactory.sol
./node_modules/.bin/truffle-flattener contracts/verifier/ClaimVerifier.sol > flats/ClaimVerifier.sol
