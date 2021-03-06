pragma solidity 0.4.24;

import "./PassportInterface.sol";

/**
 * @title Passport
 * @author Timo Hedke - <timo@zulurepublic.io>
 * @dev Contract for the Zulu Passport implementing Interface
 */
contract Passport is PassportInterface {

    struct Claim {
        uint256 topic;
        uint256 scheme;
        address issuer;
        bytes signature;
        bytes data;
        string uri;
    }

    struct Key {
        uint256 purpose;
        uint256 keyType;
        bytes32 key;
    }

    mapping (bytes32 => Key) keys;
    mapping (uint256 => bytes32[]) keysByPurpose;

    mapping (bytes32 => Claim) claims;
    mapping (uint256 => bytes32[]) claimsByTopic;

    //Constants
    uint constant IS_OWNER              = 1;
    uint constant IS_KEY_MANAGER        = 2;
    uint constant IS_CLAIM_MANAGER      = 3;
    uint constant IS_CLAIM_SIGNER       = 4;
    uint constant IS_SELF_CLAIM_MANAGER = 5;

    bool initialized = false;

    // Functions
    /**
     * @dev This initializes the contract, cant use constructor because of cloneFactory.
     * @param sender address of the identity owner
     */
    function init(
        address sender
    )
     public
    {
        require(!initialized);
        initialized = true;

        keys[bytes32(sender)].key = bytes32(sender);
        keys[bytes32(sender)].keyType = 1;
        keysByPurpose[1].push(bytes32(sender));
        keysByPurpose[2].push(bytes32(sender));
        keysByPurpose[3].push(bytes32(sender));
        keysByPurpose[4].push(bytes32(sender));
        keysByPurpose[5].push(bytes32(sender));

        keys[bytes32(sender)].purpose = 31;

        supportedInterfaces[ERC165ID()] = true;
        supportedInterfaces[PassportInterfaceID()] = true;
    }

    /**
     * @dev Getter for key struct
     * @param _key bytes32 of the key
     * @return purposes, keyType, and key of an existing key
     */
    function getKey(bytes32 _key) public view returns(uint256 purpose, uint256 keyType, bytes32 key){
        return (keys[_key].purpose, keys[_key].keyType, keys[_key].key);
    }

    /**
     * @dev Checks if key with purpose exist
     * @param _key bytes32 of the key
     * @param purpose uint256 of the purpose
     * @return Boolean if the key has the purpose
     */
    function keyHasPurpose(bytes32 _key, uint256 purpose) public view returns(bool exists){
        if (keys[_key].key == 0) return false;
        uint256 shiftedPurpose = shiftPurpose(purpose);
        if((keys[_key].purpose & shiftedPurpose) == shiftedPurpose){
            return true;
        }

        return false;
    }

    /**
     * @dev Getter for keys of purpose
     * @param _purpose uint256 of the purpose
     * @return List of keys
     */
    function getKeysByPurpose(uint256 _purpose) public view returns(bytes32[]) {
        return keysByPurpose[_purpose];
    }

    function shiftLeft(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a << b;
        assert((c >> b) == a);
        return c;
    }

    function shiftPurpose(uint256 _purpose) internal pure returns(uint256) {
        require(_purpose != 0);
        return shiftLeft(1, (_purpose-1));
    }

    /**
     * @dev Adds a new key
     * @param _key bytes32 of the key
     * @param _purpose uint256 of the purpose
     * @param _keyType uint256 of the keyType
     * @return Boolen true on success
     */
    function addKey(bytes32 _key, uint256 _purpose, uint256 _keyType) public returns (bool success) {
        require(keyHasPurpose(bytes32(msg.sender), IS_KEY_MANAGER), "No authority to add keys");
        require(_purpose != IS_OWNER, "Can not add new owner");
        require(_keyType != 0);

        uint256 shiftedPurpose = shiftPurpose(_purpose);

        //Key exists?
        if (keys[_key].key != _key) {
            //Add to keys
            keys[_key].key = _key;
            keys[_key].keyType = _keyType;
            keysByPurpose[_purpose].push(_key);
            keys[_key].purpose = shiftedPurpose;
        } else {
            if ((keys[_key].purpose & shiftedPurpose) == 0) {
                keysByPurpose[_purpose].push(_key);
                keys[_key].purpose = keys[_key].purpose | shiftedPurpose;
            }
        }

        emit KeyAdded(_key, _purpose, _keyType);
        return true;
    }

    /**
     * @dev Removes a purpose of an existing key
     * @param _key bytes32 of the key
     * @param _purpose uint256 of the purpose
     * @return Boolen true on success
     */
    function removeKey(bytes32 _key, uint256 _purpose) public returns (bool success) {
        require(keyHasPurpose(bytes32(msg.sender), IS_KEY_MANAGER), "No authority to remove keys");
        require(!keyHasPurpose(_key, IS_OWNER), "Cant remove owner key");

        require(keys[_key].key == _key, "Key does not exist and cant be removed");

        //remove purpose
        keys[_key].purpose = ~shiftPurpose(_purpose) & keys[_key].purpose;

        //Look for key in keysByPurpose
        for (uint i = 0; i < keysByPurpose[_purpose].length; i++) {
            if (keysByPurpose[_purpose][i] == _key) {
                keysByPurpose[_purpose][i] = keysByPurpose[_purpose][keysByPurpose[_purpose].length-1];

                keysByPurpose[_purpose].length--;
                emit KeyRemoved(keys[_key].key, _purpose, keys[_key].keyType);
                return true;
            }
        }

        emit KeyRemoved(keys[_key].key, _purpose, keys[_key].keyType);
        return true;
    }

    /**
     * @dev Getter for claim data
     * @param _claimId bytes32 of the claimId
     * @return topic, scheme, issuer, signature, data, and uri of a claim
     */
    function getClaim(bytes32 _claimId)
        public
        view
        returns(uint256 topic, uint256 scheme, address issuer, bytes signature, bytes data, string uri)
    {
        return (
            claims[_claimId].topic,
            claims[_claimId].scheme,
            claims[_claimId].issuer,
            claims[_claimId].signature,
            claims[_claimId].data,
            claims[_claimId].uri
        );
    }

    /**
     * @dev Getter for claims of topic
     * @param _topic uint256 of the topic
     * @return claimIds of a claims
     */
    function getClaimIdsByTopic(uint256 _topic) public view returns(bytes32[] claimIds){
        return claimsByTopic[_topic];
    }

    /**
     * @dev Adds a claim
     * @param _topic uint256 of the topic
     * @param _scheme uint256 of the scheme
     * @param issuer address of the issuer
     * @param _signature bytes of the signature
     * @param _data bytes of the data
     * @param _uri string of the uri
     * @return claimIs of a claim
     */
    function addClaim(
        uint256 _topic,
        uint256 _scheme,
        address issuer,
        bytes _signature,
        bytes _data,
        string _uri
        )
        public
        returns (bytes32 claimId)
    {
        claimId = keccak256(abi.encodePacked(issuer, _topic));

        if(!keyHasPurpose(bytes32(msg.sender), IS_CLAIM_MANAGER)){
            emit ClaimRequested(claimId, _topic, _scheme, issuer, _signature, _data, _uri);
            return claimId;
        }
        if(claims[claimId].issuer == address(0)){
            claimsByTopic[_topic].push(claimId);
            emit ClaimAdded(claimId, _topic, _scheme, issuer, _signature, _data, _uri);
        } else{
            emit ClaimChanged(claimId, _topic, _scheme, issuer, _signature, _data, _uri);
        }

        claims[claimId].topic = _topic;
        claims[claimId].scheme = _scheme;
        claims[claimId].issuer = issuer;
        claims[claimId].signature = _signature;
        claims[claimId].data = _data;
        claims[claimId].uri = _uri;

        return claimId;
    }

    /**
     * @dev Removes a claim
     * @param _claimId bytes32 of the claimId
     * @return Boolean true on success
     */
    function removeClaim(bytes32 _claimId) public returns (bool success){
        require(keyHasPurpose(bytes32(msg.sender), IS_CLAIM_MANAGER), "No authority to remove claims");
        if(claims[_claimId].issuer != address(0)){
            uint256 topic = claims[_claimId].topic;

            delete claims[_claimId];
            for (uint i = 0; i < claimsByTopic[topic].length; i++) {
                if (claimsByTopic[topic][i] == _claimId) {
                    claimsByTopic[topic][i] = claimsByTopic[topic][claimsByTopic[topic].length-1];
                    claimsByTopic[topic].length--;
                    return true;
                }
            }
        }
        return true;
    }
}
