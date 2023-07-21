package auth

import (
	"database/sql"
	"errors"

	"github.com/go-chi/jwtauth/v5"
	"github.com/mateo-14/todo-api/jwt"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	LoginUser(username string, password string) (*PublicUser, error)
	RegisterUser(username string, password string) error
}

type authService struct {
	repository AuthRepository
}

var tokenAuth *jwtauth.JWTAuth = jwtauth.New("HS256", []byte("secret"), nil)

func NewAuthService(repository AuthRepository) AuthService {
	return &authService{
		repository: repository,
	}
}

var (
	ErrInvalidUsernameOrPassword = errors.New("invalid username or password")
)

func createPublicUserWithToken(user *User, jwt string) *PublicUser {
	return &PublicUser{
		User: &User{
			Id:       user.Id,
			Username: user.Username,
		},
		Token: jwt,
	}
}

func (a *authService) LoginUser(username string, password string) (*PublicUser, error) {
	user, err := a.repository.GetUserByUsername(username)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrInvalidUsernameOrPassword
		}
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, ErrInvalidUsernameOrPassword
	}

	_, token, _ := jwt.AuthToken.Encode(map[string]interface{}{"user_id": user.Id})

	userWithToken := createPublicUserWithToken(user, token)
	return userWithToken, nil
}

func (a *authService) RegisterUser(username string, password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = a.repository.CreateUser(username, string(hash))
	return err
}
