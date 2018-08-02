# zulu-passport

Zulu Republic Passport 

Repository also contains the PassportCloneFactory and ClaimVerifier contracts.

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

## Generate Flats with truffle flattener

To generate flatten version of contracts in `flats/`, type:

-   `npm run flat`

To generate flatten version of contracts and serve them to remix, type:

-   `npm run remix`

