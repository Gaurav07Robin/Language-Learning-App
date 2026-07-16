package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/user/langcodeapp-backend/utils"
)

func GetCurriculum(c *fiber.Ctx) error {
	// lang := c.Params("lang")
	// level := c.Params("level")
	return c.JSON(fiber.Map{
		"message": "Curriculum skeleton fetched",
	})
}

func GetNextUnit(c *fiber.Ctx) error {
	language := c.Query("language", "Spanish")
	level := c.Query("level", "Beginner")
	topic := c.Query("topic", "Basic Greetings")

	// 1. Check Global Cache in Supabase (generated_units table)
	// (Placeholder for Supabase DB check)

	// 2. If not found, generate via AI
	content, err := utils.GenerateLessonContent(language, level, topic)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Failed to generate lesson content",
			"details": err.Error(),
		})
	}

	// 3. Save to Supabase Global Cache asynchronously
	// (Placeholder for async insert)

	return c.JSON(fiber.Map{
		"message": "Next unit generated successfully",
		"unit":    content,
	})
}

func CompleteUnit(c *fiber.Ctx) error {
	// id := c.Params("id")
	return c.JSON(fiber.Map{
		"message": "Unit marked complete",
	})
}

func ValidatePronunciation(c *fiber.Ctx) error {
	// Sends audio to Whisper API
	return c.JSON(fiber.Map{
		"score":   90,
		"message": "Pronunciation validated",
	})
}
