package gateway

import "github.com.br/Soter-Tec/ms-wallet/internal/entity"

type TransactionGateway interface {
	Create(transaction *entity.Transaction) error
}
