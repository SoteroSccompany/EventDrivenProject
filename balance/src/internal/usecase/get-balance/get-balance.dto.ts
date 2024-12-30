


export interface GetBalanceInputDto {
    id: string;
}

export interface GetBalanceOutputDto {
    id: string;
    balance: number;
    accountID: string;
    createdAt: Date;
    updatedAt: Date;
}