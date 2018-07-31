#!/usr/bin/env bash

rm -rf flats/*

./node_modules/.bin/truffle-flattener contracts/passport/passport.sol > flats/passport.sol
