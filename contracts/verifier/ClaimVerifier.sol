pragma solidity 0.4.24;

import "../Libary/BytesLib.sol";
import '../passport/PassportInterface.sol';
import "zeppelin-solidity/contracts/ECRecovery.sol";
import "../ERC165Query.sol";


contract ClaimVerifier {
    using ECRecovery for bytes32;
    using ERC165Query for address;
    using BytesLib for bytes;

 
    bytes constant ETH_PREFIX = "\x19Ethereum Signed Message:\n32";

    event ClaimValid(address _issuer, PassportInterface _identity, uint256 claimType);
    event ClaimInvalid(address _issuer, PassportInterface _identity, uint256 claimType);


    function PassportID() public pure returns (bytes4) {
        return (0x61f0aaf8);
    }

    function getSignatureAddress(bytes32 toSign, bytes signature)
        public
        returns (address)
    {
        return keccak256(abi.encodePacked(ETH_PREFIX, toSign)).recover(signature);
    }


    function claimAndDataIsValid(address _issuer, PassportInterface _identity, uint256 _topic, bytes _data)
    public
    view
    returns (bool)
    {
        uint256 topic;
        uint256 scheme;
        address issuer;
        bytes memory sig;
        bytes memory data;

        // Construct claimId (issuer + claim type)
        bytes32 claimId = keccak256(abi.encodePacked(_issuer, _topic));

        // Fetch claim from user
        ( topic, scheme, issuer, sig, data, ) = _identity.getClaim(claimId);
        if (!data.equal(_data)) {
            return false;
        }
        return _validSignature(address(_identity), topic, scheme, issuer, sig, data);
    }

    function claimIsValid(address _issuer, PassportInterface _identity, uint256 _topic)
    public
    view
    returns (bool)
    {
        uint256 topic;
        uint256 scheme;
        address issuer;
        bytes memory sig;
        bytes memory data;

        bytes32 claimId = keccak256(abi.encodePacked(_issuer, _topic));
        
        ( topic, scheme, issuer, sig, data, ) = _identity.getClaim(claimId);

        return _validSignature(address(_identity), topic, scheme, issuer, sig, data);
    }

    /// @dev Checks if a given claim is valid
    /// @param _topic Type of claim
    /// @param _scheme Scheme used for the signatures
    /// @param issuer Address of issuer
    /// @param _signature The actual signature
    /// @param _data The data that was signed
    /// @return `false` if the signature is invalid or if the scheme is not implemented
    function _validSignature(
        address _identity,
        uint256 _topic,
        uint256 _scheme,
        address issuer,
        bytes _signature,
        bytes _data
    )
        internal
        view
        returns (bool)
    {
        if (_scheme == 1) {
            address signedBy = getSignatureAddress(keccak256(abi.encodePacked(_identity, _topic, _data)), _signature);
            if (issuer == signedBy) {
                return true;
            } else
            if (issuer.doesContractImplementInterface(PassportID())) {
        
                return PassportInterface(issuer).keyHasPurpose(bytes32(signedBy), 4);
            }
            // Invalid
            return false;
        } else {
            //TODO
            // Not implemented
            return false;
        }
        //All else Invalid
        return false;
    }

}
