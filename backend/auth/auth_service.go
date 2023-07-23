package auth

import (
	"database/sql"
	"errors"

	"github.com/go-chi/jwtauth/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	LoginUser(username string, password string) (PublicUser, error)
	RegisterUser(username string, password string) error
}

type authService struct {
	repository AuthRepository
	authToken  *jwtauth.JWTAuth
}

func NewAuthService(repository AuthRepository, authToken *jwtauth.JWTAuth) AuthService {
	return &authService{
		repository: repository,
		authToken:  authToken,
	}
}

var (
	ErrInvalidUsernameOrPassword = errors.New("invalid username or password")
)

func (a authService) LoginUser(username string, password string) (PublicUser, error) {
	user, err := a.repository.GetUserByUsername(username)
	var publicUser PublicUser

	if err != nil {
		if err == sql.ErrNoRows {
			return publicUser, ErrInvalidUsernameOrPassword
		}
		return publicUser, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return publicUser, ErrInvalidUsernameOrPassword
	}

	_, token, _ := a.authToken.Encode(map[string]interface{}{"user_id": user.Id})

	publicUser.User = user
	publicUser.Password = ""
	publicUser.Token = token

	return publicUser, nil
}

func (a authService) RegisterUser(username string, password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = a.repository.CreateUser(username, string(hash))
	return err
}
