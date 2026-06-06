package database

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

type DB struct {
	Pool *pgxpool.Pool
}

func Connect(databaseURL string) *DB {
	pool, err := pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		log.Fatal("Cannot connect to database:", err)
	}

	if err := pool.Ping(context.Background()); err != nil {
		log.Fatal("Cannot ping database:", err)
	}

	log.Println("Connected to database")
	return &DB{Pool: pool}
}