// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

contract Raffle{

    /* Address of the moderator who created this contract and 
    who can judge the winner
    */
    address public moderator;
    /* dynamic array to store the addresses of the players who have entered
    in the game 
    */
    address[] public players;

    /* Storing the address of the contract creator to the moderator state variable
    */
    constructor() {
        moderator = msg.sender;
    }

    /* players can  enter the game by sending in atleast 0.05 ether
    */
    function enterGame() public payable {
        // checks to see if the player has sufficient amount of ether to enter the game
        require(msg.value > 0.04 ether);
        players.push(msg.sender);
    }

    function chooseWinner() public moderatorRestricted{
        /* Get the index of the winning player using the current block difficulty and
        current block timestamp
        */
        uint winning_player_index = addmod(block.difficulty, block.timestamp, players.length);
        payable(players[winning_player_index]).transfer((address(this).balance));

        /*reset the players list to esnure we can play again
        */
        players = new address[](0);

    }

    modifier moderatorRestricted() {
        require(moderator == msg.sender);
        _;
    }

    function getPlayers() public view returns(address[] memory) {
        return players;
    }

}