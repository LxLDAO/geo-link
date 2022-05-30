// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

struct Land {
    address host;
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
    int32 lng; // 111. 111
    int32 lat; 
}

struct Last {
    uint blkNum;
    uint locIdx;
}

struct Activity {
    uint blkNum;
    uint name;
}

contract MeetSH is Ownable{
    Activity[] public allActivities;
    Land[] public allLands;
    uint public landStart;
    uint public landEnd;

    mapping(int32 => mapping(int32 => uint)) public posLand; // lat, lng => locIdx
    mapping(address => uint[]) public passLands;
    mapping(uint => address[]) public landGuests;
    mapping(address => Last) public lastLight;

    event LightLand(uint index);

    constructor() {
        // set 0
        allLands.push(
            Land(
                msg.sender, 
                "Meet Genesis", 
                "meet.xyz", 
                LandType.MEETING, 
                Position(0, 0), 
                100 ether
            ));
    }

    function passLandCount(address addr) public view returns (uint) {
        return passLands[addr].length;
    }

    function landGuestCount(uint index) public view returns (uint) {
        return landGuests[index].length;
    }

    function activityCount(uint index) public view returns (uint) {
        return allActivities.length;
    }

    // if 8-12, return 10
    // if 13-17, return 15
    // if 18-22, return 20
    function getBound(int32 x) internal pure returns (int32 lx) {
        int32 z = x % 10;
        return z<3 ? x-z : z>7 ? x-z+10 : x-z+5;
    }

    function center(Position memory pos) public pure returns (int32 lx, int32 ly) {
        int32 lx = getBound(pos.lng);
        int32 ly = getBound(pos.lat);
        return (lx, ly);
    }

    function hasLand(Position memory pos) public view returns (bool has) {
        (int32 lx, int32 ly) = center(pos);
        return posLand[lx][ly] > 0;
    }

    function distance(Position memory pos, Position memory lpos) public pure returns (uint32 dist) {
        int32 dx = pos.lng > lpos.lng ? pos.lng - lpos.lng : lpos.lng - pos.lng;
        int32 dy = pos.lat > lpos.lat ? pos.lat - lpos.lat : lpos.lat - pos.lat;
        return uint32(dx + dy);
    }

    function addLands(Land[] calldata lands) public onlyOwner {
        landStart = allLands.length;
        for (uint i=0; i<lands.length; i++) {
            (int32 lx, int32 ly) = center(lands[i].pos);
            if (posLand[lx][ly] == 0) {
                posLand[lx][ly] = allLands.length;
                allLands.push(lands[i]);
            }
        }
        landEnd = allLands.length;
    }

    function changeType(uint index, LandType typ) public onlyOwner {
        require(landEnd >= index, "Index too big!");
         allLands[index].typ = typ;
    }

    function mintLand(Position calldata pos, string memory name, string memory url, LandType typ) public payable {
        require(msg.value >= 1 ether, "Price too low!");
        (int32 lx, int32 ly) = center(pos);
        require(posLand[lx][ly] == 0, "Already has land!"); 
        posLand[lx][ly] = allLands.length;
        allLands.push(
            Land(msg.sender, name, url, typ, pos, 2 ether)
            );
        landEnd = allLands.length;
    }

    function buyLand(uint index, string memory name, string memory url) public payable {
        require(landEnd >= index, "Index too big!");
        require(msg.value >= allLands[index].price, "Price too low!");
        payable(allLands[index].host).transfer(msg.value * 9 / 10); // transfer
        allLands[index].host = msg.sender;
        allLands[index].name = name;
        allLands[index].url = url;
        allLands[index].price = allLands[index].price * 2;
    }

    function modLand(uint index, string memory name, string memory url) public {
        require(landEnd >= index, "Index too big!");
        require(allLands[index].host == msg.sender, "Only host can modify!");
        allLands[index].name = name;
        allLands[index].url = url;
    }

    function modPrice(uint index, uint price) public {
        require(landEnd >= index, "Index too big!");
        require(allLands[index].host == msg.sender, "Only host can modify!");
        allLands[index].price = price;
    }


    function lightLand(Position calldata pos) public {
        (int32 lx, int32 ly) = center(pos);
        uint index = posLand[lx][ly];
        require(index > 0, "No Land"); 

        Last memory last = lastLight[msg.sender];
        if (last.blkNum != 0) {
            uint32 dist = distance(pos, allLands[last.locIdx].pos);
            require(block.number - last.blkNum > dist, "Too short");
        }

        passLands[msg.sender].push(index);
        landGuests[index].push(msg.sender);
        lastLight[msg.sender] = Last(block.number, index);
        emit LightLand(index);
    }

    receive() external payable{
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}