import { Injectable } from '@angular/core';
import Web3 from "web3";
declare let window:any;
import NFTPlace from '../abis/NFTPlace.json'
import * as ipfsClient from 'ipfs-http-client'

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  web3: any;
  accounts: Array<String> = [];
  public images: any[] = [];

  ipfs = ipfsClient.create({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    console.log("connect")
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable;
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        window.alert('Non-Ethereum browser detected. You Should consider using MetaMask!');
    }
  }

  async loadBlockchainData(){
        console.log("load")
        const web3 = window.web3

        const accounts = await web3.eth.requestAccounts()
        if(accounts != null){
            this.accounts = accounts;
            console.log(this.accounts)
        }

        const networkData = NFTPlace.networks[5777];
        console.log(networkData)
        if(networkData){

            const nftplace = new web3.eth.Contract(NFTPlace.abi, networkData.address)
            const imagesCount = await nftplace.methods.imageCount().call()

            console.log(imagesCount)

            for(var i = 1; i <= imagesCount; i++){
                const image = await nftplace.methods.images(i).call();
                this.images.push(image);
                console.log(this.images);
            }
        }
    }

    uploadImage(file: File | undefined){
        const networkData = NFTPlace.networks[5777];
        const web3 = window.web3
        const nftplace = new web3.eth.Contract(NFTPlace.abi, networkData.address)

        console.log("Submitting file to ipfs...")
        if(file != undefined){
            //adding file to the IPFS
            this.ipfs.add(file).then(r => {
                nftplace.methods.uploadImage(r.path, "Test").send({ from: this.accounts[0] }).on('transactionHash', (hash: any) => {
                    console.log(hash)
                  });
            })

        }

  
    }
}
