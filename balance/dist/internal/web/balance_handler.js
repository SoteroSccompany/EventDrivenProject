"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BalanceHandler {
    constructor(props) {
        this._getBalanceUsecase = props.GetBalanceUsecase;
    }
    async execute(req, res) {
        try {
            const { clientId } = req.params;
            if (!clientId) {
                res.status(400).send('clientId is required');
                return;
            }
            const balance = await this._getBalanceUsecase.execute({ id: clientId });
            res.status(200).send(balance);
        }
        catch (error) {
            console.log("Error: ", error);
            res.status(500).send(error.message);
        }
    }
}
exports.default = BalanceHandler;
