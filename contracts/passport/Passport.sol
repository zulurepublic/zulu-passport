pragma solidity 0.4.24;

import "./PssportInterface.sol";

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
        uint256[] purposes;
        uint256 keyType;
        bytes32 key;
    }

    bool initialized = false;

    function init(
        address sender
    )
     public
    {
        require(!initialized);
        initialized = true;
        supportedInterfaces[PassportInterface()] = true;
    }

    // Functions

    /**
     * @dev Getter for key struct
     * @param _key bytes32 of the key
     * @return purposes, keyType, and key of an existing key
     */
    function getKey(bytes32 _key) public view returns(uint256[] purposes, uint256 keyType, bytes32 key){
    
    
    }

    /**
     * @dev Checks if key with purpose exist
     * @param _key bytes32 of the key
     * @param purpose uint256 of the purpose
     * @return Boolean if the key has the purpose
     */
    function keyHasPurpose(bytes32 _key, uint256 purpose) public view returns(bool exists){

    }

    /**
     * @dev Getter for keys of purpose
     * @param _purpose uint256 of the purpose
     * @return List of keys
     */
    function getKeysByPurpose(uint256 _purpose) public view returns(bytes32[] keys){

    }

    /**
     * @dev Adds a new key
     * @param _key bytes32 of the key
     * @param _purpose uint256 of the purpose
     * @param _keyType uint256 of the keyType
     * @return Boolen true on success
     */
    function addKey(bytes32 _key, uint256 _purpose, uint256 _keyType) public returns (bool success){

    }

    /**
     * @dev Removes a purpose of an existing key
     * @param _key bytes32 of the key
     * @param _purpose uint256 of the purpose
     * @return Boolen true on success
     */
    function removeKey(bytes32 _key, uint256 _purpose) public returns (bool success){

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

    }

    /**
     * @dev Getter for claims of topic 
     * @param _topic uint256 of the topic
     * @return claimIds of a claims
     */
    function getClaimIdsByTopic(uint256 _topic) public view returns(bytes32[] claimIds){

    }

    /**
     * @dev Adds a claim
     * @param _topic uint256 of the topic
     * @param _scheme uint256 of the scheme
     * @param issuer address of the issuer
     * @param _signature bytes of the signature
     * @param _data bytes of the data
     * @param _uri string of the uri
     * @return claimIds of a claims
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
        returns (uint256 claimRequestId)
    {

    }

    /**
     * @dev Removes a claim
     * @param _claimId bytes32 of the claimId
     * @return Boolean true on success
     */
    function removeClaim(bytes32 _claimId) public returns (bool success);

    // Fallback function accepts Ether transactions
    function () external payable {
    }
}