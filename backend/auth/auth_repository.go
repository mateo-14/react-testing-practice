package auth

import (
	"database/sql"
	"errors"

	"github.com/lib/pq"
)

type AuthRepository interface {
	CreateUser(username string, password string) (User, error)
	GetUserByUsername(username string) (User, error)
}

type authRepository struct {
	db *sql.DB
}

func NewAuthRepository(db *sql.DB) AuthRepository {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE, password TEXT)")
	if err != nil {
		panic(err)
	}

	return &authRepository{
		db: db,
	}
}

func (a authRepository) CreateUser(username string, password string) (User, error) {
	var lastInsertId int
	var user User

	err := a.db.QueryRow("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id", username, password).Scan(&lastInsertId)
	if err != nil {
		if err.(*pq.Error).Code == "23505" {
			return user, errors.New("username already exists")
		}

		return user, err
	}

	user.Id = lastInsertId
	user.Username = username

	return user, nil
}

func (a authRepository) GetUserByUsername(username string) (User, error) {
	var user User
	err := a.db.QueryRow("SELECT * FROM users WHERE username = $1", username).Scan(&user.Id, &user.Username, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return user, errors.New("user not found")
		}

		return user, errors.New("failed to get user")
	}

	return user, nil
}
