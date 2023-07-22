package main

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/mateo-14/todo-api/auth"
	"github.com/mateo-14/todo-api/todos"
)

type Todo struct {
	Id        int    `json:"id"`
	Text      string `json:"text"`
	Completed bool   `json:"completed"`
}

const connectionString = "postgres://postgres:admin@localhost:5432/todos?sslmode=disable"

func main() {
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		panic(err)
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	setupRoutes(r, db)

	http.ListenAndServe(":8080", r)
}

func setupRoutes(r *chi.Mux, db *sql.DB) {
	// Create dependencies
	authRepository := auth.NewAuthRepository(db)
	authService := auth.NewAuthService(authRepository)

	r.Route("/api", func(r chi.Router) {
		r.Mount("/auth", auth.Routes(db, authService))
		r.Mount("/todos", todos.Routes(db))
	})

}
