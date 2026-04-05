const Web3 = require("web3");
const contractJSON = require("../build/contracts/GovFundAllocation.json");

const web3 = new Web3("http://127.0.0.1:7545");

let contract;

async function init() {
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();

    const deployed = contractJSON.networks[networkId];

    contract = new web3.eth.Contract(
        contractJSON.abi,
        deployed.address
    );

    return { web3, contract, accounts };
}

module.exports = { init };