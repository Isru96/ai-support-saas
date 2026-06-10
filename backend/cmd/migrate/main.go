package main

import (
	"errors"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	steps := flag.Int("steps", 0, "number of migrations to run (positive=up, negative=down)")
	flag.Parse()

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://postgres:postgres@localhost:5432/ai_support?sslmode=disable"
	}

	migrationsPath := os.Getenv("MIGRATIONS_PATH")
	if migrationsPath == "" {
		wd, err := os.Getwd()
		if err != nil {
			log.Fatal(err)
		}
		migrationsPath = filepath.ToSlash(filepath.Join(wd, "migrations"))
	}

	sourceURL := fmt.Sprintf("file://%s", migrationsPath)
	m, err := migrate.New(sourceURL, databaseURL)
	if err != nil {
		log.Fatal("failed to create migrate instance:", err)
	}
	defer m.Close()

	command := "up"
	if flag.NArg() > 0 {
		command = flag.Arg(0)
	}

	switch command {
	case "up":
		if *steps != 0 {
			if err := m.Steps(*steps); err != nil && !errors.Is(err, migrate.ErrNoChange) {
				log.Fatal(err)
			}
		} else if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatal(err)
		}
	case "down":
		if *steps != 0 {
			if err := m.Steps(*steps); err != nil && !errors.Is(err, migrate.ErrNoChange) {
				log.Fatal(err)
			}
		} else if err := m.Down(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatal(err)
		}
	case "version":
		version, dirty, err := m.Version()
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("version: %d dirty: %v\n", version, dirty)
	case "force":
		if flag.NArg() < 2 {
			log.Fatal("usage: migrate force <version>")
		}
		var version int
		if _, err := fmt.Sscanf(flag.Arg(1), "%d", &version); err != nil {
			log.Fatal("invalid version:", err)
		}
		if err := m.Force(version); err != nil {
			log.Fatal(err)
		}
		log.Printf("forced migration version to %d", version)
	default:
		log.Fatalf("unknown command %q (use up, down, version, or force)", command)
	}

	version, dirty, err := m.Version()
	if err != nil && !errors.Is(err, migrate.ErrNilVersion) {
		log.Fatal(err)
	}
	if !errors.Is(err, migrate.ErrNilVersion) {
		log.Printf("migration complete — version: %d dirty: %v", version, dirty)
	} else {
		log.Println("migration complete — no version applied yet")
	}
}
