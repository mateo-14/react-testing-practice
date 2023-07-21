package auth

type omit *struct{}

type User struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type PublicUser struct {
	*User
	Password omit   `json:"password,omitempty"`
	Token    string `json:"token,omitempty"`
}
