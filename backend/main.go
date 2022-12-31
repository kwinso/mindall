package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"mindall-backend/mindall"

	"github.com/gofiber/fiber/v2"
)

func loadElements() []string {
	var data []string
	file, err := ioutil.ReadFile("elements.json")
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
	elems := loadElements()

	app.Get("/encode", func(c *fiber.Ctx) error {
		text := c.Query("text")
		return c.JSON(TranslationResponse{
			Result: mindall.Encode(text, &elems),
		})
	})

	app.Get("/decode", func(c *fiber.Ctx) error {
		text := c.Query("text")
		return c.JSON(TranslationResponse{
			Result: mindall.Decode(text, &elems),
		})
	})

	app.Static("/", "../client/build")

	app.Listen(":8080")
}
