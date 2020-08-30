var multiSig = artifacts.require("../contracts/MultiSig.sol");
var Web3 = require('web3')
const { ethers } = require('ethers')


var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))

const deployMultisig = (owners, confirmations) => {
    return multiSig.new(owners, confirmations)
}



contract("multiSig", (accounts) => {
    let multisigInstance
    const requiredSignatures = 2;
    const owners = [accounts[0], accounts[1]]


    beforeEach(async () => {
        multisigInstance = await deployMultisig(requiredSignatures, [accounts[0], accounts[1]])
        assert.ok(multisigInstance)
    })

    it('create multisig wallet & send 10000 deposit', async () => {
        const deposit = 10000
        
        // Send money to wallet contract
        await new Promise((resolve, reject) => web3.eth.sendTransaction({to: multisigInstance.address, value: deposit, from: accounts[0]}, e => (e ? reject(e) : resolve())))
        const balance = await web3.eth.getBalance(multisigInstance.address)
        assert.equal(balance.valueOf(), deposit)
        console.log(balance);

    });

    
    it('should execute the transaction', async()=>{
        const msgHash = web3.utils.sha3('I am one of the owners of this wallet');
        const signature =  await web3.eth.sign( msgHash, accounts[0]);
        const signingAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(msgHash), signature)
        var sigR = `0x${signature.slice(0, 64)}`
        var sigS = `0x${signature.slice(64, 128)}`
        var sigV = web3.utils.toHex(signature.slice(128, 130)) + 27
        const destinationAddr = accounts[4]
        const value = 100000;
        destinationAddrBalance = await web3.eth.getBalance(destinationAddr)
        await multisigInstance.execute(sigR,sigS,sigV,destinationAddr,value,msgHash, {from: accounts[0], gasLimit: 1000000});
        assert.equal(signingAddress,accounts[0], true)
        assert.equal(destinationAddrBalance.valueOf(), value)
        
   
    })
    
    it('should check owners array',async()=>{
         for (var i=0; i<owners.length; i++) {
            let ownerFromContract = await multisigInstance.ownersArr.call(i)
            assert.equal(owners[i], ownerFromContract)
    }
    
    })
    it('should have nounce of zero',async()=>{
        let nonce = await multisigInstance.nonce.call()
        assert.equal(nonce.toNumber(), 0)
    })

}) 


    

