package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/user/langcodeapp-backend/controllers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1")

	// Auth & Onboarding
	api.Post("/onboarding", controllers.HandleOnboarding)

	// Curriculum & Units
	api.Get("/curriculum/:lang/:level", controllers.GetCurriculum)
	api.Get("/unit/next", controllers.GetNextUnit)

	// Progress Tracking
	api.Post("/unit/:id/complete", controllers.CompleteUnit)

	// Audio Validation (Whisper API)
	api.Post("/validate-pronunciation", controllers.ValidatePronunciation)
}
