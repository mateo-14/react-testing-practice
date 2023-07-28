package auth

import (
	"errors"
	"net/http"
)

type User struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password,omitempty"`
}

type AuthUser struct {
	User
	Token string `json:"token,omitempty"`
}

// Requests
type LoginRequest struct {
	User
}

func (l LoginRequest) Bind(r *http.Request) error {
	if l.Username == "" && l.Password == "" {
		return errors.New("missing required Username and Password fields")
	}

	if l.Username == "" {
		return errors.New("missing required Username field")
	}

	if l.Password == "" {
		return errors.New("missing required Password field")
	}

	return nil
}

// Responses
type AuthResponse struct {
	AuthUser
}

func (l AuthResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}
