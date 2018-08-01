pragma solidity 0.4.24;

import "../passport/PassportInterface.sol";
import "./CloneFactory.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


contract PassportCloneFactory is CloneFactory, Ownable {
    using SafeMath for uint256;

    address public libraryAddress;
    mapping (address => address) public passports;   //Owner address to passport contract address
    uint256 public numOfClones;

    event PassportCreated(address newThingAddress, address libraryAddress);

    constructor (address _libraryAddress) public {
        libraryAddress = _libraryAddress;
    }

    function createPassport(
    )
        public
        returns(address)
    {
        return _createPassport(            
            msg.sender
        );
    }

    function createPassportByOwner(
        address sender

    )
        public onlyOwner
        returns(address)
    {
        return _createPassport(            
            sender
        );
    }

    function _createPassport(
        address sender
    )
        internal
        returns(address clone)
    { 
        require(passports[sender] == address(0));
        numOfClones = numOfClones.add(1);
        clone = createClone(libraryAddress);
        passports[sender] = clone;
        PassportInterface(clone).init(sender);
        emit PassportCreated(clone, libraryAddress);
    }
}