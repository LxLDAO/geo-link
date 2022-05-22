// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

struct Location {
    address lord;
    string name;
    Position pos;
}

struct Position {
    int32 x; // 111. 111
    int32 y;
}

struct Last {
    uint256 bNum;
    uint256 iLoc;
}

contract MeetSH is Ownable {
    mapping(address => uint256[]) public ownedLocations;
    mapping(address => Last) public lastLight;
    mapping(int32 => mapping(int32 => uint256)) public hasLocation;

    Location[] public locations;

    event LightLand(uint256 index);

    constructor() {
        locations.push(Location(msg.sender, "Meet", Position(0, 0)));
    }

    // if 8-12, return 5
    // if 13-17, return 10
    // if 18-22, return 15
    function getBound(int32 x) internal returns (int32 lx) {
        int32 z = x % 10;
        return z < 3 ? x - z - 5 : z > 7 ? x - z + 5 : x - z;
    }

    function addLocation(Location[] calldata locs) public onlyOwner {
        for (uint256 i = 0; i < locs.length; i++) {
            int32 lx = getBound(locs[i].pos.x);
            int32 ly = getBound(locs[i].pos.y);
            if (hasLocation[lx][ly] == 0) {
                locations.push(locs[i]);
                hasLocation[lx][ly] = locations.length - 1;
            }
        }
    }

    function lightLocation(Position calldata pos) public {
        int32 lx = getBound(pos.x);
        int32 ly = getBound(pos.y);
        uint256 index = hasLocation[lx][ly];
        require(index != 0, "No land");

        Last memory last = lastLight[msg.sender];
        Position memory lpos = locations[last.iLoc].pos;
        int32 dx = pos.x > lpos.x ? pos.x - lpos.x : lpos.x - pos.x;
        int32 dy = pos.y > lpos.y ? pos.y - lpos.y : lpos.y - pos.y;
        require(block.number - last.bNum > uint32(dx + dx), "Too short");

        ownedLocations[msg.sender].push(index);
        Location memory loc = locations[index];
        loc.lord = msg.sender;
        emit LightLand(index);
    }
}
