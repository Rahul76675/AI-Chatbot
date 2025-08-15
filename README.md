# AI Chatbot (Google Gemini Powered)

This project is a modern React-based AI chatbot that uses the Google Gemini API for natural language responses.  
It features a clean UI, dark/light mode, and displays bot answers in bullet points when appropriate.

## Features

- **Google Gemini Integration:** Uses Gemini 2.0 Flash model for fast, smart responses.
- **Modern UI:** Stylish chat bubbles, gradients, and responsive design.
- **Bullet Point Output:** Bot answers are formatted as bullet points for clarity.
- **Dark/Light Mode:** Toggle between themes for comfortable viewing.
- **Easy Setup:** Just add your API key in the `.env` file.

## Getting Started

1. **Clone the repository:**
   ```
   git clone <your-repo-url>
   cd react-ai-chatbot
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Add your Google Gemini API key:**
   - Create a `.env` file in the project root (if not present).
   - Add:
     ```
     REACT_APP_GOOGLE_AI_API_KEY=your_google_gemini_api_key_here
     ```

4. **Start the development server:**
   ```
   npm start
   ```

## Usage

- Type your message in the input box and press **Send**.
- The bot will reply using Google Gemini.
- Click **Clear** to reset the chat.
- Toggle dark/light mode using the button in the header.

## Customization

- **UI:** Edit styles in `App.js` or add your own CSS in `App.css`.
- **API Model:** Change the Gemini model endpoint in `App.js` if needed.
- **Formatting:** The bot automatically formats lists as bullet points for better readability.

## Technologies Used

- React
- Google Gemini API
- JavaScript (ES6+)
- Inline CSS (for quick styling)

## License

This project is for
