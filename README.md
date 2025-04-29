# Atari Demo  
TalTech JavaScript Project Course 2024  

**Author:**  
Torm Järvelill  

## Introduction  
This repository contains a simple Atari-style demo project developed as part of the JavaScript course at TalTech 2024.  
The project serves static files through a lightweight local HTTP server (`http-server`) and demonstrates basic web deployment concepts.

This project is intended for educational and portfolio purposes.

## Getting Started  
To run the application locally, follow these steps:

1. Make sure you have **Node.js** and **NPM** installed.  
   If not, download from [https://nodejs.org/](https://nodejs.org/).

2. Install the **http-server** package globally (only once):

   ```bash
   npm install -g http-server
3. Run the HTTP server inside your project directory:
   ```bash
   http-server -c-1
4. Open your browser and navigate to http://localhost:8080
The Atari demo should now be running.

## Project Structure

- `/public/` – Contains all static files served to the browser:
  - `index.html` – Main HTML page for the Atari demo
  - `/css/site.css` – CSS stylesheet for layout and design
  - `/js/app.js` – Main JavaScript entry point
  - `/js/brain.js` – Game logic or "brain" of the Atari demo
  - `/js/ui.js` – UI logic for interacting with the user (buttons, screen updates)
  - `js.zip` – (Optional) Compressed archive of JavaScript files
- `./` (Root directory) – Fallback serving location if `/public/` is missing.

## Dependencies

- **http-server** – A simple, zero-configuration command-line static HTTP server.  

  Install it from NPM:  
  [https://www.npmjs.com/package/http-server](https://www.npmjs.com/package/http-server)

## Technologies Used

- **HTML**, **CSS**, and **JavaScript** – Core web development languages.
- **Node.js** and **NPM** – JavaScript runtime and package manager.
- **http-server** – For serving static files locally.
- **Git** – For version control and project management.

## Additional Tools

- **Favicon generation:**  
  [https://www.favicon.cc/](https://www.favicon.cc/)

- **Custom Git functions on macOS**  
  *(Optional setup for advanced users)*

## Screenshots

![image](https://github.com/user-attachments/assets/ab5a9d3c-61ed-416b-9f52-dca05cbfbcf3)
