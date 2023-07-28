package main

import (
	"database/sql"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth/v5"
	"github.com/joho/godotenv"
	"github.com/mateo-14/todo-api/auth"
	"github.com/mateo-14/todo-api/todos"
)

type Todo struct {
	Id        int    `json:"id"`
	Text      string `json:"text"`
	Completed bool   `json:"completed"`
}

func main() {
	godotenv.Load()

	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
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
	authToken := jwtauth.New("HS256", []byte(os.Getenv("TOKEN_SECRET")), nil)

	authRepository := auth.NewAuthRepository(db)
	authService := auth.NewAuthService(authRepository, authToken)
	todosRepository := todos.NewTodosRepository(db)
	todosService := todos.NewTodosService(todosRepository)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/api", func(r chi.Router) {
		r.Mount("/auth", auth.Routes(db, authService, authToken))
		r.Mount("/todos", todos.Routes(db, todosService, authToken))
	})

}
