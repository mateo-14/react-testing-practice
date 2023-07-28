package auth

import (
	"database/sql"
	"errors"
	"time"

	"github.com/go-chi/jwtauth/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	LoginUser(username string, password string) (AuthUser, error)
	RegisterUser(username string, password string) error
	Auth(userId int) (AuthUser, error)
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

func (a authService) LoginUser(username string, password string) (AuthUser, error) {
	user, err := a.repository.GetUserByUsername(username)
	var authUser AuthUser

	if err != nil {
		if err == sql.ErrNoRows {
			return authUser, ErrInvalidUsernameOrPassword
		}
		return authUser, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return authUser, ErrInvalidUsernameOrPassword
	}

	_, token, _ := a.authToken.Encode(generateAuthClaims(user.Id))

	authUser.User = user
	authUser.Password = ""
	authUser.Token = token

	return authUser, nil
}

func (a authService) RegisterUser(username string, password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = a.repository.CreateUser(username, string(hash))
	return err
}

func (a authService) Auth(userId int) (AuthUser, error) {
	var authUser AuthUser
	user, err := a.repository.GetUserById(userId)
	if err != nil {
		return authUser, err
	}

	_, token, _ := a.authToken.Encode(generateAuthClaims(user.Id))

	authUser.User = user
	authUser.Password = ""
	authUser.Token = token

	return authUser, nil
}

func generateAuthClaims(userId int) map[string]interface{} {
	return map[string]interface{}{
		"user_id": userId,
		"exp":     jwtauth.ExpireIn(time.Hour * 24 * 7),
	}
}
