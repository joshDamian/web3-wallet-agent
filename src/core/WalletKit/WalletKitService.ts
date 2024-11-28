import {
    createWalletKitWalletParams,
    CreateWalletKitWalletParams,
    CreateWalletKitWalletResponse,
    SignAndSendTransactionParams,
    TransactionResponse,
    signAndSendTransactionSchema,
    SUPPORTED_CHAINS,
    SupportedChain,
    transferTokenParams,
    TransferTokenParams,
    TokenBalancesResponse,
    BatchTransferTokenParams,
    ExportWalletParams,
    ExportWalletResponse,
} from './walletKitSchema';
import {
    BATCH_TRANSFER_TOKEN,
    EXPORT_WALLET,
    GET_TOKEN_BALANCES,
    GET_WALLET_BY_ADDRESS,
    GET_WALLET_BY_OWNER_ID,
    SIGN_AND_SEND_TRANSACTION,
    TRANSACTION_STATUS_BY_ID,
    TRANSFER_TOKEN,
    WALLETS,
} from './endpoints';
import { env } from "~/env";
import axios from "axios";

class WalletKitService {
    private static API_URL = env.WALLET_KIT_API_URL;
    public static readonly DEVELOPER_SECRET = env.WALLET_KIT_DEVELOPER_SECRET;

    private static get requiredRequestHeaders() {
        const apiToken = env.WALLET_KIT_API_TOKEN;

        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiToken}`,
            'X-WalletKit-Project-ID': env.WALLET_KIT_PROJECT_ID,
        };
    }

    public static async createUserWallet(params: CreateWalletKitWalletParams) {
        const validatedParams = createWalletKitWalletParams.parse(params);
        const requestUrl = this.API_URL + WALLETS;

        const response = await axios.post<CreateWalletKitWalletResponse>(
            requestUrl,
            validatedParams,
            {
                headers: this.requiredRequestHeaders,
            }
        );

        return response.data;
    }

    public static async getUserWalletByNetwork(ownerId: string, network: SupportedChain) {
        const requestQueryParams = new URLSearchParams({
            ownerID: ownerId,
            network,
        });
        const requestUrl = `${this.API_URL}${GET_WALLET_BY_OWNER_ID}?${requestQueryParams.toString()}`;

        const response = await axios.get<CreateWalletKitWalletResponse>(requestUrl, {
            headers: this.requiredRequestHeaders,
        });

        return response.data;
    }

    public static async getWalletByAddress(walletAddress: string, network: SupportedChain) {
        const requestQueryParams = new URLSearchParams({
            address: walletAddress,
            network,
        });
        const requestUrl = `${this.API_URL}${GET_WALLET_BY_ADDRESS}?${requestQueryParams.toString()}`;

        const response = await axios.get<CreateWalletKitWalletResponse>(requestUrl, {
            headers: this.requiredRequestHeaders,
        });

        return response.data;
    }

    public static async getUserWallets(ownerId: string) {
        const promises = SUPPORTED_CHAINS.map((network) =>
            this.getUserWalletByNetwork(ownerId, network)
        );

        const settlements = await Promise.allSettled(promises);

        const fulfilledSettlements = settlements.filter(
            (settlement) => settlement.status === 'fulfilled'
        );

        return fulfilledSettlements
            .filter((settlement) => settlement.status === 'fulfilled')
            .map((settlement) => settlement.value);
    }

    public static async signAndSendTransaction(params: SignAndSendTransactionParams) {
        const validatedParams = signAndSendTransactionSchema.parse(params);
        const requestUrl = this.API_URL + SIGN_AND_SEND_TRANSACTION;

        const response = await axios.post<TransactionResponse>(requestUrl, validatedParams, {
            headers: this.requiredRequestHeaders,
        });

        return response.data;
    }

    public static async transferToken(params: TransferTokenParams) {
        const validatedParams = transferTokenParams.parse(params);

        const requestUrl = `${this.API_URL}${TRANSFER_TOKEN}`;

        const response = await axios.post<TransactionResponse>(requestUrl, validatedParams, {
            headers: this.requiredRequestHeaders,
        });

        return response.data;
    }

    public static async getTransactionById(transactionId: string) {
        const requestQueryParams = new URLSearchParams({
            id: transactionId,
        });
        const requestUrl = `${this.API_URL}${TRANSACTION_STATUS_BY_ID}?${requestQueryParams.toString()}`;

        const response = await axios.get<TransactionResponse>(requestUrl, {
            headers: this.requiredRequestHeaders,
        });

        return response.data;
    }

    public static async waitForTransactionHash(transactionId: string) {
        let transaction = await this.getTransactionById(transactionId);

        // Keep polling as long as transaction_hash is not set, regardless of the transaction status.
        while (!transaction.transaction_hash) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            transaction = await this.getTransactionById(transactionId);
        }

        return transaction as TransactionResponse & { transaction_hash: string };
    }

    public static async getBalance(
        walletAddress: string,
        network: SupportedChain,
        contractAddress: string
    ) {
        const requestQueryParams = new URLSearchParams({
            wallet_address: walletAddress,
            network,
        });

        const requestUrl = `${this.API_URL}${GET_TOKEN_BALANCES}?${requestQueryParams.toString()}`;

        const response = await axios.get<TokenBalancesResponse>(requestUrl, {
            headers: this.requiredRequestHeaders,
        });

        const tokenBalances = response.data;

        const tokenBalance = tokenBalances.find(
            (tokenBalance) =>
                tokenBalance.contract_address.toLowerCase() === contractAddress.toLowerCase()
        );

        return tokenBalance?.display_balance ?? '0';
    }

    public static async batchTransferToken(params: BatchTransferTokenParams) {
        const requestUrl = `${this.API_URL}${BATCH_TRANSFER_TOKEN}`;

        const response = await axios.post<TransactionResponse>(requestUrl, params, {
            headers: this.requiredRequestHeaders,
        });

        return response.data;
    }

    public static async exportWallet(params: ExportWalletParams) {
        const requestUrl = `${this.API_URL}${EXPORT_WALLET}`;

        const response = await axios.post<ExportWalletResponse>(requestUrl, params, {
            headers: this.requiredRequestHeaders,
        });

        return response.data;
    }

    public static async getWalletsByNetwork(network: SupportedChain) {
        const requestQueryParams = new URLSearchParams({
            network,
        });

        const requestUrl = `${this.API_URL}${WALLETS}?${requestQueryParams.toString()}`;

        const response = await axios.get<CreateWalletKitWalletResponse[]>(requestUrl, {
            headers: this.requiredRequestHeaders,
        });

        return response.data;
    }
}

export default WalletKitService;
