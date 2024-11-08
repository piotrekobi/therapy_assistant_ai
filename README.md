# Speech Therapy Assistant

This project was developed as part of a master's thesis focused on creating a comprehensive web application to assist in stuttering therapy. The application combines modern web technologies with speech processing capabilities to provide an interactive platform for speech therapy exercises and practice.

## Project Overview

The Speech Therapy Assistant is a full-stack web application that offers various tools and features to support stuttering therapy:

### Key Features

- **Exercise Generator**
  - Vowel practice exercises
  - Word generation with different complexity levels
  - Sentence generation with adjustable tempo and length
  - Support for both Polish and English languages

- **Interactive Chat Assistant**
  - AI-powered conversational support
  - Voice message capabilities
  - Context-aware responses based on user history
  - Personalized therapy suggestions

- **Intonation Training**
  - Real-time voice analysis
  - Emotion detection in speech
  - Feedback on speech patterns
  - Practice exercises with different emotional contexts

- **Progress Tracking**
  - User statistics monitoring
  - Practice session history
  - Performance metrics
  - Progress visualization

- **Community Features**
  - User forum
  - Post and comment system
  - Experience sharing
  - Community support

## Technical Stack

### Backend

- **Framework:** Flask (Python)
- **Speech Processing:**
  - Google Cloud Speech-to-Text
  - PyDub for audio processing
  - NLTK for language processing
- **AI Integration:** OpenAI GPT for chat assistance
- **Authentication:** Flask-Login
- **Database:** JSON file-based storage

### Frontend

- **Framework:** React
- **State Management:** React Context API
- **Styling:** CSS with responsive design
- **Audio Processing:** Web Audio API
- **Routing:** React Router

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone [repository-url]
   cd speech-therapy-assistant
   ```

2. **Backend Setup**

   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your API keys and configurations
   ```

3. **Frontend Setup**

   ```bash
   # Install dependencies
   cd frontend
   npm install
   ```

4. **Required API Keys**
   - OpenAI API key for the chat assistant
   - Google Cloud Speech-to-Text API credentials
   - Hugging Face API token for emotion detection

5. **Running the Application**

   ```bash
   # Start backend server
   python app.py
   
   # In a separate terminal, start frontend
   cd frontend
   npm start
   ```

## License

This project is part of a master's thesis research and is protected under appropriate academic guidelines. Please contact the author for usage permissions.

## Author

Piotr Paturej
Master's Thesis Project
Warsaw University of Technology
2023
