package todos

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/mateo-14/todo-api/jwt"
)

func Routes(db *sql.DB) http.Handler {
	r := chi.NewRouter()

	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(jwt.AuthToken))
		r.Use(jwtauth.Authenticator)

		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("todos"))
		})
	})

	return r
}
