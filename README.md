# Zulu Republic Passport

<img src="zulu-icon.png" width="250" height="250">

## 1. What is Zulu-Passport?

Zulu-Passport is an implementation of a self-sovereign identity management system in solidity. It allows the passport owner to manage claims and share them with third-parties. 

**What is a claim?**

Let's have a look at a real-world example, your real-world passport. 
Your passport is a document issued by a government identifying you and claiming that you belong to that country. Another example is in education, where a degree certificate is issued to function as a claim that you have completed your studies. You can see the pattern: the issuer claims something about the receiving identity.

This is what the Zulu Passport is trying to bring to the blockchain, secured with Public-key cryptography. A claim is defined by a topic, the public key of the receiving identity, and the data that belongs to the claim. This is then signed with the private key of the issuer to demonstrate the validity of the claim. 

**But what does self-sovereign mean?**

The central idea behind self-sovereign identity is that individuals should have the right to control their own personal data and to consent to claims made in relation to that data.

According to the current data management paradigm, sensitive personal information is floating around the web, spread around the globe and servers and databases that are vulnerable to theft and abuse. While the UN Declaration of Human Rights grants all people the right to sovereignty and privacy, we have yet to fully realize these rights in terms of personal data. 

Self-sovereign systems invite us to redefine the concept of identity for the digital age, removing vulnerable centralized gatekeepers of private data and replacing them with immutable cryptographic protocol. Because these systems exist securely on the blockchain, they can also eliminate the need to carry physical identification documents if adopted and accepted on a broad scale.

When a conflict arises between the needs of identifying parties and the rights of individual users, self-sovereign systems err on the side of the freedom and rights of the individual over the needs of external organizations and forces that may have malicious intent or incentives that do not align with the wellbeing of the individual. 

In order for self-sovereign ID to be successful, institutional partnerships will be necessary with organizations that can verify the data being entered into the passport and help spur adoption and acceptance.

## 2. What are some use cases? 

**Native use case**

A first use case will be for Zulu Republic. We will sign a claim that makes a passport owner a verified 'citizen' of Zulu Republic as long as certain requirements are fulfilled. People who hold this claim will then be granted special rights on the Zulu platform, such as receiving 5% rewards on purchases made with merchants verified by the platform, as well as certain voting rights (these features are still under development).

**KYC**

Another use case is KYC. Currently, users are required to complete separate KYC processes with each different KYC-requiring service they apply for. Not only is this an inconvenience, it provides more opportunity for the theft and abuse of their personal data. 

With the Zulu Passport, a firm that validates customer data can provide their customers with a signed claim that they satisfied KYC requirements. This could then used for multiple applications that need KYC instead of completing the KYC process for each one separately.

**Humanitarian Aid**

This technology can also be further developed to facilitate humanitarian aid and migrant identity needs. It can be particularly helpful in cases of regimes that are repressive or antagonistic towards their citizenry, and in cases of conflict, displacement, and human trafficking. Physical identification documents are losable, forgeable, revocable, and exploitable, and many displaced people around the globe have no access to one at all, hindering their search for asylum and making them vulnerable to human trafficking, forced labor, and sexual exploitation.

In the case of refugees, self sovereign ID can be helpful not only in terms of verifying their identity for asylum requests but can also be used to qualify them for philanthropic donations made to verified refugees. 

**Data Privacy**

Self-Sovereign ID can also be developed into a wider data privacy solution that gives users the ability to choose what information they want to share, when and with whom they want to share it.

## 3. How does the current build of the Zulu Passport work?

Part of the Zulu-Passport Repository is for the passport itself.

Along with it comes the `passportCloneFactory` which makes deploying new passports cheaper then to deploy them individually. It also stores the passport owner's address so it can be conveniently referenced at a later time.

The last interesting contract is the `ClaimVerifier`, which can be used to verify whether a claim is true. It can be used in contracts to inherit from that need to check if claims are valid. Therefore the claimIsValid or claimAndDataIsValid functions can be used. 

### Passport

The Passport is the place where people can manage their claims and keys.
Keys are in many cases your ethereum addresses, but could also be other types of public keys. There exist different functions in the passport contract for adding/removing/getting keys that are explained in the [Documentation](https://github.com/zulurepublic/zulu-passport/wiki/). The following purposes of keys exist so far, they all come with additional rights that will be explained in the following:

-   `IS_OWNER` = 1; //This is the address (key) that the passport is identified with. It can't be replaced and a second one cannot be added. Actions taken by this key should be treated as having been made by this passport contract and claims on the passport should be taken into account as necessary.

-   `IS_KEY_MANAGER` = 2; //Keys with this purpose can add and remove other key purposes.
-   `IS_CLAIM_MANANGER` = 3; //Keys with this purpose can add and remove claims.
-   `IS_CLAIM_SIGNER` = 4; //Keys with this purpose can sign claims in name of the passport. If a key of this type is removed, all claims issued from it in the name of the passport should be treated as invalid.
-   `IS_SELF_CLAIM_MANAGER` = 5; //Keys with this purpose can add and remove claims issued by the key itself.

The Passport also has functions for adding/removing/changing claims, that are explained in the [Documentation](https://github.com/zulurepublic/zulu-passport/wiki/). 
Claims have 6 atributes topic, scheme, issuer, signature, data, and uri as attributes. These are explained in the following section.

-   `topic` is an uint256 were the number correlates to a topic. Topics could, for example, be KYC, Citizen of .., has a facebook account, ...
-   `scheme` is an uint256 were the number corresponds to the key signing method that is being used. 1 is here the ECDSA standard Ethereum uses and the only one implemented so far.
-   `issuer` is the address of the issuer.
-   `signature` is the signed keccak256(abi.encode(passportAddress, topic, data)) by issuer.
-   `data` is data that the issuer wants to be part of the claim. This can be used to make information public, give general information, or encrypted data. This should be used in a way that fits the use case for which the claim is being used.
-   `uri`, the location of the claim, this can be HTTP links, swarm hashes, IPFS hashes, and such. (this can be changed by identity at will so should not be used for necessary data).

For more details on the functions of the passport see the [Documentation](https://github.com/zulurepublic/zulu-passport/wiki/).


## 4. How to use it?

To create a passport for an address call the `createPassport` function on `passportCloneFactory`, that is deployed at [0x84398ae453f59b1f8a306a941d25dbc4367c9ce9](https://rinkeby.etherscan.io/address/0x84398ae453f59b1f8a306a941d25dbc4367c9ce9) needs to be called. This will give you a deployed passport on Rinkeby network. You can find your passport contract address in the `passports` map, by looking up the ethereum address you deployed the contract with. 
With that contract, you then can use all the functionality described. 

## 5. Development

**Dependencies**

-   `node@9.5.x`

**Setting Up**

-   Clone this repository.
-   Install all [system dependencies](#development).
    -   `npm install`
-   Compile contract code
    -   `node_modules/.bin/truffle compile`
    
**Running Tests**

-   `npm run test`

**Test Coverage**

To generate test coverage, type:
-   `npm run cov`
To see test coverage open `coverage/index.html` in a browser.

**Generate Flattened Contracts**

To generate flattened version of contracts in `flats/`, type:
-   `npm run flat`

To generate flatten version of contracts and serve them to remix, type:

-   install `remixd` with `npm -g remixd`

-   `npm run remix`

## 6. Licensing

Zulu-Passport is licensed under the [GNU AFFERO GENERAL PUBLIC LICENSE](https://www.gnu.org/licenses/agpl-3.0.en.html) (agpl-3.0) license. 

## 7. What is the Zulu Republic Foundation?

The Zulu Republic Foundation is a Swiss organization charged with managing the underlying technology of the Zulu Republic blockchain ecosystem. The foundation’s mission is to advance the development of decentralized technologies, to promote human rights and empowerment around the globe, and to reduce the global digital divide.

In support of this mission, the Zulu Republic Foundation is responsible for the following activity:

- Developing open-source distributed ledger technologies (DLT)
- Developing self-sovereign identity technologies (SSI)
- Creating and distributing educational content on the subjects of digital security, privacy, and blockchain technology.
- Maintaining and managing the ZTX token and reserve, and all Zulu Republic smart contracts.
- Incubating and seeding initiatives, businesses, and non-profit organizations that utilize ZTX and/or its underlying open-source technologies in their daily operations.

Currently the Zulu Republic Foundation is developing an ecosystem of platforms on the Ethereum blockchain, combining solutions for both self-sovereign identity (the Zulu Republic Passport) and economic agency (ZTX token and Zulu Pay financial platform).

## 7. Learn More

To learn more about Zulu Republic, visit the [Zulu Republic website](https://www.zulurepublic.io/), [blog](www.medium.com/zulurepublic), and on Twitter at [@ztxrepublic](www.twitter.com/ztxrepublic).
