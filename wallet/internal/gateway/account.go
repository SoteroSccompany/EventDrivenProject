package gateway

import "github.com.br/Soter-Tec/ms-wallet/internal/entity"

type AccountGateway interface {
	Save(client *entity.Account) error
	FindByID(id string) (*entity.Account, error)
	UpdateBalance(account *entity.Account) error
}
