package auth

import (
	"errors"
	"net/http"
)

type LoginRequest struct {
	*User
}

func (l *LoginRequest) Bind(r *http.Request) error {
	if l.User == nil {
		return errors.New("missing required User fields")
	}

	if l.Username == "" {
		return errors.New("missing required Username field")
	}

	if l.Password == "" {
		return errors.New("missing required Password field")
	}

	return nil
}
