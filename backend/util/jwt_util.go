package util

import (
    "github.com/golang-jwt/jwt"
    "os"
    "time"
)

type JWTClaims struct {
    UserID   int    `json:"id"`
    UserType string `json:"user_type"`
    jwt.StandardClaims
}

func GenerateToken(userID int, userType string, ttlHours int) (string, error) {
    secret := os.Getenv("JWT_SECRET")
    if secret == "" {
        secret = "dev-secret"
    }
    claims := JWTClaims{
        UserID:   userID,
        UserType: userType,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: time.Now().Add(time.Duration(ttlHours) * time.Hour).Unix(),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(secret))
}

func ValidateToken(tokenString string) (*jwt.Token, *JWTClaims, error) {
    secret := os.Getenv("JWT_SECRET")
    if secret == "" {
        secret = "dev-secret"
    }
    claims := &JWTClaims{}
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return []byte(secret), nil
    })
    if err != nil {
        return nil, nil, err
    }
    return token, claims, nil
}
