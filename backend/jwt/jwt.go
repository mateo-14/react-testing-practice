package jwt

import "github.com/go-chi/jwtauth/v5"

var AuthToken *jwtauth.JWTAuth = jwtauth.New("HS256", []byte("secret"), nil)
