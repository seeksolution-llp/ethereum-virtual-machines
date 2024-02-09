import * as either from 'ethers'
import { Contract } from 'ethers';
import { Wallet } from 'ethers';
import { JsonRpcProvider } from 'ethers';

export class SeekSolutionContractService {
    private provider: JsonRpcProvider
    private wallet: Wallet
    private currentOwner: string = ""
    constructor(privatekey: string, rpcName?: string, infuraKey?: string) {
        const RPC_URL = `https://${process.env.NEXT_PUBLIC_RPC_NETWORK_NAME || rpcName}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_WEB3_API_KEY || infuraKey}`
        this.provider = new either.ethers.JsonRpcProvider(RPC_URL);
        this.wallet = new either.ethers.Wallet(privatekey, this.provider);
    }

    marketplaceContract(address: string, abi: Array<any>) {
        const contract = new Contract(address, abi, this.wallet);
        return { contract }
    }

    async createWallet(functionName: string, params: Array<any>, contract: Contract) {
        const data = contract.interface.encodeFunctionData(functionName, params)
        
        const tx = await this.wallet.sendTransaction({
            to: await contract.getAddress(),
            from: this.currentOwner,
            data: data,
            // gasLimit: 21000, // Gas limit for a standard transaction
            gasPrice: either.ethers.parseUnits("22", "gwei"), // Gas price increased by 10%

        });
        const receipt = await tx.wait();
        return receipt?.hash || ""
    }

}