package database

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func Connect() {
	url := "postgres://postgres:postgres@localhost:5432/ai_support"
	pool, err := pgxpool.New(context.Background(), url)
	if err != nil {
		log.Fatal("Cannot connect to database:", err)
	}
	DB = pool
	log.Println("Connected to database")
}