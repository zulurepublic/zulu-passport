const Passport = artifacts.require("./Passport.sol");
const PassportCloneFactory = artifacts.require("./PassportCloneFactory.sol");
const ClaimVerifier = artifacts.require("./ClaimVerifier.sol");
  
const { createPassportCloneFactory, addCitizen } = require("./helper/deploy");
const { keccak256 } = require("./helper/utils");

const BigNumber = web3.BigNumber;
const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();
const expect = require("chai").expect;


contract(
  "ClaimVerifier",
  ([user1, issuerZulu, citizen1, citizen2, ]) => {
    let passport, passportCitizen1, passportCitizen2, passportCloneFactory, claimVerifier;
    const data = "test data";
    const topic = 99; //77 is citizen in example
    const scheme = 1; //uint type of encription ECDSA ..     ECDSA: 1,
    const uri = "www.zulurepublic.io"; //The location of the claim
    let testClaimToSign, signedClaim; 
    let hashClaim;

    beforeEach(async () => {
        ({passportCloneFactory} = await createPassportCloneFactory(issuerZulu));
        passportCitizen1 = await addCitizen(citizen1, "some data");
        passportCitizen2 = await addCitizen(citizen2, "some data");

        testClaimToSign = keccak256(passportCitizen1.address,
            topic,
            data );

        signedClaim = web3.eth.sign(issuerZulu, testClaimToSign);
        hashClaim = keccak256(
            passportCitizen1.address,
            topic,
            data 
        );
        claimVerifier = await ClaimVerifier.new();
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
  

    describe("#getSignatureAddress", () => {
        it("should get msg signer", async () => {
            let challenge = web3.sha3("random-string");
            let signature = web3.eth.sign(user1, challenge);
      
            let signedBy = await claimVerifier.getSignatureAddress.call(challenge, signature);
            signedBy.should.be.eq(user1);
        });
        it("should NOT get msg signer for data that was not signed", async () => {
            let challenge = web3.sha3("random-string");
            let signature = web3.eth.sign(user1, challenge);

            let signedBy = await claimVerifier.getSignatureAddress.call(web3.sha3("random-string2"), signature);
            signedBy.should.not.be.eq(user1);
        });
    });

    describe("#claimIsValid", () => {
        it("should return true for existing claim", async () => {
            await passportCitizen1
                .addClaim(topic, scheme, issuerZulu, signedClaim, data, uri, {from: citizen1})
                .should.be.fulfilled;
            await testClaim(passportCitizen1, topic, issuerZulu, signedClaim, data, uri);

            (await claimVerifier.claimIsValid.call(issuerZulu, passportCitizen1.address, topic)).should.be.true;      
        });

        it("should return true for existing claim were issuer is passport and signed by key of purpose 1", async () => {
            signedClaim = web3.eth.sign(citizen2, testClaimToSign);

            await passportCitizen1
                .addClaim(topic, scheme, passportCitizen2.address, signedClaim, data, uri, {from: citizen1})
                .should.be.fulfilled;
            await testClaim(passportCitizen1, topic, passportCitizen2.address, signedClaim, data, uri);
            (await claimVerifier.claimIsValid.call(passportCitizen2.address, passportCitizen1.address, topic)).should.be.true;      
        });


        it("should return false for existing claim if issuer is passport and NOT signed by key of purpose 1", async () => {
            signedClaim = web3.eth.sign(user1, testClaimToSign);

            await passportCitizen1
                .addClaim(topic, scheme, passportCitizen2.address, signedClaim, data, uri, {from: citizen1})
                .should.be.fulfilled;
            await testClaim(passportCitizen1, topic, passportCitizen2.address, signedClaim, data, uri);

            (await claimVerifier.claimIsValid.call(passportCitizen2.address, passportCitizen1.address, topic)).should.be.false;      
        });

        it("should NOT be valid if existing claim is of undefined scheme", async () => {
            await passportCitizen1.addClaim(topic, 4, passportCitizen2.address, hashClaim, data, uri, {from: citizen1});

            let claimId = keccak256(passportCitizen2.address, topic);
            const [topic2, scheme2, issuer2, signature2, data2, uri2] = await passportCitizen1.getClaim(claimId);
            (await claimVerifier.claimIsValid(passportCitizen2.address, passportCitizen1.address, topic)).should.be.false;      
        });
    });

    describe("#claimAndDataIsValid", () => {
        it("claim and data should be valid for existing claim", async () => {
            await passportCitizen1
                .addClaim(topic, scheme, issuerZulu, signedClaim, data, uri, {from: citizen1})
                .should.be.fulfilled;

            (await claimVerifier.claimAndDataIsValid.call(issuerZulu, passportCitizen1.address, topic, data)).should.be.true;      

        });
        it("claim and data should be INVALID for existing claim with different data", async () => {
            await passportCitizen1
                .addClaim(topic, scheme, issuerZulu, signedClaim, data, uri, {from: citizen1})
                .should.be.fulfilled;

            (await claimVerifier.claimAndDataIsValid.call(issuerZulu, passportCitizen1.address, topic, "123")).should.be.false;      
        });

        it("should be valid for existing claim issued by passport and singed by key of purpose 1", async () => {
            signedClaim = web3.eth.sign(citizen2, testClaimToSign);

            await passportCitizen1
                .addClaim(topic, 1, passportCitizen2.address, signedClaim, data, uri, {from: citizen1})
                .should.be.fulfilled;
            await testClaim(passportCitizen1, topic, passportCitizen2.address, signedClaim, data, uri);

            (await claimVerifier.claimAndDataIsValid.call(passportCitizen2.address, passportCitizen1.address, topic, data)).should.be.true;     
        });

        it("should return false for existing claim if issuer is passport and NOT signed by key of purpose 1", async () => {
            signedClaim = web3.eth.sign(user1, testClaimToSign);

            await passportCitizen1
                .addClaim(topic, scheme, passportCitizen2.address, signedClaim, data, uri, {from: citizen1})
                .should.be.fulfilled;
            await testClaim(passportCitizen1, topic, passportCitizen2.address, signedClaim, data, uri);

            (await claimVerifier.claimAndDataIsValid.call(passportCitizen2.address, passportCitizen1.address, topic, data)).should.be.false;      
        });

        it("should NOT be valid if existing claim is of undefined scheme", async () => {
            await passportCitizen1.addClaim(topic, 4, passportCitizen2.address, hashClaim, data, uri, {from: citizen1});

            let claimId = keccak256(passportCitizen2.address, topic);
            const [topic2, scheme2, issuer2, signature2, data2, uri2] = await passportCitizen1.getClaim(claimId);
            (await claimVerifier.claimAndDataIsValid.call(passportCitizen2.address, passportCitizen1.address, topic, data)).should.be.false;      
        });
  
    });
});