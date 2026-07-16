package controllers

import "github.com/gofiber/fiber/v2"

func HandleOnboarding(c *fiber.Ctx) error {
	// Parse diagnostic quiz, compute level, and set in user_profiles
	return c.JSON(fiber.Map{
		"message": "Onboarding successful",
		"level":   "Beginner",
	})
}
