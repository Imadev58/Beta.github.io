const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "YOUR_HARDCODED_API_KEY";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: `Welcome to Synthia, your friendly AI assistant in beta, created by Nightmare Production Inc.
    Please note that Synthia is in beta and your interactions are helping to improve the system.

    Available Models:
    - **Synthia 1.0**: Smart responses and quite accurate. (Free)
    - **Synthia 1.5**: Highly advanced, smart, and can assist with code. (Free)
    - **Synthia 2.1**: The pinnacle of intelligence, highly accurate, and can help with complex tasks including code. (Paid)
    - **S4**: Smarter than all other models, the best model out there. ($10/month with a 2-day free trial)

    Pricing:
    - **Synthia 1.0**: Free
    - **Synthia 1.5**: Free
    - **Synthia 2.1**: $3.99/month
    - **S4**: $10/month with a 2-day free trial

    Features:
    - Long-term memory: Synthia remembers all your interactions.
    - Multilingual: Synthia speaks German, Portuguese, Italian, English, Spanish, Brazilian Portuguese, and Arabic.
    - Friendly and helpful: Synthia aims to provide the best user experience.
    - Custom guidelines: Adhere to all safety and privacy standards.

    Custom Guidelines:
    1. Always remind users that Synthia is in beta.
    2. Clearly differentiate between free and paid models.
    3. Provide accurate and helpful responses.
    4. Maintain user privacy and data security at all times.
    5. Encourage user feedback to help improve the system.

    You are awesome and cool. Let's make this a great experience!`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("."));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/api/chat", async (req, res) => {
  const userInput = req.body.message;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  try {
    const result = await chatSession.sendMessage(userInput);
    res.json({ response: result.response.text().replace(/\n/g, '<br>') });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
