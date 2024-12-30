package create_client

import (
	"time"

	"github.com.br/Soter-Tec/ms-wallet/internal/entity"
	"github.com.br/Soter-Tec/ms-wallet/internal/gateway"
)

type CreateClientInputDto struct {
	Name  string
	Email string
}

type CreateClientOutputDto struct {
	ID        string
	Name      string
	Email     string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type CreateClientUsecase struct {
	ClientGateway gateway.ClientGateway
}

func NewCreateClientUseCase(clientGateway gateway.ClientGateway) *CreateClientUsecase {
	return &CreateClientUsecase{
		ClientGateway: clientGateway,
	}
}

func (uc *CreateClientUsecase) Execute(input CreateClientInputDto) (*CreateClientOutputDto, error) {
	client, err := entity.NewClient(input.Name, input.Email)
	if err != nil {
		return nil, err
	}
	err = uc.ClientGateway.Save(client)
	if err != nil {
		return nil, err
	}
	return &CreateClientOutputDto{
		ID:        client.ID,
		Name:      client.Name,
		Email:     client.Email,
		CreatedAt: client.CreatedAt,
		UpdatedAt: client.UpdatedAt,
	}, nil
}
