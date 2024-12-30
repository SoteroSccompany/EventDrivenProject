package main

import (
	"context"
	"database/sql"
	"fmt"

	"github.com.br/Soter-Tec/ms-wallet/internal/database"
	"github.com.br/Soter-Tec/ms-wallet/internal/event"
	"github.com.br/Soter-Tec/ms-wallet/internal/event/handler"
	"github.com.br/Soter-Tec/ms-wallet/internal/usecase/create_account"
	"github.com.br/Soter-Tec/ms-wallet/internal/usecase/create_client"
	"github.com.br/Soter-Tec/ms-wallet/internal/usecase/create_transaction"
	"github.com.br/Soter-Tec/ms-wallet/internal/web"
	"github.com.br/Soter-Tec/ms-wallet/internal/web/webserver"
	"github.com.br/Soter-Tec/ms-wallet/pkg/events"
	"github.com.br/Soter-Tec/ms-wallet/pkg/kafka"
	"github.com.br/Soter-Tec/ms-wallet/pkg/uow"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "mysql", "3306", "wallet"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	database.InitializeDatabase(db)

	configMap := ckafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "wallet",
	}
	kafkaProducer := kafka.NewKafkaProducer(&configMap)

	eventDispatcher := events.NewEventDispatcher()
	eventDispatcher.Register("TransactionCreated", handler.NewTransactionCreatedKafkaHandler(kafkaProducer))
	eventDispatcher.Register("BalanceUpdated", handler.NewUpdateBalanceKafkaHandler(kafkaProducer))
	transactionCreatedEvent := event.NewTransactionCreated()
	balanceUpdatedEvent := event.NewBalanceUpdated()

	clientDb := database.NewClientDB(db)
	accountDb := database.NewAccountDB(db)

	ctx := context.Background()
	uow := uow.NewUow(ctx, db)
	uow.Register("AccountDB", func(tx *sql.Tx) interface{} {
		return database.NewAccountDB(db)
	})
	uow.Register("TransactionDB", func(tx *sql.Tx) interface{} {
		return database.NewTransactionDB(db)
	})

	createTransactionUsecase := create_transaction.NewCreateTransactionUseCase(uow, eventDispatcher, transactionCreatedEvent, balanceUpdatedEvent)
	createClientUseCase := create_client.NewCreateClientUseCase(clientDb)
	createAccountUseCase := create_account.NewCreateAccountUseCase(accountDb, clientDb)

	webServer := webserver.NewWebServer(":8080")

	clientHandler := web.NewWebClientHandler(*createClientUseCase)
	accountHandler := web.NewWebAccountHandler(*createAccountUseCase)
	transactionHandler := web.NewWebTransactionHandler(*createTransactionUsecase)

	webServer.AddHandler("/clients", clientHandler.CreateClient)
	webServer.AddHandler("/accounts", accountHandler.CreateAccount)
	webServer.AddHandler("/transactions", transactionHandler.CreateTransaction)

	fmt.Println("Server running on port 8080")
	webServer.Start()
}
