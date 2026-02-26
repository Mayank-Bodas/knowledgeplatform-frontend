# Knowledge Platform - Frontend

This is the React-based frontend for the Knowledge Platform. It provides a clean, modern, light-themed interface for users to read, write, and manage articles. It includes rich text editing and AI-assisted drafting features powered by GroqCloud.

## 1️⃣ Approach

### Architecture Overview
The frontend is built as a Single Page Application (SPA) using React and Vite. It communicates with the Spring Boot backend via Axios REST calls.
- **Routing:** Managed by `react-router-dom` with secure `ProtectedRoute` wrappers for authenticated areas.
- **State Management:** Uses React Context (`AuthContext`) for global authentication state and user details caching.
- **Styling:** Vanilla CSS with custom CSS variables for a modern light theme, eliminating the need for bulky utility frameworks.

### Folder Structure
```text
src/
├── api/            # Axios instance configuration and JWT interceptors
├── components/     # Reusable UI components (Navbar, ProtectedRoute)
├── context/        # Global context providers (AuthContext)
├── pages/          # Full-page views (Auth, Articles/Dashboard, Editor, ArticleDetail)
├── index.css       # Global CSS variables, utility classes, and theme styling
└── main.jsx        # App entry point
```

### Key Design Decisions
- **Rich Text Editor:** Integrated `react-quill-new` for a robust, embedded WYSIWYG editor to allow users to format their articles beautifully.
- **Axios Interceptors:** Configured an Axios interceptor to seamlessly attach the JWT token retrieved from `localStorage` to the `Authorization` header of every outbound API request.
- **Aesthetics & UX:** Refactored the UI from a dark theme to a bright, readable light theme (inspired by Medium/Notion). Implemented CSS word-breaking natively in article details to ensure long AI-generated strings do not overflow the UI cards.
- **AI Tooling UI:** Built dedicated action buttons ("Improve with AI", "Suggest Tags") into the Editor page, equipped with loading states (spinners) and graceful error handling.

## 2️⃣ AI Usage

- **AI Tools Used:** DeepMind's Antigravity Agent (Google AI Assistant).
- **Where AI Helped:**
  - **Code Generation:** Bootstrapping the Vite project, laying out the React Router, connecting `react-quill-new`, and setting up the base components.
  - **UI/UX Design:** Refactored the entire styling layer to transition the app towards a premium light theme. Optimized CSS variables for shadows, spacing, and typography.
  - **Refactoring:** Debugging `Context` state. Solved a dashboard filtering bug by persisting the exact `username` in `AuthContext` local storage rather than relying solely on the email address. Fixed string cutoff logic so HTML tags are cleanly stripped before generating 100-character article summaries.
  - **API Design:** Bridging the frontend AI buttons to the backend REST endpoints and defining the expected payload formats for AI improvement and tag suggestions.
- **What Was Reviewed/Corrected Manually:**
  - Validated UI appearances, ensuring contrast ratios and layout padding looked pristine.
  - Guided the agent to correct text overflow bugs for long strings in rendering containers.

## 3️⃣ Setup Instructions

### Prerequisites
- **Node.js:** v18+
- **NPM** or **Yarn**

### Environment Variables
Create a `.env` file in the root of the frontend folder (or configure via your hosting provider):

```env
VITE_API_BASE_URL=http://localhost:8080/api
```
*(If omitted, the default Axios base URL will default to `http://localhost:8080/api`)*

### Frontend Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:5173`. Make sure the backend server (port 8080) is also running so that API calls succeed.
