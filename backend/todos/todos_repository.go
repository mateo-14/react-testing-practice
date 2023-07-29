package todos

import (
	"database/sql"
	"errors"
)

type TodosRepository interface {
	AddTodo(title string, userId int) error
	GetTodos(userId int) ([]Todo, error)
	CompleteTodo(id int, userId int) error
	UncompleteTodo(id int, userId int) error
}

type todosRepository struct {
	db *sql.DB
}

func NewTodosRepository(db *sql.DB) TodosRepository {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, title VARCHAR(50), is_completed BOOLEAN DEFAULT false, user_id INTEGER REFERENCES users(id))")
	if err != nil {
		panic(err)
	}

	return &todosRepository{
		db: db,
	}
}

func (t todosRepository) AddTodo(title string, userId int) error {
	_, err := t.db.Exec("INSERT INTO todos (title, user_id) VALUES ($1, $2)", title, userId)
	if err != nil {
		return errors.New("failed to add todo")
	}

	return nil
}

func (t todosRepository) GetTodos(userId int) ([]Todo, error) {
	rows, err := t.db.Query("SELECT id, title, is_completed FROM todos WHERE user_id = $1", userId)
	if err != nil {
		return nil, errors.New("failed to get todos")
	}

	var todos []Todo
	for rows.Next() {
		var todo Todo
		err := rows.Scan(&todo.ID, &todo.Title, &todo.IsCompleted)
		if err != nil {
			return nil, errors.New("failed to get todos")
		}

		todos = append(todos, todo)
	}

	return todos, nil
}

func (t todosRepository) CompleteTodo(id int, userId int) error {
	_, err := t.db.Exec("UPDATE todos SET is_completed = true WHERE id = $1 AND user_id = $2", id, userId)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("todo not found")
		}

		return errors.New("failed to complete todo")
	}

	return nil
}

func (t todosRepository) UncompleteTodo(id int, userId int) error {
	_, err := t.db.Exec("UPDATE todos SET is_completed = false WHERE id = $1 AND user_id = $2", id, userId)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("todo not found")
		}

		return errors.New("failed to uncomplete todo")
	}

	return nil
}
