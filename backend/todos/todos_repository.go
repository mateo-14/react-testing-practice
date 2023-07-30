package todos

import (
	"database/sql"
	"errors"
	"fmt"
)

type TodosRepository interface {
	Add(title string, userId int) error
	GetAll(userId int) ([]Todo, error)
	Update(id int, userId int, values map[string]interface{}) error
	Delete(id int, userId int) error
}

type todosRepository struct {
	db *sql.DB
}

var errNotFoundTodo = errors.New("todo not found")

func NewTodosRepository(db *sql.DB) TodosRepository {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, title VARCHAR(50), is_completed BOOLEAN DEFAULT false, user_id INTEGER REFERENCES users(id))")
	if err != nil {
		panic(err)
	}

	return &todosRepository{
		db: db,
	}
}

func (t todosRepository) Add(title string, userId int) error {
	_, err := t.db.Exec("INSERT INTO todos (title, user_id) VALUES ($1, $2)", title, userId)
	if err != nil {
		return errors.New("failed to add todo")
	}

	return nil
}

func (t todosRepository) GetAll(userId int) ([]Todo, error) {
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

func (t todosRepository) Update(id int, userId int, values map[string]interface{}) error {
	var params []interface{}
	query := "UPDATE todos SET "

	for key, value := range values {
		query += fmt.Sprintf("%s = $%d, ", key, len(params)+1)
		params = append(params, value)
	}
	query = query[:len(query)-2]

	query += fmt.Sprintf(" WHERE id = $%d AND user_id = $%d;", len(params)+1, len(params)+2)
	params = append(params, id, userId)

	res, err := t.db.Exec(query, params...)

	if err != nil {
		return errors.New("failed to update todo")
	}

	if rowsAffected, _ := res.RowsAffected(); rowsAffected == 0 {
		return errNotFoundTodo
	}

	return nil
}

func (t todosRepository) Delete(id int, userId int) error {
	res, err := t.db.Exec("DELETE FROM todos WHERE id = $1 AND user_id = $2;", id, userId)

	if err != nil {
		return errors.New("failed to delete todo")
	}

	if rowsAffected, _ := res.RowsAffected(); rowsAffected == 0 {
		return errNotFoundTodo
	}

	return nil
}
