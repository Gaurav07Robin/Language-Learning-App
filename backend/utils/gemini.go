package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"google.golang.org/genai"
)

type GeneratedUnitContent struct {
	TheoryBites    []string `json:"theory_bites"`
	VocabularyList []struct {
		Word        string `json:"word"`
		Translation string `json:"translation"`
	} `json:"vocabulary_list"`
	InteractiveQuiz []struct {
		Question           string   `json:"question"`
		Options            []string `json:"options"`
		CorrectAnswerIndex int      `json:"correct_answer_index"`
	} `json:"interactive_quiz"`
}

type DiagnosticQuiz struct {
	Questions []struct {
		Question           string   `json:"question"`
		Options            []string `json:"options"`
		CorrectAnswerIndex int      `json:"correct_answer_index"`
		Difficulty         string   `json:"difficulty"`
	} `json:"questions"`
}

func GenerateDiagnosticQuiz(language string) (*DiagnosticQuiz, error) {
	ctx := context.Background()
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY not set")
	}

	client, err := genai.NewClient(ctx, &genai.ClientConfig{APIKey: apiKey})
	if err != nil {
		return nil, fmt.Errorf("failed to create client: %w", err)
	}

	systemPrompt := "You are an expert language evaluator. Output strictly in JSON format. Generate a 3-question diagnostic quiz in English to test a user's proficiency in the target language. The JSON must have a `questions` array. Each question must have: `question` (string), `options` (array of 4 strings), `correct_answer_index` (int 0-3), and `difficulty` (string: strictly one 'Beginner', one 'Intermediate', one 'Advanced')."
	userPrompt := fmt.Sprintf("Generate a diagnostic quiz for the language: %s", language)

	resp, err := client.Models.GenerateContent(ctx, "gemini-3.5-flash", []*genai.Content{
		{Role: "user", Parts: []*genai.Part{{Text: userPrompt}}},
	}, &genai.GenerateContentConfig{
		SystemInstruction: &genai.Content{Parts: []*genai.Part{{Text: systemPrompt}}},
		ResponseMIMEType:  "application/json",
	})
	if err != nil {
		return nil, fmt.Errorf("API call failed: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty response from Gemini")
	}

	var quiz DiagnosticQuiz
	err = json.Unmarshal([]byte(resp.Candidates[0].Content.Parts[0].Text), &quiz)
	return &quiz, err
}

func GenerateLessonContent(language, level, topic string) (*GeneratedUnitContent, error) {
	ctx := context.Background()
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY not set")
	}

	client, err := genai.NewClient(ctx, &genai.ClientConfig{APIKey: apiKey})
	if err != nil {
		return nil, fmt.Errorf("failed to create client: %w", err)
	}

	systemPrompt := fmt.Sprintf("You are an expert tutor. Output strictly in JSON format containing: 1. `theory_bites` (max 3 short sentences each), 2. `vocabulary_list` (with translations), 3. `interactive_quiz` (3 questions with 4 options and correct answer index). CRITICAL INSTRUCTION: The user is at the %s tier. STRICTLY tailor the complexity, vocabulary depth, and grammar rules to the %s level. Generate as robust and comprehensive a lesson as possible within these constraints.", level, level)
	userPrompt := fmt.Sprintf("Generate a lesson for Language: %s, Level: %s, Topic: %s.", language, level, topic)

	resp, err := client.Models.GenerateContent(ctx, "gemini-3.5-flash", []*genai.Content{
		{Role: "user", Parts: []*genai.Part{{Text: userPrompt}}},
	}, &genai.GenerateContentConfig{
		SystemInstruction: &genai.Content{Parts: []*genai.Part{{Text: systemPrompt}}},
		ResponseMIMEType:  "application/json",
	})
	if err != nil {
		return nil, fmt.Errorf("API call failed: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty response from Gemini")
	}

	var content GeneratedUnitContent
	err = json.Unmarshal([]byte(resp.Candidates[0].Content.Parts[0].Text), &content)
	return &content, err
}
