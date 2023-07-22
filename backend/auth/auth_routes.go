package auth

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/mateo-14/todo-api/responses"
)

func Routes(db *sql.DB, authService AuthService) http.Handler {
	r := chi.NewRouter()

	r.Post("/login", func(w http.ResponseWriter, r *http.Request) {
		body := &LoginRequest{}
		if err := render.Bind(r, body); err != nil {
			render.Render(w, r, responses.ErrInvalidRequest(err))
			return
		}

		user, err := authService.LoginUser(body.Username, body.Password)
		if err != nil {
			render.Render(w, r, responses.ErrUnauthorized(err))
			return
		}

		render.Render(w, r, AuthResponse{
			user,
		})

	})

	r.Post("/register", func(w http.ResponseWriter, r *http.Request) {
		body := &LoginRequest{}
		if err := render.Bind(r, body); err != nil {
			render.Render(w, r, responses.ErrInvalidRequest(err))
			return
		}

		err := authService.RegisterUser(body.Username, body.Password)
		if err != nil {
			render.Render(w, r, responses.ErrRender(err))
			return
		}

		w.WriteHeader(http.StatusOK)
	})

	return r
}
