# WebTruth Extension Suite 🔍

[![GitHub Repo](https://img.shields.io/badge/GitHub-Br7eleven/webtruth--extension--suite-blue?logo=github)](https://github.com/Br7eleven/webtruth-extension-suite)

**WebTruth Extension Suite** is a comprehensive browser extension and dashboard system for fact-checking and verifying claims on the web, powered by AI and enriched with text-to-speech and transparent sourcing.

> **⚠️ This project is currently under active development. Expect frequent changes and incomplete features as we build toward a stable release. Contributions and feedback are welcome!**

---

## 🏗️ Components

- **extension/**: Browser extension (React + TypeScript + Webpack)
- **dashboard/**: Admin/User dashboard (React + Vite)
- **pocketbase/**: Lightweight local backend (PocketBase, Go binary)
- **webtruth_backend/**: Flask API server for verification logic

---

## 🚀 Key Features

- **Extract Claims:** Parse and extract claims from any visited webpage.
- **AI Fact-Check:** Instantly verify claims using AI and public sources.
- **Text-to-Speech:** Hear claim verification results (browser TTS + API).
- **Feedback Loop:** Users can like/dislike verifications for quality control.
- **Dashboard:** Visualize, review, and manage all processed claims.
- **Lightweight Backend:** PocketBase for local, low-latency data.
- **Open Source:** Easy to extend, audit, and contribute.

---

## 🗂️ Project Structure

```
webtruth-extension-suite/
├── extension/         # Browser extension (React + TS + Webpack)
├── dashboard/         # Admin/user dashboard (React)
├── pocketbase/        # Self-hosted lightweight backend (Go binary)
└── webtruth_backend/  # Flask API server (fact-checking logic)
```

---

## 🛠️ Full Setup Guide

### 1. **Clone the Repository**

```bash
git clone https://github.com/Br7eleven/webtruth-extension-suite.git
cd webtruth-extension-suite
```

### 2. **Start PocketBase (Database)**

```bash
cd pocketbase
./pocketbase serve
```
*Ensure migrations are run or your data schema is set (`pb_migrations`).*

### 3. **Run the Backend API (Flask)**

```bash
cd ../webtruth_backend
pip install -r requirements.txt
python src/main.py
```

### 4. **Start the Dashboard (React/Vite)**

```bash
cd ../dashboard
npm install
npm run dev
```
*Dashboard runs locally on [http://localhost:5173](http://localhost:5173) by default.*

### 5. **Build the Browser Extension**

```bash
cd ../extension
npm install
npm run build
```
- Load `/extension/dist` as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked) in Chrome.

---

## ⚙️ Environment Variables

You must create `.env` files in the following directories:

- `extension/`
- `webtruth_backend/`
- `dashboard/`

Each `.env` should follow the format in the provided `.env.example` files.

---

## 🧪 Tech Stack

- **Frontend:** React, Tailwind CSS, Vite, Webpack
- **Extension:** Content Script, Background Script, Popup
- **Backend:** Flask (Python)
- **Database:** PocketBase (Go)
- **Text-to-Speech:** Web Speech API, Manus/Mozilla API (optional)

---

## 🧩 Contributions

Contributions are welcome!  
- **Pull Requests:** Please submit for new features, enhancements, or bug fixes.
- **Issues:** Report bugs or request features [here](https://github.com/Br7eleven/webtruth-extension-suite/issues).

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 📫 Links

- **Repository:** [Br7eleven/webtruth-extension-suite](https://github.com/Br7eleven/webtruth-extension-suite)

---

## ⚠️ Notes

- This project is a work-in-progress and in active development. Functionality may be incomplete or change frequently.
- Make sure all services (PocketBase, Flask backend, Dashboard, and Extension) are running for full functionality.
- For production deployment, secure environment variables and review extension permissions.

---

Happy fact-checking with **WebTruth**! 🎉
