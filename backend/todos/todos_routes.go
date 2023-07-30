package todos

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/go-chi/render"
	"github.com/mateo-14/todo-api/responses"
)

func Routes(db *sql.DB, todosService TodosService, authToken *jwtauth.JWTAuth) http.Handler {
	r := chi.NewRouter()

	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(authToken))
		r.Use(jwtauth.Authenticator)

		// Get todos endpoint
		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			userId := int(claims["user_id"].(float64))

			todos, err := todosService.GetTodos(userId)
			if err != nil {
				render.Render(w, r, responses.ErrInternalServer(err))
				return
			}

			render.RenderList(w, r, GetTodosResponse(todos))
		})

		// Add todo endpoint
		r.Post("/", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			userId := int(claims["user_id"].(float64))

			body := &AddTodoRequest{}
			if err := render.Bind(r, body); err != nil {
				render.Render(w, r, responses.ErrInvalidRequest(err))
				return
			}

			todo, err := todosService.CreateTodo(body.Title, userId)
			if err != nil {
				render.Render(w, r, responses.ErrInternalServer(err))
				return
			}

			render.Render(w, r, &AddTodoResponse{todo})
		})

		// Complete todo endpoint
		r.Put("/{id}/complete", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			userId := int(claims["user_id"].(float64))

			todoIdParam := chi.URLParam(r, "id")
			todoId, _ := strconv.Atoi(todoIdParam)

			err := todosService.CompleteTodo(todoId, userId)
			if err != nil {
				if err == errNotFoundTodo {
					render.Render(w, r, responses.ErrNotFound(err))
					return
				}

				render.Render(w, r, responses.ErrInternalServer(err))
				return
			}

			w.WriteHeader(http.StatusOK)
		})

		r.Delete("/{id}/complete", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			userId := int(claims["user_id"].(float64))

			todoIdParam := chi.URLParam(r, "id")
			todoId, _ := strconv.Atoi(todoIdParam)

			err := todosService.UncompleteTodo(todoId, userId)
			if err != nil {
				if err == errNotFoundTodo {
					render.Render(w, r, responses.ErrNotFound(err))
					return
				}

				render.Render(w, r, responses.ErrInternalServer(err))
				return
			}

			w.WriteHeader(http.StatusOK)
		})

		// Delete todo endpoint
		r.Delete("/{id}", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			userId := int(claims["user_id"].(float64))

			todoIdParam := chi.URLParam(r, "id")
			todoId, _ := strconv.Atoi(todoIdParam)

			err := todosService.DeleteTodo(todoId, userId)
			if err != nil {
				if err == errNotFoundTodo {
					render.Render(w, r, responses.ErrNotFound(err))
					return
				}

				render.Render(w, r, responses.ErrInternalServer(err))
				return
			}

			w.WriteHeader(http.StatusOK)
		})
	})

	return r
}
