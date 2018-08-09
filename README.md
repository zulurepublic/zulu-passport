# Zulu Republic Passport

![Zulu Republic](zulu-icon.png)

## Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Overview](#overview)
-   [Implementation Details](#implementation-details)
-   [Development](#development)
-   [Setting Up](#setting-up)
-   [Running Tests](#running-tests)
-   [Test Coverage](#test-coverage)
-   [Generate Flattened Contracts](#generate-flattened-contracts)

## Overview

This is the Zulu Republic passport repository. It tries to solve the question of how a person/institute is able to claim or verify the identity of another person in a secure fashion as well as respecting that person's rights to govern herself.

Along with the passport comes the `passportCloneFactory` which makes deploying new passports cheaper then to deploy them individually. It also stores the owner address of the passport for conveniently looking it up at a later time.
The last contract is the `ClaimVerifier` that is used to verify whether a claim is true.

## Implementation Details

### Passport

The Passport is the place where people can manage their claims and keys.
The following purposes of keys exist so far they all come with additional rights that will be explained in the following:

-   `IS_OWNER` = 1; //This is the address (key) witch the passport is identified with. It can't be replaced or a second one added. Actions done by this key should be treated as done by this passport contract and claims on the passport should be taken into account as necessary.
-   `IS_KEY_MANAGER` = 2; //Keys with this purpose can add and remove other key purposes.
-   `IS_CLAIM_MANANGER` = 3; //Keys with this purpose can add and remove claims.
-   `IS_CLAIM_SIGNER` = 4; //Keys with this purpose can sign claims in name of the passport. If a key of this type is removed all claims issued from it in the name of the passport should be treated as invalid.
-   `IS_SELF_CLAIM_MANAGER` = 5; //Keys with this purpose can add and remove claims issued by the key itself.

Claims have the topic, scheme, issuer, signature, data, and uri as attributes. These are explained in the following section.

-   `topic` is an uint256 were the number correlates to a topic. Topics could, for example, be KVC, Citizen of .., has a facebook account, ... (Todo some standards should be defined to make claims more useful);
-   `scheme` is an uint256 were the number corresponds to the key signing method that is being used. 1 is here the standard ethereum uses ECDSA and the only one implemented so far. (Todo. Define more)
-   `issuer` is the address of the issuer. (todo is address always viable also for other signing methods?)
-   `signature` is the signed keccak256(abi.encode(passportAddress, topic, data)) by issuer.
-   `data` is data that the issuer wants to be part of the claim. This can be used to make information public, give general information, or encrypted data. This should be used in a way that fits the use case for which the claim is being used.
-   `uri`, the location of the claim, this can be HTTP links, swarm hashes, IPFS hashes, and such. (this can be changed by identity ad will so should not be used for necessary data).

## Development

**Dependencies**

-   `node@9.5.x`

## Setting Up

-   Clone this repository.

-   Install all [system dependencies](#development).

    -   `npm install`

-   Compile contract code

    -   `node_modules/.bin/truffle compile`

## Running Tests

-   `npm run test`

## Test Coverage

To generate test coverage, type:

-   `npm run cov`

To see test coverage open `coverage/index.html` in a browser.

## Generate Flattened Contracts

To generate flattened version of contracts in `flats/`, type:

-   `npm run flat`

To generate flatten version of contracts and serve them to remix, type:

-   `npm run remix`
