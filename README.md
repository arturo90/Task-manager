# Second Brain Mobile (Expo + iOS TestFlight-ready)

This project upgrades the original habit tracker into a **mobile-first second brain** app designed to ingest anything and organize it into action.

## Product strategy (high-value outcomes)

The app is built around a high-leverage pipeline:

1. **Capture frictionlessly**: user pastes text, links, plans, restaurant ideas, social video links, reminders, and event snippets into one inbox.
2. **AI triage & structuring**: OpenAI classifies each capture and extracts meaningful metadata.
3. **Auto-routing to execution surfaces**:
   - To Dos
   - Restaurants
   - Reminders
   - Events / calendar-ready data
   - Media queues (videos/articles)
   - Ideas
4. **Feed + list UX**: users can scan everything as a chronological feed or switch to focused category views.
5. **Compounding productivity**: less context switching, faster retrieval, better follow-through.

## UX principles used

- **Single capture entry point** to eliminate decision fatigue.
- **AI confidence + metadata chips** to make categorization transparent.
- **Elegant dark visual system** with premium gradients and clean spacing.
- **Feed-first mental model** (similar to modern capture-first tools), plus filtered execution lists.

## Architecture

- `App.tsx`: app shell, capture orchestration, filters, feed rendering.
- `src/lib/ai.ts`: OpenAI-powered intake processing with local heuristic fallback.
- `src/lib/storage.ts`: local persistence using AsyncStorage.
- `src/components/*`: reusable UI building blocks (composer, segmented control, cards).

## OpenAI integration

Set environment variable:

```bash
export EXPO_PUBLIC_OPENAI_API_KEY="your_api_key"
```

When configured, the app sends capture text to OpenAI and asks for structured JSON output.
If no key is provided, it still works using deterministic local heuristics.

## Restaurant enrichment behavior

For restaurant-like captures (e.g., links, notes, screenshots transcribed to text), AI is prompted to extract:

- `name`
- `cuisine`
- `location`
- `rating`
- `priceRange`
- `imageHint`

This creates richer objects that can later be extended to include external lookups (Google Places/Yelp/Foursquare).

## Run locally

```bash
npm install
npm run start
```

Then open in Expo Go.

## iOS TestFlight path

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Authenticate and initialize:
   ```bash
   eas login
   eas build:configure
   ```
3. Set your `ios.bundleIdentifier` in `app.json`.
4. Build iOS archive:
   ```bash
   eas build --platform ios
   ```
5. Submit to App Store Connect / TestFlight:
   ```bash
   eas submit --platform ios
   ```

## Next enhancements for production excellence

- Native iOS Share Extension (capture from Safari, Photos, TikTok, Instagram).
- OCR + image understanding for screenshot ingestion.
- Calendar provider integrations (Google/Apple Calendar).
- Restaurant API enrichment with photo, ratings, map previews.
- Personal ranking engine (priority score, urgency, and intent prediction).
