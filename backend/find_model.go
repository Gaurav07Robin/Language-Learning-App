package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		fmt.Println("No API key")
		return
	}

	models := []string{
		"gemini-2.5-computer-use-preview-10-2025",
		"gemini-robotics-er-1.6-preview",
		"deep-research-preview-04-2026",
		"gemini-1.5-flash",
		"gemini-1.5-pro",
		"gemini-pro",
		"aqa",
	}

	reqBody := `{"contents":[{"parts":[{"text":"say hi"}]}]}`

	for _, model := range models {
		url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, apiKey)
		req, _ := http.NewRequest("POST", url, bytes.NewBufferString(reqBody))
		req.Header.Set("Content-Type", "application/json")
		
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			continue
		}
		
		bodyBytes, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		
		if resp.StatusCode == 200 {
			fmt.Printf("SUCCESS MODEL: %s\n", model)
			return
		} else {
			if strings.Contains(string(bodyBytes), "RESOURCE_EXHAUSTED") {
				fmt.Printf("QUOTA EXCEEDED: %s\n", model)
			} else {
				fmt.Printf("FAILED (%d): %s -> %s\n", resp.StatusCode, model, string(bodyBytes))
			}
		}
	}
	fmt.Println("No working models found")
}
