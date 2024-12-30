


export interface SaveBalanceInputDto {
    accountID: string;
    balance: number;
}

export interface SaveBalanceOutputDto {
    id: string;
    accountID: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}