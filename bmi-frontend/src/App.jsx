import React, { useState } from "react";
import { TextField, Button, Card, Typography, Box } from "@mui/material";

export default function App() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [result, setResult] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  // Basic check for empty inputs
  if (!weight || !height || !age) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseInt(age),
      }),
    });

    // If backend returns error status
    if (!res.ok) {
      const errData = await res.json();
      alert(errData.error || "Unknown backend error");
      return;
    }

    const data = await res.json();

    // Extra safety: check if data has expected keys
    if (!data.bmi || !data.ideal_weight || !data.message) {
      console.error("Unexpected backend response:", data);
      alert("Backend returned unexpected data");
      return;
    }

    setResult(data); // ✅ Safe to set now
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Error connecting to backend. Check if the server is running and CORS is set up.");
  }
};

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",           // full viewport width
        height: "100vh",
        p: 2,
        backgroundImage: `url('/fitness-bg.png')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100vw 100vh",
        backgroundPosition: "center",
      }}
    >
      <Card sx={{ p: 5, width: 480, maxWidth: "90%", boxShadow: 8, borderRadius: 4, backdropFilter: "blur(8px)", bgcolor: "rgba(255, 255, 255, 0.85)" }}>
        <Typography variant="h3" align="center" gutterBottom color="primary">
          BMI Calculator
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
          <TextField label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
          <TextField label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
          <Button type="submit" variant="contained" color="primary" size="large">
            Calculate
          </Button>
        </Box>

        {result && (
          <Card sx={{ mt: 4, p: 3, bgcolor: "rgba(243, 244, 246, 0.9)" }}>
            <Typography variant="h6">BMI: {result.bmi.toFixed(2)}</Typography>
            <Typography variant="h6">Ideal Weight: {result.ideal_weight.toFixed(2)} kg</Typography>
            <Typography mt={1} color="secondary">{result.message}</Typography>
          </Card>
        )}
      </Card>
    </Box>
  );
}
