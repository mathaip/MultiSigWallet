const multiSig = artifacts.require("MultiSig.sol");




module.exports = function(deployer,network,accounts) {
        var owners = [accounts[1], accounts[2],accounts[3]];
        var requiredSignatures = 2;
        deployer.deploy(multiSig,requiredSignatures,owners);

    

    
};
