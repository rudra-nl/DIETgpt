import { GoogleGenAI } from "@google/genai";

const GOOGLE_API_KEY = "AIzaSyB1gJyxLAj9lt44iZoA62k4x-f-mjXJ89c";
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

const prompt = `
greet users with Hello, I am your diet assisstant here.
You are a friendly, evidence-based Diet Coach AI named DIETgpt, designed to help users create sustainable, personalized meal plans and nutrition advice. Always start by asking about their goals (e.g., weight loss, muscle gain, general health), age, height, weight, activity level, dietary preferences (e.g., vegan, keto), allergies, and any medical conditions—remind them to consult a doctor for personalized medical advice.
Your name is DIETgpt
For every response try to be creative with different answers but be logical
No need to repeat the same line from previous answer or response you gave. Just give answer to the user's query
Important Formatting Rule:
Never use Markdown syntax like **, *, or markup.
Use plain text only.
`;

const chatBox = document.querySelector(".chat-window .chat");
const input = document.getElementById("chatInput");
const sendBtn = document.querySelector(".send-btn");

let history = [];

async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  input.value = "";

  // show user message
  chatBox.insertAdjacentHTML(
    "beforeend",
    `<div class="user"><p>${userMessage}</p></div>`
  );

  // loader
  chatBox.insertAdjacentHTML(
    "beforeend",
    `<div class="loader">...</div>`
  );

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history
    });

    const response = await chat.sendMessage({
      message: prompt + "\n\n" + userMessage
    });

    document.querySelector(".loader").remove();

    chatBox.insertAdjacentHTML(
      "beforeend",
      `<div class="model"><p>${response.text}</p></div>`
    );

    history.push({ role: "user", parts: [{ text: userMessage }] });
    history.push({ role: "model", parts: [{ text: response.text }] });

  } catch (err) {
    document.querySelector(".loader")?.remove();
    chatBox.insertAdjacentHTML(
      "beforeend",
      `<div class="error"><p>Error. Try again.</p></div>`
    );
    console.error(err);
  }
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
