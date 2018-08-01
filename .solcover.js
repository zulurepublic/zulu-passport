module.exports = {
    norpc: true,
    testCommand:
        'node --max-old-space-size=4096 ../node_modules/.bin/truffle test --network coverage',
    compileCommand:
        'node --max-old-space-size=4096 ../node_modules/.bin/truffle compile --network coverage',
    skipFiles: ['Migrations.sol', 'tests', 'ZuluPassportTestUpgradable.sol', 'Libary/BytesLib.sol', 'identity/TestContract.sol;'],
    copyPackages: ['zeppelin-solidity']
};
