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




/*let createSignatures = function(signers, multisigAddr, nonce, destinationAddr, value, data, executor){
    var msg = '0x8CbaC5e4d803bE2A3A5cd3DbE7174504c6DD0c1C'
 
    var h = web3.sha3(msg)
    var sig = web3.eth.sign(address, h).slice(2)
    var sigR = `0x${sig.slice(0, 64)}`
    var sigS = `0x${sig.slice(64, 128)}`
    var sigV = web3.toDecimal(sig.slice(128, 130)) + 27


 }


let executeTransaction = async function(owners, requiredSignatures, signers, done){

    let multisig = await multiSig.new(requiredSignatures, owners, {from: accounts[0]})
    let randomAddr = web3.sha3(Math.random().toString()).slice(0,42)
    let executor = accounts[0]
    let msgSender = accounts[0]
    
    await web3.eth.sendTransaction({from: accounts[0], to: multisig.address, value: web3.toWei(web3.toBigNumber(0.1), 'ether')})

    let nonce = await multisig.nonce.call()
    assert.equal(nonce.toNumber(), 0)

    let bal = await web3.eth.getBalance(multisig.address)
    assert.equal(bal, web3.toWei(0.1, 'ether'))

    for (var i=0; i<owners.length; i++) {
      let ownerFromContract = await multisig.ownersArr.call(i)
      assert.equal(owners[i], ownerFromContract)
    }
    
    let value = web3.toWei(web3.toBigNumber(0.01), 'ether')
    let sigs = createSigs(signers, multisig.address, nonce, randomAddr, value, '', executor)

    await multisig.execute(sigV, sigR,sigS, randomAddr, value, '', executor, 21000, {from: msgSender, gasLimit: 1000000})


}


})
*/
}) 


    

