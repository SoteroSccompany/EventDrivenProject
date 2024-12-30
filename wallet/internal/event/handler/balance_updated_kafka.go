package handler

import (
	"fmt"
	"sync"

	"github.com.br/Soter-Tec/ms-wallet/pkg/events"
	"github.com.br/Soter-Tec/ms-wallet/pkg/kafka"
)

type UpdateBalanceKafkaHandler struct {
	Kafka *kafka.Producer
}

func NewUpdateBalanceKafkaHandler(kafka *kafka.Producer) *UpdateBalanceKafkaHandler {
	return &UpdateBalanceKafkaHandler{
		Kafka: kafka,
	}
}

func (h *UpdateBalanceKafkaHandler) Handle(message events.EventInterface, wg *sync.WaitGroup) {
	defer wg.Done() //Depois de tudo executado ele da o done
	h.Kafka.Publish(message, nil, "balances")
	fmt.Println("UpdateBalanceKafka called:", message.GetPayload())

}
