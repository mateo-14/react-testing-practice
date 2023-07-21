package auth

import "net/http"

type AuthResponse struct {
	*PublicUser
}

func (l *AuthResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}
