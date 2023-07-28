package auth

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/go-chi/render"
	"github.com/mateo-14/todo-api/responses"
)

func Routes(db *sql.DB, authService AuthService, authToken *jwtauth.JWTAuth) http.Handler {
	r := chi.NewRouter()

	// Login endpoint
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

	// Register endpoint
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

	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(authToken))
		r.Use(jwtauth.Authenticator)

		r.Get("/check", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			fmt.Println(claims)
			userId := int(claims["user_id"].(float64))
			user, err := authService.Auth(userId)

			if err != nil {
				render.Render(w, r, responses.ErrUnauthorized(err))
				return
			}

			render.Render(w, r, AuthResponse{
				user,
			})

			w.WriteHeader(http.StatusOK)
		})
	})

	return r
}
