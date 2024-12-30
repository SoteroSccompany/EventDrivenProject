import { UsecaseGateway } from "../gateway/usecase.gateway";
import GetBalanceUsecase from "../usecase/get-balance/get-balance.usecase"
import { Request, Response } from 'express';



type BalanceHandlerProps = {
    GetBalanceUsecase: UsecaseGateway;
}


export default class BalanceHandler {

    private _getBalanceUsecase: UsecaseGateway;

    constructor(props: BalanceHandlerProps) {
        this._getBalanceUsecase = props.GetBalanceUsecase;
    }

    async execute(req: Request, res: Response) {
        try {
            const { clientId } = req.params;
            if (!clientId) {
                res.status(400).send('clientId is required');
                return;
            }
            const balance = await this._getBalanceUsecase.execute({ id: clientId });
            res.status(200).send(balance);
        } catch (error) {
            console.log("Error: ", error)
            res.status(500).send((error as Error).message);
        }

    }




}