pragma solidity 0.4.24;

import "../ERC165.sol";

/**
 * @title PassportInterface
 * @author Timo Hedke - <timo@zulurepublic.io>
 * @dev Contract for the Zulu Passport
 */
contract PassportInterface is ERC165 {

    /**
     * @dev Function that returns the ERC165 ID of this Interface
     * @return bytes4 the ERC165 ID of PassportInterface
     */
    function PassportInterfaceID() public pure returns (bytes4) {
        return (
            this.getKey.selector ^ this.keyHasPurpose.selector ^ this.getKeysByPurpose.selector ^
            this.addKey.selector ^ this.removeKey.selector ^ this.getClaimIdsByTopic.selector ^
            this.addClaim.selector ^ this.removeClaim.selector    
        );
    }

    // KeyType
    uint256 constant ECDSA_TYPE = 1;
    uint256 constant RSA_TYPE = 2;

    // Events
    event KeyAdded(bytes32 indexed key, uint256 indexed purpose, uint256 indexed keyType);
    event KeyRemoved(bytes32 indexed key, uint256 indexed purpose, uint256 indexed keyType);

    event ClaimRequested(bytes32 indexed claimId, uint256 indexed topic, uint256 scheme, address indexed issuer, bytes signature, bytes data, string uri);
    event ClaimAdded(bytes32 indexed claimId, uint256 indexed topic, uint256 scheme, address indexed issuer, bytes signature, bytes data, string uri);
    event ClaimRemoved(bytes32 indexed claimId, uint256 indexed topic, uint256 scheme, address indexed issuer, bytes signature, bytes data, string uri);
    event ClaimChanged(bytes32 indexed claimId, uint256 indexed topic, uint256 scheme, address indexed issuer, bytes signature, bytes data, string uri);

    // Functions
    function init(address sender) public;

    function getKey(bytes32 _key) public view returns(uint256 purpose, uint256 keyType, bytes32 key);
    function keyHasPurpose(bytes32 _key, uint256 purpose) public view returns(bool exists);
    function getKeysByPurpose(uint256 _purpose) public view returns(bytes32[] keys);
    function addKey(bytes32 _key, uint256 _purpose, uint256 _keyType) public returns (bool success);
    function removeKey(bytes32 _key, uint256 _purpose) public returns (bool success);

    function getClaim(bytes32 _claimId) public view returns(uint256 topic, uint256 scheme, address issuer, bytes signature, bytes data, string uri);
    function getClaimIdsByTopic(uint256 _topic) public view returns(bytes32[] claimIds);
    function addClaim(uint256 _topic, uint256 _scheme, address issuer, bytes _signature, bytes _data, string _uri) public returns(bytes32 claimId);
    function removeClaim(bytes32 _claimId) public returns (bool success);
}