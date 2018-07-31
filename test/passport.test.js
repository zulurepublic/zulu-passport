
const ZuluPassport = artifacts.require("./Passport.sol");
const PassportHelper = artifacts.require("./PassportHelper.sol");
import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';

const should = require('chai').should();
const expect = require("chai").expect;
const BigNumber = web3.BigNumber;


contract(
    "Passport",
    ([user, testUser1, testUser2 ]) => {
    let passport, passportHelper;
    beforeEach(async () => {
        passportHelper = await PassportHelper.new({ from: user });
        passport = await ZuluPassport.new({ from: user });
        // User is added wit keys 1-5
        await passport.init(user);
    });
    describe("#addKey", () => {
        it("should add a key that is new", async () => {
            const byteAddr = await passportHelper.addressToBytes32(testUser1);
            (await passport.keyHasPurpose(byteAddr, 1)).should.be.false;
            await passport.addKey(byteAddr, 1, 1);
            (await passport.keyHasPurpose(byteAddr, 1)).should.be.true;
        });
        it("should add a keys new purpose", async () => {
            const byteAddr = await passportHelper.addressToBytes32(testUser1);
            await passport.addKey(byteAddr, 1, 1);
            (await passport.keyHasPurpose(byteAddr, 1)).should.be.true;
            (await passport.keyHasPurpose(byteAddr, 2)).should.be.false;
            await passport.addKey(byteAddr, 2, 1);
            (await passport.keyHasPurpose(byteAddr, 2)).should.be.true;
        });
        it("should not change a key that already exists", async () => {
            const byteAddr = await passportHelper.addressToBytes32(testUser1);

            await passport.addKey(byteAddr, 3, 1);
            (await passport.keyHasPurpose(byteAddr, 3)).should.be.true;
            let keyData = await passport.getKey(byteAddr);

            await passport.addKey(byteAddr, 3, 1);
            (await passport.keyHasPurpose(byteAddr, 3)).should.be.true;
            keyData.should.be.deep.eq(await passport.getKey(byteAddr))

        });
        it("should revert for user without purpose 1", async () => {
            const byteAddr = await passportHelper.addressToBytes32(testUser1);
            await assertRevert( passport.addKey(byteAddr, 5, 1, { from: testUser1 }));
        });

    });
});
