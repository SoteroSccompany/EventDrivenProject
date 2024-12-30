package database

import (
	"database/sql"
	"testing"

	"github.com.br/Soter-Tec/ms-wallet/internal/entity"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
)

type TransactionDBTestSuite struct {
	suite.Suite
	db            *sql.DB
	client        *entity.Client
	client2       *entity.Client
	accouontFrom  *entity.Account
	accouontTo    *entity.Account
	TransactionDB *TransactionDB
}

func (s *TransactionDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)
	s.db = db
	db.Exec("CREATE TABLE clients (id varchar(255), name varchar(255), email varchar(255), created_at date)")
	db.Exec("CREATE TABLE accounts (id varchar(255), client_id varchar(255), balance int, created_at date)")
	db.Exec("CREATE TABLE transactions (id varchar(255), account_id_from varchar(255), account_id_to varchar(255), amount int, created_at date)")
	client, err := entity.NewClient("john", "j@j.com")
	s.Nil(err)
	s.client = client
	client2, err := entity.NewClient("john2", "jj@jj.com")
	s.Nil(err)
	s.client2 = client2
	//creating account
	accountFrom := entity.NewAccount(client)
	accountFrom.Balance = 100
	s.accouontFrom = accountFrom
	accountTo := entity.NewAccount(client2)
	accountTo.Balance = 100
	s.accouontTo = accountTo
	s.TransactionDB = NewTransactionDB(db)
}

func (s *TransactionDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE clients")
	s.db.Exec("DROP TABLE accounts")
	s.db.Exec("DROP TABLE transactions")
}

func TestTransactionDBTestSuite(t *testing.T) {
	suite.Run(t, new(TransactionDBTestSuite))
}

func (s *TransactionDBTestSuite) TestCreate() {
	err := s.TransactionDB.Create(&entity.Transaction{
		AccountFrom: s.accouontFrom,
		AccountTo:   s.accouontTo,
		Amount:      10,
	})
	s.Nil(err)
}
