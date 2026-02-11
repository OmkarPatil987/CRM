package middleware

import (
    "camp-backend/util"
    "strconv"
    "strings"

    "github.com/gin-gonic/gin"
)

func TokenAuthentication() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
            util.UnauthorizedResponse(c, "Missing token")
            c.Abort()
            return
        }
        tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
        token, claims, err := util.ValidateToken(tokenStr)
        if err != nil || !token.Valid {
            util.UnauthorizedResponse(c, "Invalid token")
            c.Abort()
            return
        }
        c.Request.Header.Set("auth_user_id", strconv.Itoa(claims.UserID))
        c.Request.Header.Set("user_type", claims.UserType)
        c.Next()
    }
}
