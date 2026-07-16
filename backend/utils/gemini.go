package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type GeminiPart struct {
	Text string `json:"text"`
}

type GeminiContent struct {
	Parts []GeminiPart `json:"parts"`
}

type GeminiGenerationConfig struct {
	ResponseMimeType string `json:"responseMimeType"`
}

type GeminiRequest struct {
	SystemInstruction *GeminiContent          `json:"system_instruction,omitempty"`
	Contents          []GeminiContent         `json:"contents"`
	GenerationConfig  *GeminiGenerationConfig `json:"generationConfig,omitempty"`
}

type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

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
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY not set")
	}

	systemPrompt := "You are an expert language evaluator. Output strictly in JSON format. Generate a 3-question diagnostic quiz in English to test a user's proficiency in the target language. The JSON must have a `questions` array. Each question must have: `question` (string), `options` (array of 4 strings), `correct_answer_index` (int 0-3), and `difficulty` (string: strictly one 'Beginner', one 'Intermediate', one 'Advanced')."
	userPrompt := fmt.Sprintf("Generate a diagnostic quiz for the language: %s", language)

	reqBody := GeminiRequest{
		SystemInstruction: &GeminiContent{
			Parts: []GeminiPart{{Text: systemPrompt}},
		},
		Contents: []GeminiContent{
			{Parts: []GeminiPart{{Text: userPrompt}}},
		},
		GenerationConfig: &GeminiGenerationConfig{
			ResponseMimeType: "application/json",
		},
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=%s", apiKey)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("Gemini API error: %s", string(bodyBytes))
	}

	var aiResp GeminiResponse
	if err := json.Unmarshal(bodyBytes, &aiResp); err != nil {
		return nil, err
	}

	if len(aiResp.Candidates) == 0 || len(aiResp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty response from Gemini")
	}

	var content DiagnosticQuiz
	if err := json.Unmarshal([]byte(aiResp.Candidates[0].Content.Parts[0].Text), &content); err != nil {
		return nil, err
	}

	return &content, nil
}

func GenerateLessonContent(language, level, topic string) (*GeneratedUnitContent, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY not set")
	}

	systemPrompt := fmt.Sprintf("You are an expert tutor. Output strictly in JSON format containing: 1. `theory_bites` (max 3 short sentences each), 2. `vocabulary_list` (with translations), 3. `interactive_quiz` (3 questions with 4 options and correct answer index). CRITICAL INSTRUCTION: The user is at the %s tier. STRICTLY tailor the complexity, vocabulary depth, and grammar rules to the %s level. Generate as robust and comprehensive a lesson as possible within these constraints.", level, level)
	userPrompt := fmt.Sprintf("Generate a lesson for Language: %s, Level: %s, Topic: %s.", language, level, topic)

	reqBody := GeminiRequest{
		SystemInstruction: &GeminiContent{
			Parts: []GeminiPart{{Text: systemPrompt}},
		},
		Contents: []GeminiContent{
			{Parts: []GeminiPart{{Text: userPrompt}}},
		},
		GenerationConfig: &GeminiGenerationConfig{
			ResponseMimeType: "application/json",
		},
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=%s", apiKey)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("Gemini API error: %s", string(bodyBytes))
	}

	var aiResp GeminiResponse
	if err := json.Unmarshal(bodyBytes, &aiResp); err != nil {
		return nil, err
	}

	if len(aiResp.Candidates) == 0 || len(aiResp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty response from Gemini")
	}

	var content GeneratedUnitContent
	if err := json.Unmarshal([]byte(aiResp.Candidates[0].Content.Parts[0].Text), &content); err != nil {
		return nil, err
	}

	return &content, nil
}
