package handler

import (
	"fmt"
	"sync"

	"github.com.br/Soter-Tec/ms-wallet/pkg/events"
	"github.com.br/Soter-Tec/ms-wallet/pkg/kafka"
)

type TransactionCreatedKafkaHandler struct {
	Kafka *kafka.Producer
}

func NewTransactionCreatedKafkaHandler(kafka *kafka.Producer) *TransactionCreatedKafkaHandler {
	return &TransactionCreatedKafkaHandler{
		Kafka: kafka,
	}
}

func (h *TransactionCreatedKafkaHandler) Handle(message events.EventInterface, wg *sync.WaitGroup) {
	defer wg.Done() //Depois de tudo executado ele da o done
	h.Kafka.Publish(message, nil, "transactions")
	fmt.Println("TransactionCreatedKafkaHandler:", message.GetPayload())

}
