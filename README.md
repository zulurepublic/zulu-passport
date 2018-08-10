# Zulu Republic Passport
<img src="zulu-icon.png" width="250" height="250">

## 1. What is Zulu-Passport?

Zulu-Passport is an implementation of a self-sovereign identity management system in solidity. It allows the passport owner to manage claims and sharing them with third-parties. 

**What is a claim?**

Let's have a look at a real-world example, your real-world passport. 
Your passport is a document issued by a government identifying you and claiming that you belong to there country. Another example is your education, that is represented by a certificate issued by a school or university that claims your scholarship. You can see the pattern: Issuer claims something over receiving identity.

This is what the Zulu-Passport is trying to bring to the blockchain, secured with Public-key cryptography. A claim is defined by a topic, the public key of the receiving identity, and the data that belongs to the claim. This is then signed with the private key of the issuer. By that people know that only the private key owner can be the issuer of that claim. 

**But what does self-sovereign mean?**

In many cases in the real world, claims are made without the consent of the recipient. On the other hand, claims that the recipient wants to be shared can't be shared because of legal obligations. 
That is why Zulu gives each person the possibility to govern their identity themselves, by letting them freely choose witch claims the add to there Passport. 


## 2. What are real-world use cases? 

A first use case will be for Zulu Republic. We will sign a claim that makes a passport owner a valid Zulu-Citizens, as long as he fulfills the requirements.  People that hold that claim get then special right on the Zulu platform. 

Another use case could be KVC. A firm that validates customer data could give their customers a signed claim that they did KVC. This could then used for multiple applications that need KVC, instead of doing KVC for each one separately.

## 3. How is it working?

Part of the Zulu-Passport Repository is for once the passport itself.
Along with it comes the `passportCloneFactory` which makes deploying new passports cheaper then to deploy them individually. It also stores the owner address of the passport for conveniently looking it up at a later time.

The last interesting contract is the `ClaimVerifier` that can be used to verify whether a claim is true. It can be used in contracts to inherit from that need to check if claims are valid. Therefore the claimIsValid or claimAndDataIsValid functions can be used. 

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

[Documentation](https://github.com/zulurepublic/zulu-passport/wiki/)

## 4. How to use it?

To create a passport for an address call the createPassport function on `passportCloneFactory` that is deployed at ...(Todo deploy) needs to be called. This will give you a deployed passport on .. (Todo network it is deployed on) network. With that contract, you then can use all the functionality described.

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

-   `npm run remix`

## 6. Licensing

Zulu-Passport is licensed under the [GNU AFFERO GENERAL PUBLIC LICENSE](https://www.gnu.org/licenses/agpl-3.0.en.html) (agpl-3.0) license. 

## 7. Learn More

To learn more about Zulu Republic, visit the [Zulu Republic website](https://www.zulurepublic.io/) and [blog](www.medium.com/zulurepublic).

The Zulu Republic Telegram community can be found [here](https://t.me/ztxrepublic).

Follow Zulu Republic on Twitter at [@ztxrepublic](www.twitter.com/ztxrepublic).
