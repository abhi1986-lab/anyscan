# Snap2Sheet Backend

This is the MVP backend for Snap2Sheet. It handles transient image uploads, mock OCR processing, and extraction serialization.

## Folder Structure
- `src/` - App source code
  - `config/` - Environment settings
  - `controllers/` - Route logic (Extract)
  - `middleware/` - Multer file upload & error handling
  - `routes/` - API definitions `/extract`, `/health`
  - `services/` - Isolated business logic (OCR, Parsers)
  - `types/` - TS types
- `uploads/` - Transient image stoage

## Setup
1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

## Endpoints
- `GET /health` : Returns basic ok status.
- `POST /extract` : Expects multipart form-data (`image` field). Returns structured text and JSON fields.
