// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

struct Land {
    address host;
    address []guests;
    string  name; // name or store
    string  url;  // your avatar or link
    LandType typ;
    Position pos;
    uint   price;
}

enum LandType {
    WORK, SHOPING, PARK, ROAD, MEETING, SPORT, OTHER,
    PLAIN, GRASS, WATER, FOREST, MOUNTAIN, DESERT
}

struct Position {
    int32 lat; // 111. 111
    int32 lng; 
}

struct Last {
    uint blkNum;
    uint locIdx;
}

contract MeetSH is Ownable{
    mapping(address => uint[]) public ownedLands;
    mapping(address => Last) public lastLight;
    
    mapping(int32 => mapping(int32 => uint)) public posLand; // lat, lng => locIdx
    Land[] public allLands;
    uint public landStart;
    uint public landCount;

    event LightLand(uint index);

    constructor() {
        // set 0
        allLands.push(
            Land(
                msg.sender, 
                new address[](0),
                "Meet Genesis", 
                "meet.xyz", 
                LandType.MEETING, 
                Position(0, 0), 
                100 ether
            ));
    }

    // if 8-12, return 5
    // if 13-17, return 10
    // if 18-22, return 15 
    function getBound(int32 x) internal returns (int32 lx) {
        int32 z = x % 10;
        return z<3 ? x-z-5 : z>7 ? x-z+5 : x-z;
    }

    function addLands(Land[] calldata lands) public onlyOwner {
        landStart = allLands.length;
        for (uint i=0; i<lands.length; i++) {
            int32 lx = getBound(lands[i].pos.lat);
            int32 ly = getBound(lands[i].pos.lng);
            if (posLand[lx][ly] == 0) {
                posLand[lx][ly] = allLands.length;
                allLands.push(lands[i]);
            }
        }
        landCount = allLands.length - 1;
    }

    function changeType(uint index, LandType typ) public onlyOwner {
        require(landCount >= index, "Index too big!");
         allLands[index].typ = typ;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function mintLand(Position calldata pos, string memory name, string memory url, LandType typ) public payable {
        require(msg.value >= 1 ether, "Price too low!");
        int32 lx = getBound(pos.lat);
        int32 ly = getBound(pos.lng);
        require(posLand[lx][ly] == 0, "Already has land!"); 
        posLand[lx][ly] = allLands.length;
        allLands.push(
            Land(msg.sender, new address[](0),
                name, url, typ, pos, 2 ether
            ));
        landCount = allLands.length - 1;
    }

    function buyLand(uint index, string memory name, string memory url) public payable {
        require(landCount >= index, "Index too big!");
        require(msg.value >= allLands[index].price, "Price too low!");
        payable(allLands[index].host).transfer(msg.value * 9 / 10); // transfer
        allLands[index].host = msg.sender;
        allLands[index].name = name;
        allLands[index].url = url;
        allLands[index].price = allLands[index].price * 2;
    }

    function modLand(uint index, string memory name, string memory url) public {
        require(landCount >= index, "Index too big!");
        require(allLands[index].host == msg.sender, "Only host can modify!");
        allLands[index].name = name;
        allLands[index].url = url;
    }

    function modPrice(uint index, uint price) public {
        require(landCount >= index, "Index too big!");
        require(allLands[index].host == msg.sender, "Only host can modify!");
        allLands[index].price = price;
    }


    function lightLand(Position calldata pos) public {
        int32 lx = getBound(pos.lat);
        int32 ly = getBound(pos.lng);
        uint index = posLand[lx][ly];
        require(index != 0, "No land"); 

        Last memory last = lastLight[msg.sender];
        if (last.blkNum != 0) {
            Position memory lpos = allLands[last.locIdx].pos;
            int32 dx = pos.lat > lpos.lat ? pos.lat - lpos.lat : lpos.lat - pos.lat;
            int32 dy = pos.lng > lpos.lng ? pos.lng - lpos.lng : lpos.lng - pos.lng;
            require(block.number - last.blkNum > uint32(dx + dx), "Too short");
        }

        ownedLands[msg.sender].push(index);
        allLands[index].guests.push(msg.sender);
        lastLight[msg.sender] = Last(block.number, index);
        emit LightLand(index);
    }

    receive() external payable{
    }
}