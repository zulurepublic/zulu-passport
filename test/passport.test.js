
const ZuluPassport = artifacts.require("./Passport.sol");
const PassportHelper = artifacts.require("./PassportHelper.sol");
import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';
const { createPassportCloneFactory, addCitizen, addMerchant } = require("./helper/deploy");
const { keccak256 } = require("./helper/utils");
const BigNumber = web3.BigNumber;

const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();
const expect = require("chai").expect;


contract(
    "Passport",
    ([user, citizen1, citizen2, issuerZulu ]) => {
    let passportCloneFactory, passport, passportHelper;
    const data = "test data";
    const topic = 99;
    const scheme = 1;
    const uri = "www.zulurepublic.io"; 
    let testClaimToSign, signedClaim;
    beforeEach(async () => {
        ({passportCloneFactory} = await createPassportCloneFactory(issuerZulu));
        passportHelper = await PassportHelper.new({ from: user });
        passport = await ZuluPassport.new({ from: citizen1 });
        // User is added wit keys 1-5
        await passport.init(citizen1);
        testClaimToSign = keccak256(passport.address,
            topic,
            data );
    
        signedClaim = web3.eth.sign(issuerZulu, testClaimToSign);
    });


    const testClaim = async (id, _topic, _issuer, _signature, _data, _uri) => {
        let claimId = keccak256(_issuer, _topic);

        const [topic2, scheme2, issuer2, signature2, data2, uri2] = await id.getClaim(claimId);
  
        topic2.should.be.bignumber.equal(_topic);
        scheme2.should.be.bignumber.equal(1);
        assert.equal(issuer2, _issuer);
        assert.equal(signature2, _signature);
        assert.equal(web3.toAscii(data2), _data);
        assert.equal(uri2, _uri);
    }
    const testEmptyClaim = async (id, claimId) => {
        const [topic2, scheme2, issuer2, signature2, data2, uri2] = await id.getClaim(claimId);
        "0".should.be.bignumber.eq(topic2);
        "0".should.be.bignumber.eq(scheme2);
        issuer2.should.be.eq("0x0000000000000000000000000000000000000000");
        "0x".should.be.eq(signature2);
        "0x".should.be.eq(data2);
        "".should.be.eq(uri2);
    }
    const testKey = async (id, _key, _purpose, _keyType, ) => {
        let claimId = keccak256(_issuer, _topic);
        let [purposes, keyType, key] = (await passport.getKey(key));
        _key.should.be.bignumber.eq(key);
        _keyType.should.be.bignumber.eq(keyType);
        _purpose.should.be.bignumber.eq(purposes);
    }
    
    it("ERC165ID", async () => {
        "0x01ffc9a7".should.be.eq( await passport.ERC165ID()) //0x01ffc9a7
    });
    it("PassportInterfaceID", async () => {
        "0x61f0aaf8".should.be.eq( await passport.PassportInterfaceID()) //0x01ffc9a7
    });
    describe("#getKey", () => {
        it("should get key data of address", async () => {
            const key = await passportHelper.addressToBytes32(citizen1);
            testKey(passport, key, 31, 1);

        });

        it("should get empty data for claim that does not exist", async () => {
            const key = await passportHelper.addressToBytes32(citizen2);
            let [purposes, keyType, key2] = (await passport.getKey(key));

            key2.should.be.bignumber.eq("0x0000000000000000000000000000000000000000000000000000000000000000");
            "0".should.be.bignumber.eq(keyType);
            "0".should.be.bignumber.eq(purposes);
        });
    });
    describe("#keyHasPurpose", () => {
        it("should return true for valid purposes", async () => {
            const key = await passportHelper.addressToBytes32(citizen1);

            (await passport.keyHasPurpose(key, 1)).should.be.true;
            (await passport.keyHasPurpose(key, 2)).should.be.true;
            (await passport.keyHasPurpose(key, 3)).should.be.true;
            (await passport.keyHasPurpose(key, 4)).should.be.true;
            (await passport.keyHasPurpose(key, 5)).should.be.true;


        });
        it("should return false fo INVALID purposes", async () => {
            const key = await passportHelper.addressToBytes32(citizen2);

            (await passport.keyHasPurpose(key, 1)).should.be.false;
            (await passport.keyHasPurpose(key, 2)).should.be.false;
            (await passport.keyHasPurpose(key, 3)).should.be.false;
            (await passport.keyHasPurpose(key, 4)).should.be.false;
            (await passport.keyHasPurpose(key, 5)).should.be.false;
        });
    });

    describe("#getKeysByPurpose", () => {
        it("should get keys for purpose with key", async () => {
            const key = await passportHelper.addressToBytes32(citizen1);

            const keys = await passport.getKeysByPurpose(1);
            keys.should.be.eql([key]);
            const keys2 = await passport.getKeysByPurpose(2);
            keys2.should.be.eql([key]);
            const keys3 = await passport.getKeysByPurpose(3);
            keys3.should.be.eql([key]);
        });
        it("should return empty for purpose without key", async () => {
            const key = await passportHelper.addressToBytes32(citizen1);

            const keys = await passport.getKeysByPurpose(6);
            keys.should.be.eql([]);
            const keys2 = await passport.getKeysByPurpose(7);
            keys2.should.be.eql([]);
            const keys3 = await passport.getKeysByPurpose(8);
            keys3.should.be.eql([]);
        });

    });

    describe("#addKey", () => {
        it("should add a key that is new", async () => {
            const byteAddr = await passportHelper.addressToBytes32(citizen2);
            (await passport.keyHasPurpose(byteAddr, 1)).should.be.false;
            await passport.addKey(byteAddr, 1, 1, {from: citizen1});
            (await passport.keyHasPurpose(byteAddr, 1)).should.be.true;
        });
        it("should add a keys new purpose", async () => {
            const byteAddr = await passportHelper.addressToBytes32(citizen2);
            await passport.addKey(byteAddr, 1, 1, {from: citizen1});
            (await passport.keyHasPurpose(byteAddr, 1)).should.be.true;
            (await passport.keyHasPurpose(byteAddr, 2)).should.be.false;
            await passport.addKey(byteAddr, 2, 1, {from: citizen1});
            (await passport.keyHasPurpose(byteAddr, 2)).should.be.true;
        });
        it("should not change a key that already exists", async () => {
            const byteAddr = await passportHelper.addressToBytes32(citizen2);

            await passport.addKey(byteAddr, 3, 1, {from: citizen1});
            (await passport.keyHasPurpose(byteAddr, 3)).should.be.true;
            let keyData = await passport.getKey(byteAddr);

            await passport.addKey(byteAddr, 3, 1, {from: citizen1});
            (await passport.keyHasPurpose(byteAddr, 3)).should.be.true;
            keyData.should.be.deep.eq(await passport.getKey(byteAddr))

        });
        it("should revert for user without purpose 1", async () => {
            const byteAddr = await passportHelper.addressToBytes32(citizen2);
            await assertRevert( passport.addKey(byteAddr, 5, 1, { from: citizen2 }));
        });
    });
    describe("#removeKey", () => {
        it("should remove an existing key for user with purpose 1", async () => {
            const byteAddr = await passportHelper.addressToBytes32(citizen1);
            (await passport.keyHasPurpose(byteAddr, 3)).should.be.true;
            await passport.removeKey(byteAddr, 3, {from: citizen1});
            (await passport.keyHasPurpose(byteAddr, 3)).should.be.false;
            const keys = await passport.getKeysByPurpose(3);
            keys.should.be.eql(["0x0000000000000000000000000000000000000000000000000000000000000000"]);
        });
        it("should revert when trying to remove key that does not exist", async () => {
            const byteAddr = await passportHelper.addressToBytes32(citizen2);

            (await passport.keyHasPurpose(byteAddr, 3)).should.be.false;
            await assertRevert( passport.removeKey(byteAddr, 3, {from: citizen1}));
        });
        it("should Not remove an existing key for user without purpose 1", async () => {
            const byteAddr = await passportHelper.addressToBytes32(citizen1);
            (await passport.keyHasPurpose(byteAddr, 3)).should.be.true;
            await assertRevert(passport.removeKey(byteAddr, 3, {from: citizen2}));
            (await passport.keyHasPurpose(byteAddr, 3)).should.be.true;
            const keys = await passport.getKeysByPurpose(3);
            keys.should.be.eql([byteAddr]);
        });

    });

    // Claim
    describe("getClaim", () => {
        beforeEach(async () => {
          await passport.addClaim(topic, scheme, issuerZulu, signedClaim, data, uri, {from: citizen1});
        });
        it("should get claim by claimID", async () => {
          testClaim(passport, topic, issuerZulu, signedClaim, data, uri)
        });
        it("should get empty data for claim that does not exist", async () => {
          let claimId = keccak256(issuerZulu, 4);

          const [topic2, scheme2, issuer2, signature2, data2, uri2] = await passport.getClaim(claimId);
          "0".should.be.bignumber.eq(topic2);
          "0".should.be.bignumber.eq(scheme2);
          issuer2.should.be.eq("0x0000000000000000000000000000000000000000");
          "0x".should.be.eq(signature2);
          "0x".should.be.eq(data2);
          "".should.be.eq(uri2);
        });
    });

    describe("#getClaimIdsByTopic", () => {
        beforeEach(async () => {
          await passport.addClaim(topic, scheme, issuerZulu, signedClaim, data, uri, {from: citizen1});

        });
        it("should get existing claims for a topic that exists", async () => {
          let claimId = keccak256(issuerZulu, topic);

          let claims = await passport.getClaimIdsByTopic(topic);
          [claimId].should.be.eql(claims);
   
        });
        it("should get empty list when no claims of topic exist", async () => {
          let claims = await passport.getClaimIdsByTopic(4);
          claims.should.be.eql([]);
        });
    });
    describe("#addClaim", () => {
        it("should add a claim for key of purpose 1", async () => {
          await passport.addClaim(topic, scheme, issuerZulu, signedClaim, data, uri, {from: citizen1})
                            .should.be.fulfilled;
          testClaim(passport, topic, issuerZulu, signedClaim, data, uri)

        });
        it("should NOT add a claim for key not of purpose 1", async () => {
          await passport.addClaim(topic, scheme, issuerZulu, signedClaim, data, uri, {from: citizen2});  
          let claimId = keccak256(issuerZulu, topic);
          
          testEmptyClaim(passport, claimId)
        });
    });
    describe("#removeClaim", () => {
        beforeEach(async () => {
          await passport.addClaim(topic, scheme, issuerZulu, signedClaim, data, uri, {from: citizen1});
        });
        it("should remove an existing claim by user with purpose 1", async () => {
          let claimId = keccak256(issuerZulu, topic);

          await passport.removeClaim(claimId, {from: citizen1}).should.be.fulfilled;
          testEmptyClaim(passport, claimId)

        });
        it("should NOT remove an existing claim for user WITHOUT purpose 1", async () => {
          let claimId = keccak256(issuerZulu, topic);

          await passport.removeClaim(claimId, {from: citizen2}).should.be.rejectedWith('revert');  
        });

    });

});
