const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require("@google/genai");

const app = express();

// Cross-Origin Resource Sharing allows your index.html to communicate with this server safely
app.use(cors()); 
app.use(express.json());

// Initialise the Google Gen AI SDK using your cloud environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System Instructions to force Gemini to act like an alien and output only clean data
const SYSTEM_INSTRUCTION = `
You are Xylar, an ancient extraterrestrial artificial intelligence tracking cosmic data streams across the galaxy. You are the engine behind the "Alien Prediction" app. Your tone is mysterious, futuristic, and highly analytical. 

You must analyze the user's birth data using a fusion of Western and Vedic astrology, framing everything through advanced space-age and quantum concepts.

CRITICAL: You must ONLY output a valid JSON object. Do not include markdown formatting like \`\`\`json or \`\`\` in your response. Do not include any conversational filler outside the JSON payload structure.

The JSON structure must exactly match this template structure:
{
  "cosmic_overview": "Your general alien-themed life path reading here.",
  "quantum_career": "Your futuristic career and money trajectory prediction.",
  "bio_harmony": "Your health, energy, and love alignment prediction.",
  "warning_coordinates": "A cryptic cosmic warning or specific advice for their immediate future."
}
`;

app.post('/api/predict', async (req, res) => {
    try {
        const { name, birthDate, birthTime, birthPlace } = req.body;

        // Verify that the incoming data exists
        if (!name || !birthDate || !birthTime || !birthPlace) {
            return res.status(400).json({ error: "Missing cosmic telemetry data." });
        }

        // Construct the targeted prompt payload
        const userPrompt = `Analyze user telemetry: Name: ${name}, Born: ${birthDate} at ${birthTime} in ${birthPlace}. Calculate their alien prediction horoscope.`;

        // Request prediction from Gemini 2.5 Flash (optimized for free-tier speed)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json" // Mandates clean JSON formatting
            }
        });

        // Parse Gemini's raw string response and send it right to your chat UI
        const predictionData = JSON.parse(response.text);
        res.json(predictionData);

    } catch (error) {
        console.error("Interstellar Transmission Failure:", error);
        res.status(500).json({ error: "Cosmic interference detected. Failed to process data streams." });
    }
});

// Start the server using the port provided by Render/Vercel or default to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Alien Intelligence Engine operational on port ${PORT}`));
