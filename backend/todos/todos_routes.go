package todos

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/go-chi/render"
	"github.com/mateo-14/todo-api/jwt"
	"github.com/mateo-14/todo-api/responses"
)

func Routes(db *sql.DB) http.Handler {
	r := chi.NewRouter()

	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(jwt.AuthToken))
		r.Use(jwtauth.Authenticator)

		r.Post("/", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			userId := int(claims["user_id"].(float64))
			fmt.Println(userId)
			body := &AddTodoRequest{}
			if err := render.Bind(r, body); err != nil {
				render.Render(w, r, responses.ErrInvalidRequest(err))
				return
			}

			render.Render(w, r, &AddTodoResponse{body.Todo})
		})
	})

	return r
}
