import BalanceEntity from "./balance";



describe("Balance tests", () => {


    it("should throw error when balance is negative", () => {
        try {
            new BalanceEntity({ balance: -1, accountID: '123' });
        } catch (error) {
            expect((error as Error).message).toBe('Balance cannot be negative');
        }
    });

    it("should throw error when accountId is null", () => {
        try {
            new BalanceEntity({ balance: 0, accountID: '' });
        } catch (error) {
            expect((error as Error).message).toBe('Account ID cannot be empty');
        }
    });

    it("should create a valid balance", () => {
        expect(() => {
            new BalanceEntity({ balance: 0, accountID: '123' });
        }).not.toThrow();
    });


});