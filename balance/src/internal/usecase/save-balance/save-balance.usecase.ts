import BalanceEntity from "../../entity/balance";
import { BalanceGateway } from "../../gateway/balance.gateway";
import { UsecaseGateway } from "../../gateway/usecase.gateway";
import { SaveBalanceInputDto, SaveBalanceOutputDto } from "./save-balance.dto";





export default class SaveBalanceUsecase implements UsecaseGateway {

    private _repository: BalanceGateway;

    constructor(repository: BalanceGateway) {
        this._repository = repository;
    }


    async execute(input: SaveBalanceInputDto): Promise<SaveBalanceOutputDto> {
        try {
            const balance = new BalanceEntity(input);
            await this._repository.saveBalance(balance);
            return balance;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }


}