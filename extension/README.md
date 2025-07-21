# WebTruth Browser Extension and Dashboard

This project consists of a Chrome/Firefox browser extension and a companion web dashboard.

## Project Structure

- `extension/`: Contains the source code for the browser extension.
- `dashboard/`: Contains the source code for the web dashboard.
- `webttruth_backend/`: Contains the source code for the Flask backend (for TTS, though now using Web Speech API).

## Local Setup and Running

### Prerequisites

- Node.js (LTS version recommended)
- npm or pnpm (pnpm is used in this guide)
- Python 3.x
- pip (Python package installer)

### 1. Browser Extension

Navigate to the `extension` directory:

```bash
cd extension
```

Install dependencies:

```bash
pnpm install
# or npm install
```

Build the extension:

```bash
pnpm run build
# or npm run build
```

To load the extension in your browser:

**Chrome:**
1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select the `extension/dist` directory.

**Firefox:**
1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click "Load Temporary Add-on..." and select any file inside the `extension/dist` directory (e.g., `manifest.json`).

### 2. Web Dashboard

Navigate to the `dashboard` directory:

```bash
cd dashboard
```

Install dependencies:

```bash
pnpm install
# or npm install
```

Run the development server:

```bash
pnpm run dev
# or npm run dev
```

The dashboard will typically be accessible at `http://localhost:5173`.

### 3. PocketBase (Database)

PocketBase is used as the backend database. You will need to run it separately.

Navigate to the `pocketbase` directory (created during the setup):

```bash
cd pocketbase
```

Start the PocketBase server:

```bash
./pocketbase serve
```

Access the Admin UI at `http://localhost:8090` (or the exposed port if running in a sandbox) to manage collections and data. Ensure the `claims` collection is set up with `claimText`, `verdict`, and `explanation` fields, and appropriate API rules for public access (List/Search and Create).

### 4. Flask Backend (TTS - Optional)

*Note: The dashboard now uses the browser's native Web Speech API for TTS, so this Flask backend is optional unless you specifically need a server-side TTS solution or plan to integrate other backend functionalities.*

Navigate to the `webttruth_backend` directory:

```bash
cd webttruth_backend
```

Create and activate a Python virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
# If requirements.txt is not present, install manually:
pip install Flask Flask-Cors requests
```

Run the Flask server:

```bash
python src/main.py
```

The Flask server will run on `http://0.0.0.0:5000`.

