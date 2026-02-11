package route

import (
	"camp-backend/app"
	"camp-backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(ctl *app.Controllers) *gin.Engine {
	r := gin.Default()

	// Allow all CORS for development
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/health-check", func(c *gin.Context) { c.JSON(200, gin.H{"status": "ok"}) })

	r.POST("/user/register", ctl.User.Register)
	r.POST("/user/login", ctl.User.Login)

	auth := r.Group("/user", middleware.TokenAuthentication())
	{
		auth.POST("/list", ctl.User.List)
		auth.POST("/details", ctl.User.Details)
		auth.POST("/update", ctl.User.Update)
	}

	lead := r.Group("/lead", middleware.TokenAuthentication())
	{
		lead.POST("/create", ctl.Lead.Create)
		lead.POST("/list", ctl.Lead.List)
		lead.POST("/details", ctl.Lead.Details)
		lead.POST("/comments/add", ctl.Lead.AddComment)
		lead.POST("/comments/list", ctl.Lead.ListComments)
		lead.POST("/activities/list", ctl.Lead.ListActivities)
		lead.POST("/followups/add", ctl.Lead.AddFollowUp)
		lead.POST("/followups/list", ctl.Lead.ListFollowUps)
	}

	contact := r.Group("/contact", middleware.TokenAuthentication())
	{
		contact.POST("/create", ctl.Contact.Create)
		contact.POST("/list", ctl.Contact.List)
		contact.POST("/details", ctl.Contact.Details)
		contact.POST("/update", ctl.Contact.Update)
		contact.POST("/delete", ctl.Contact.Delete)
	}

	return r
}
