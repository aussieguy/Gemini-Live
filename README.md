# Gemini 2.0 Flash Multimodal Live API Client

A lightweight vanilla JavaScript implementation of the Gemini 2.0 Flash Multimodal Live API client. This project provides real-time interaction with Gemini's API through audio and video.

This is a simplified version of [Google's original React implementation](https://github.com/google-gemini/multimodal-live-api-web-console), created in response to [this issue](https://github.com/google-gemini/multimodal-live-api-web-console/issues/19).

Shout out to https://ViaAnthroposBenevolentia.github.com who wrote his version of Google's React version. 
[Live Demo](https://viaanthroposbenevolentia.github.io/gemini-2-live-api-demo/)

I was interested more in only the audio and video capabilities and just implemented these.
## Live Demo on GitHub Pages


## Key Features

- Real-time audio responses from the model
- Real-time audio input from the user, allowing interruptions
- Real-time video streaming from the user's webcam
- Built with vanilla JavaScript (no dependencies)
- Mobile-friendly

## Prerequisites

- Modern web browser with WebRTC, WebSocket, and Web Audio API support
- Google AI Studio API key
- `python -m http.server` or `npx http-server` or Live Server extension for VS Code (to host a server for index.html)

## Quick Start

1. Get your API key from Google AI Studio
2. Clone the repository

   git clone https://github.com/aussieguy.github.io/gemini-2-live-demo.git

3. Start the development server (adjust port if needed):

   cd gemini-2-live-api-demo
   python -m http.server 8000 
   or npx http-server 8000 
   or Open with Live Server extension for VS Code

4. Access the application at `http://localhost:8000`

