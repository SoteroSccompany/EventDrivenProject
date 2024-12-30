import BalanceEntity from "../../entity/balance";
import { BalanceGateway } from "../../gateway/balance.gateway";
import { UsecaseGateway } from "../../gateway/usecase.gateway";
import { GetBalanceInputDto, GetBalanceOutputDto } from "./get-balance.dto";





export default class GetBalanceUsecase implements UsecaseGateway {

    private _repository: BalanceGateway;

    constructor(repository: BalanceGateway) {
        this._repository = repository;
    }


    async execute(input: GetBalanceInputDto): Promise<GetBalanceOutputDto> {
        const balance = await this._repository.getBalance(input.id);
        if (!balance) {
            throw new Error('Balance not found');
        }
        return {
            id: balance.id,
            balance: balance.balance,
            accountID: balance.accountID,
            createdAt: balance.createdAt,
            updatedAt: balance.updatedAt
        }
    }


}