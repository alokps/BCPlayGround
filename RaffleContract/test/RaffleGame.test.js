const assert = require('assert');
const ganache = require('ganache-cli');

const Web3 = require('web3');

const web3_instance = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let raffle;

beforeEach(async () => {
    // get the dummy accounts from Ganache local network
    accounts = await web3_instance.eth.getAccounts();

    // Deploy the contract to the Ganache local network
    // the inbox object here gives us direct access to the contract on the BC network
    // we can call functions on the contract as are coded in the contract side.
    raffle = await new web3_instance.eth.Contract(abi)
    // deploy creates an object that can then be deployed to the network using send
    .deploy( {data: evm.bytecode.object})
    // Send command deploys the contract on the blockchain network
    // Send command sends the contract from web3 lib  to Decentralized network
    .send({from: accounts[0], gas: '1000000'});
});

describe("Raffle", () => {
    
    it("RaffleContract", () => {
        //console.log(raffle);
        assert.ok(raffle.options.address);
    })

    it("Entering the first player", async () => {
        await raffle.methods.enterGame().send({
            from: accounts[0],
            value: web3_instance.utils.toWei('0.05', 'ether')
        }); 

        const players = await raffle.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0]);
        assert.equal(players.length, 1);

    })

    it("Entering multiple players", async () => {
        await raffle.methods.enterGame().send({
            from: accounts[0],
            value: web3_instance.utils.toWei('0.05', 'ether')
        });

        await raffle.methods.enterGame().send({
            from: accounts[1],
            value: web3_instance.utils.toWei('0.05', 'ether')
        });

        await raffle.methods.enterGame().send({
            from: accounts[2],
            value: web3_instance.utils.toWei('0.05', 'ether')
        }); 

        const players = await raffle.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(players.length, 3);
    })

    it("verify that the players sends min amount to enter", async () => {
         try{
             await raffle.methods.enterGame() .send({
                 from: accounts[0],
                 value: 500 // this is in Wei
             });
            /* Since this test will error when the try block is hit
            the assert false here checks to see if the try block passes
            this statment fails the test.
             */
            assert(flase);
         } catch (err) {
             assert(err);
         }

    })

    it("only moderator can choose winner", async () => {
        try{
            await raffle.methods.chooseWinner().send({
                from: accounts[1]
            });
           /* Since this test will error when the try block is hit
           the assert false here checks to see if the try block passes
           this statment fails the test.
            */
           assert(flase);
        } catch (err) {
            assert(err);
        }
   });

   it("send balance to winner and resets players array", async () => {

    await raffle.methods.enterGame().send({
        from: accounts[0],
        value: web3_instance.utils.toWei('5', 'ether')
    });

    const intialBalance = await web3_instance.eth.getBalance(accounts[0]);

    await raffle.methods.chooseWinner().call({
        from: accounts[0]
    });

    const finalBalance = await web3_instance.eth.getBalance(accounts[0]);
    
    const diff = finalBalance - intialBalance;

    assert.equal(diff, 0);

   });
})