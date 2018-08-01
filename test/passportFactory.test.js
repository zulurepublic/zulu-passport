
import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';
const { createPassportCloneFactory, addCitizen } = require("./helper/deploy");

const expect = require("chai").expect;
const BigNumber = web3.BigNumber;

contract(
  "PassportCloneFactory",
  ([user1, issuer1, issuerZulu, user2, citizen1, citizen2, user5, zuluFoundation, ]) => {
    let passport, passportCitizen1, passportCitizen2, passportClone, passportCloneFactory;

    beforeEach(async () => {
      ({passportCloneFactory} = await createPassportCloneFactory(issuerZulu));

      passportCitizen1 = await addCitizen(citizen1, "some data");
    });

    describe("#createPassportByOwner", () => {
        it("should create new passport for user", async () => {
          (await passportCloneFactory.passports(user1)).should.be.eq("0x0000000000000000000000000000000000000000")
          await passportCloneFactory.createPassportByOwner(user1, {from: issuerZulu});
          (await passportCloneFactory.passports(user1)).should.not.be.eq("0x0000000000000000000000000000000000000000")
        });

        it("should only create one passport per user", async () => {
          await passportCloneFactory.createPassportByOwner(user1, {from: issuerZulu});
          await assertRevert(passportCloneFactory.createPassportByOwner(user1, {from: issuerZulu}))
        });

        it("should only be callable by owner", async () => {
          await assertRevert(passportCloneFactory.createPassportByOwner(user1, {from: user1}));
        });
    });

    describe("createPassport", () => {
        it("should create new passport for user", async () => {
          (await passportCloneFactory.passports(user1)).should.be.eq("0x0000000000000000000000000000000000000000")
          await passportCloneFactory.createPassport( {from: user1});
          (await passportCloneFactory.passports(user1)).should.not.be.eq("0x0000000000000000000000000000000000000000")

        });

        it("should only create one passport per user", async () => {
          await passportCloneFactory.createPassport( {from: user1});
          await assertRevert(passportCloneFactory.createPassport( {from: user1}));
        });
    });
  }
);
