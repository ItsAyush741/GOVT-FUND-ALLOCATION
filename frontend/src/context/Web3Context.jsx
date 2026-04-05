import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

// Copied ABI from the original repository HTML (abridged for core funcs)
const CONTRACT_ADDRESS = "0x87Eb929993c0eD7fc5580ff1B3b9098c28E31D87";
const ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"projectId","type":"string"},{"indexed":false,"internalType":"uint256","name":"newEstimate","type":"uint256"}],"name":"EstimateUpdated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"recordId","type":"uint256"},{"indexed":true,"internalType":"string","name":"projectId","type":"string"},{"indexed":false,"internalType":"string","name":"eventName","type":"string"},{"indexed":false,"internalType":"string","name":"contractorName","type":"string"},{"indexed":false,"internalType":"uint256","name":"projectEstimate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fundAllocated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalFundTillNow","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"recordedBy","type":"address"}],"name":"FundAllocated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"officer","type":"address"}],"name":"OfficerAdded","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"officer","type":"address"}],"name":"OfficerRemoved","type":"event"},
  {"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"authorizedOfficers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"projectEstimates","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"projectRecords","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"projectTotalFunds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"recordCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"records","outputs":[{"internalType":"uint256","name":"recordId","type":"uint256"},{"internalType":"string","name":"eventName","type":"string"},{"internalType":"string","name":"contractorName","type":"string"},{"internalType":"uint256","name":"projectEstimate","type":"uint256"},{"internalType":"uint256","name":"fundAllocated","type":"uint256"},{"internalType":"uint256","name":"totalFundTillNow","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"recordedBy","type":"address"},{"internalType":"string","name":"remarks","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"_officer","type":"address"}],"name":"addOfficer","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_officer","type":"address"}],"name":"removeOfficer","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"string","name":"_projectId","type":"string"},{"internalType":"uint256","name":"_estimate","type":"uint256"}],"name":"setProjectEstimate","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"string","name":"_projectId","type":"string"},{"internalType":"string","name":"_eventName","type":"string"},{"internalType":"string","name":"_contractorName","type":"string"},{"internalType":"uint256","name":"_fundAllocated","type":"uint256"},{"internalType":"string","name":"_remarks","type":"string"}],"name":"allocateFund","outputs":[{"internalType":"uint256","name":"recordId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_recordId","type":"uint256"}],"name":"getRecord","outputs":[{"components":[{"internalType":"uint256","name":"recordId","type":"uint256"},{"internalType":"string","name":"eventName","type":"string"},{"internalType":"string","name":"contractorName","type":"string"},{"internalType":"uint256","name":"projectEstimate","type":"uint256"},{"internalType":"uint256","name":"fundAllocated","type":"uint256"},{"internalType":"uint256","name":"totalFundTillNow","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"recordedBy","type":"address"},{"internalType":"string","name":"remarks","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct GovFundAllocation.FundRecord","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"_projectId","type":"string"}],"name":"getProjectHistory","outputs":[{"components":[{"internalType":"uint256","name":"recordId","type":"uint256"},{"internalType":"string","name":"eventName","type":"string"},{"internalType":"string","name":"contractorName","type":"string"},{"internalType":"uint256","name":"projectEstimate","type":"uint256"},{"internalType":"uint256","name":"fundAllocated","type":"uint256"},{"internalType":"uint256","name":"totalFundTillNow","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"recordedBy","type":"address"},{"internalType":"string","name":"remarks","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct GovFundAllocation.FundRecord[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"_projectId","type":"string"}],"name":"getProjectSummary","outputs":[{"internalType":"uint256","name":"estimate","type":"uint256"},{"internalType":"uint256","name":"totalAllocated","type":"uint256"},{"internalType":"uint256","name":"remaining","type":"uint256"},{"internalType":"uint256","name":"numberOfTransactions","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"_projectId","type":"string"}],"name":"verifyProjectIntegrity","outputs":[{"internalType":"bool","name":"isValid","type":"bool"},{"internalType":"uint256","name":"computedTotal","type":"uint256"}],"stateMutability":"view","type":"function"}
];

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [adminAddress, setAdminAddress] = useState(null);
  const [isOfficer, setIsOfficer] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    initWeb3();
  }, []);

  const initWeb3 = async () => {
    try {
      const w3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
      const ctr = new w3.eth.Contract(ABI, CONTRACT_ADDRESS);
      setWeb3(w3);
      setContract(ctr);

      const accs = await w3.eth.getAccounts();
      setAccounts(accs);
      
      const admin = await ctr.methods.admin().call();
      setAdminAddress(admin.toLowerCase());
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to connect to Ganache:", error);
    }
  };

  const loginAccount = async (account) => {
    setCurrentAccount(account);
    // Check if they are officer
    if (contract) {
      const isAuthOff = await contract.methods.authorizedOfficers(account).call();
      setIsOfficer(isAuthOff || account.toLowerCase() === adminAddress);
    }
  };

  const logout = () => {
    setCurrentAccount(null);
    setIsOfficer(false);
  }

  const value = {
    web3,
    contract,
    accounts,
    currentAccount,
    adminAddress,
    isAdmin: currentAccount && adminAddress && currentAccount.toLowerCase() === adminAddress.toLowerCase(),
    isOfficer,
    isConnected,
    loginAccount,
    logout
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => useContext(Web3Context);
