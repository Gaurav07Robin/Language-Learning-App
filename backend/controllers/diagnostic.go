package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/user/langcodeapp-backend/utils"
)

func GetDiagnosticQuiz(c *fiber.Ctx) error {
	language := c.Query("language", "Spanish")

	quiz, err := utils.GenerateDiagnosticQuiz(language)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Failed to generate diagnostic quiz",
			"details": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Diagnostic quiz generated",
		"quiz":    quiz,
	})
}
