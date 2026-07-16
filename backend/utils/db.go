package utils

import (
	"fmt"
	"os"

	"github.com/supabase-community/supabase-go"
)

var SupabaseClient *supabase.Client

func InitDB() error {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		return fmt.Errorf("Supabase credentials not found in env")
	}

	client, err := supabase.NewClient(supabaseURL, supabaseKey, nil)
	if err != nil {
		return err
	}

	SupabaseClient = client
	return nil
}
