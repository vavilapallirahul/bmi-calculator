package main

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Request struct {
	Weight float64 `json:"weight" binding:"required"`
	Height float64 `json:"height" binding:"required"`
	Age    int     `json:"age" binding:"required"`
}

type Response struct {
	BMI         float64 `json:"bmi"`
	IdealWeight float64 `json:"ideal_weight"`
	Message     string  `json:"message"`
}

func main() {
	r := gin.Default()

	// Enable CORS for React frontend
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	r.POST("/calculate", func(c *gin.Context) {
		var req Request
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		if req.Weight <= 0 || req.Height <= 0 || req.Age <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "All values must be greater than 0"})
			return
		}

		bmi := req.Weight / ((req.Height / 100) * (req.Height / 100))
		idealWeight := 22 * ((req.Height / 100) * (req.Height / 100)) // BMI 22 ideal

		resp := Response{
			BMI:         bmi,
			IdealWeight: idealWeight,
			Message:     "Your BMI is " + formatFloat(bmi) + " and ideal weight is " + formatFloat(idealWeight) + " kg",
		}

		c.JSON(http.StatusOK, resp)
	})

	r.Run(":8080") // listen on port 8080
}

func formatFloat(f float64) string {
	return strconv.FormatFloat(f, 'f', 2, 64)
}

// adding this line for testing purpose
