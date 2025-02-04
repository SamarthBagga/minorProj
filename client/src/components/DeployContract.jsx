import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import SupplyContract from "../assets/contracts/SupplyContract.json";
import { useToast } from '@chakra-ui/react'


const DeployContract = () => {

    const toast = useToast();

    const [deployedAddress, setDeployedAddress] = useState('');

    const deployContract = async () => {
        try {
            // Check if MetaMask is installed
            if (window.ethereum) {
                // Request account access if needed
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                // Use ethers.js with MetaMask's provider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                if (provider == undefined) {
                    alert("Connect your wallet first");
                }
                const signer = provider.getSigner();

                const SimpleContractFactory = new ethers.ContractFactory(
                    SupplyContract.abi,
                    SupplyContract.data.bytecode,
                    signer
                );

                const deployedContract = await SimpleContractFactory.deploy();
                await deployedContract.deployed();

                setDeployedAddress(deployedContract.address);
                toast({
                    title: 'Your contract is deployed at ' + deployedContract.address,
                    status: 'success',
                    position: 'bottom-right',
                    duration: 4000,
                  })
const walletAddress = await signer.getAddress();
                  // API call should happen here, after address has been fetched
        const response = await fetch('http://localhost:5000/api/deploy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                walletAddress,
                deployedAddress:deployedContract.address
            }),
        });

        const data = await response.json();
        if (data.status === 'ok') {
            toast({
                title: 'Contract Added!',
                status: 'success',
                position: 'bottom-right',
                duration: 4000,
            });
        } else {
            console.log(data);
            toast({
                title: 'Error occurred while adding contract!   ',
                status: 'error',
                position: 'bottom-right',
                duration: 4000,
            });
        }
                
            } else {
                console.error('MetaMask is not installed');
            }
        } catch (error) {
            console.error('Error deploying contract:', error);
        }
    };

    return (
        <div>
            <button onClick={deployContract}>Deploy your Contract</button>
        </div>
    );
}

export default DeployContract;
