package main

import (
	"encoding/json"
	"fmt"
	"log"
	"mindall-backend/mindall"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func loadAsset[ItemType any](asset string) ItemType {
	var data ItemType
	file, err := os.ReadFile(fmt.Sprintf("../assets/%s.json", asset))
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(file, &data)

	if err != nil {
		log.Fatal(err)
	}

	return data
}

type TranslationResponse struct {
	Result string `json:"result"`
}

func main() {
	app := fiber.New()
	elems := loadAsset[[]string]("elements")
	translations := loadAsset[map[string]string]("translationMap")

	app.Use(cors.New())

	app.Get("/encode", func(c *fiber.Ctx) error {
		text := c.Query("text")
		return c.JSON(TranslationResponse{
			Result: mindall.Encode(text, &elems, &translations),
		})
	})

	app.Get("/decode", func(c *fiber.Ctx) error {
		text := c.Query("text")
		return c.JSON(TranslationResponse{
			Result: mindall.Decode(text, &elems),
		})
	})

	app.Static("/", "../client/dist")

	app.Listen(":8080")
}
