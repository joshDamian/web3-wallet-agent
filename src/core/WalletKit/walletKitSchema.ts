import { z } from 'zod';
import { isAddress, isHex } from 'viem';

export const SUPPORTED_CHAINS = ['Polygon', 'Base', 'Optimism', 'Ethereum'] as const;
export const supportedChainSchema = z.enum(SUPPORTED_CHAINS);
export type SupportedChain = z.infer<typeof supportedChainSchema>;

export const walletControlMode = z.enum(['developer', 'user']);

export const createWalletKitWalletParams = z
    .object({
        name: z.string(),
        network: supportedChainSchema,
        owner_id: z.string(),
        control_mode: walletControlMode,
        developer_secret: z.string().optional(),
        user_pin: z.string().optional(),
        type: z.enum(['eoa', 'contract']),
    })
    .refine((data) => {
        return data.developer_secret || data.user_pin;
    }, 'developer_secret or user_pin should be provided');

export type CreateWalletKitWalletParams = z.infer<typeof createWalletKitWalletParams>;

export const createWalletKitWalletResponse = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    network: supportedChainSchema,
    owner_id: z.string(),
    control_mode: walletControlMode,
    type: z.string(),
});

export type CreateWalletKitWalletResponse = z.infer<typeof createWalletKitWalletResponse>;

export const walletAddressSchema = (name: string) =>
    z.string().refine((data) => isAddress(data), `${name} should be a valid address`);
export const hexStringSchema = (name: string) =>
    z.string().refine((data) => isHex(data), `${name} should be a hex string`);

export const signAndSendTransactionSchema = z.object({
    network: supportedChainSchema,
    signer_wallet_address: walletAddressSchema('signer_wallet_address'),
    unsigned_transaction: z.object({
        to: walletAddressSchema('signer_wallet_address'),
        input: hexStringSchema('input').optional(),
        value: hexStringSchema('value').optional(),
    }),
    developer_secret: z.string(),
});

export type SignAndSendTransactionParams = z.infer<typeof signAndSendTransactionSchema>;

export const transactionResponse = z.object({
    transaction_id: z.string(),
    network: supportedChainSchema,
    status: z.enum(['success', 'submitted', 'failed', 'pending']),
    contract_address: z.string().nullable(),
    explorer_url: z.string().url().nullable(),
    transaction_hash: z.string().nullable(),
});

export type TransactionResponse = z.infer<typeof transactionResponse>;

export const transferTokenParams = z
    .object({
        network: supportedChainSchema,
        from: z.string(),
        token: z.string(),
        recipient: z.string(),
        amount: z.string(),
        developer_secret: z.string().optional(),
        user_pin: z.string().optional(),
    })
    .refine((data) => {
        return data.developer_secret || data.user_pin;
    }, 'developer_secret or user_pin should be provided');

export type TransferTokenParams = z.infer<typeof transferTokenParams>;

export const tokenBalanceResponseItem = z.object({
    uuid: z.string(),
    network: z.string(),
    contract_address: z.string(),
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
    display_decimals: z.number(),
    logo_url: z.string(),
    raw_balance: z.string(),
    display_balance: z.string(),
});

export const tokenBalancesResponse = z.array(tokenBalanceResponseItem);

export type TokenBalancesResponse = z.infer<typeof tokenBalancesResponse>;

export const batchTransferTokenParams = z
    .object({
        network: supportedChainSchema,
        from: z.string(),
        token: z.string(),
        transfers: z.array(
            z.object({
                recipient: z.string(),
                amount: z.string(),
            })
        ),
        developer_secret: z.string().optional(),
        user_pin: z.string().optional(),
    })
    .refine((data) => {
        return data.developer_secret || data.user_pin;
    }, 'developer_secret or user_pin should be provided');

export type BatchTransferTokenParams = z.infer<typeof batchTransferTokenParams>;

export const exportWalletParams = z.object({
    network: supportedChainSchema,
    address: z.string(),
    developer_secret: z.string(),
});

export type ExportWalletParams = z.infer<typeof exportWalletParams>;

export const exportWalletResponse = z.object({
    mnemonic_phrase: z.string(),
    private_key: z.string(),
});

export type ExportWalletResponse = z.infer<typeof exportWalletResponse>;
