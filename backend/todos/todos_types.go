package todos

import (
	"errors"
	"net/http"

	"github.com/go-chi/render"
)

type Todo struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	IsCompleted bool   `json:"is_completed"`
}

type AddTodoRequest struct {
	Todo
}

func (a AddTodoRequest) Bind(r *http.Request) error {
	if a.Title == "" {
		return errors.New("missing required title field")
	}

	return nil
}

type AddTodoResponse struct {
	Todo
}

func (a AddTodoResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

type GetTodoResponse struct {
	Todo
}

func (g GetTodoResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func GetTodosResponse(todos []Todo) []render.Renderer {
	todosResponse := []render.Renderer{}
	for _, todo := range todos {
		todosResponse = append(todosResponse, &GetTodoResponse{todo})
	}

	return todosResponse
}
