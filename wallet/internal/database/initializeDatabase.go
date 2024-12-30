package database

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

func InitializeDatabase(db *sql.DB) error {
	// Criar tabelas se não existirem
	createClientsTable := `
	CREATE TABLE IF NOT EXISTS clients (
		id VARCHAR(255) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL,
		created_at DATE NOT NULL
	);`
	_, err := db.Exec(createClientsTable)
	if err != nil {
		return err
	}

	createAccountsTable := `
	CREATE TABLE IF NOT EXISTS accounts (
		id VARCHAR(255) PRIMARY KEY,
		client_id VARCHAR(255) NOT NULL,
		balance INT NOT NULL,
		created_at DATE NOT NULL,
		FOREIGN KEY(client_id) REFERENCES clients(id)
	);`
	_, err = db.Exec(createAccountsTable)
	if err != nil {
		return err
	}

	createTransactionsTable := `
	CREATE TABLE IF NOT EXISTS transactions (
		id VARCHAR(255) PRIMARY KEY,
		account_id_from VARCHAR(255) NOT NULL,
		account_id_to VARCHAR(255) NOT NULL,
		amount INT NOT NULL,
		created_at DATE NOT NULL,
		FOREIGN KEY(account_id_from) REFERENCES accounts(id),
		FOREIGN KEY(account_id_to) REFERENCES accounts(id)
	);`
	_, err = db.Exec(createTransactionsTable)
	if err != nil {
		return err
	}

	// Verificar se existem dados na tabela "clients"
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM clients").Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		// Inserir dados iniciais para "clients" e "accounts"
		johnDoeID := uuid.New().String()
		janeDoeID := uuid.New().String()
		johnDoeAccountID := uuid.New().String()
		janeDoeAccountID := uuid.New().String()
		currentDate := time.Now().Format("2006-01-02")

		// Inserir John Doe
		_, err = db.Exec(
			"INSERT INTO clients (id, name, email, created_at) VALUES (?, ?, ?, ?)",
			johnDoeID, "John Doe", "john.doe@example.com", currentDate,
		)
		if err != nil {
			return err
		}

		// Inserir Jane Doe
		_, err = db.Exec(
			"INSERT INTO clients (id, name, email, created_at) VALUES (?, ?, ?, ?)",
			janeDoeID, "Jane Doe", "jane.doe@example.com", currentDate,
		)
		if err != nil {
			return err
		}

		// Criar conta para John Doe com saldo inicial de 1000
		_, err = db.Exec(
			"INSERT INTO accounts (id, client_id, balance, created_at) VALUES (?, ?, ?, ?)",
			johnDoeAccountID, johnDoeID, 1000, currentDate,
		)
		if err != nil {
			return err
		}

		// Criar conta para Jane Doe com saldo inicial de 0
		_, err = db.Exec(
			"INSERT INTO accounts (id, client_id, balance, created_at) VALUES (?, ?, ?, ?)",
			janeDoeAccountID, janeDoeID, 0, currentDate,
		)
		if err != nil {
			return err
		}
	}

	return nil
}
