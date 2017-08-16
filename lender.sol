pragma solidity ^0.4.0;
contract Lender {

    struct Item {
        uint id;
        string name;   
        address lender;
    }

    uint numItems;
    address public owner;
    mapping(uint => Item) items;
    
    function Lender() {
        owner = msg.sender;
    }
    
    function addItem(string name) returns (uint itemId) {
        if (msg.sender != owner) return;
        itemId = numItems++; 
        items[itemId].id = itemId;
        items[itemId].name = name;

        return itemId;
    }
    
    function removeItem(uint itemId) {
        if (msg.sender != owner) return;
        delete items[itemId];
        numItems--;
    }
    
    function lendItem(uint itemId) {
        items[itemId].lender = msg.sender;
    }
    
    function returnItem(uint8 itemId) {
        if (msg.sender != owner) return;
        delete items[itemId].lender;
    }
    
    function getNumItems() returns (uint) {
        return numItems;
    }
    
    function getItem(uint8 itemId) returns (uint id, string name, address lender) {
        return (items[itemId].id, items[itemId].name, items[itemId].lender);
    }
}