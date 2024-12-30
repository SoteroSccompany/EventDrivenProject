import BalanceEntity from "../entity/balance";



export interface BalanceGateway {
    saveBalance(balance: BalanceEntity): Promise<void>;
    getBalance(accountID: string): Promise<BalanceEntity>;
}