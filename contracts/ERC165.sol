pragma solidity 0.4.24;


contract ERC165 {
    mapping(bytes4 => bool) internal supportedInterfaces;

    function ERC165ID() public pure returns (bytes4) {
        return this.supportsInterface.selector;
    }

    constructor() internal {
        supportedInterfaces[ERC165ID()] = true;
    }

    function supportsInterface(bytes4 interfaceID) external view returns (bool) {
        return supportedInterfaces[interfaceID];
    }
}