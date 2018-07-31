pragma solidity 0.4.24;

/**
 * @title PassportHelper
 * @author Timo Hedke - <timo@zulurepublic.io>
 * @dev Contract for the Zulu Passport implementing Interface
 */
contract PassportHelper {

    function addressToBytes32(address _key) public pure returns(bytes32){
        return bytes32(_key);
    }

}