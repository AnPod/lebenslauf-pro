# Lebenslauf Pro

Professioneller deutscher Lebenslauf Generator mit KI-gestütztem Anschreiben.

## Features

- 🇩🇪 **Deutsches Lebenslauf-Format** — Optimiert für DACH-Region
- 📸 **Passfoto-Upload** — Wie im traditionellen deutschen Lebenslauf üblich
- 🤖 **KI-Anschreiben** — Generiert maßgeschneiderte Anschreiben basierend auf Stellenbeschreibung
- 📄 **PDF Export** — Professioneller PDF-Download im A4-Format
- 🎨 **Moderne Templates** — Verschiedene Design-Optionen

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lebenslauf-pro.git
cd lebenslauf-pro

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your OpenAI API key to .env.local
OPENAI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PDF Generation:** @react-pdf/renderer
- **AI:** OpenAI GPT-4o-mini
- **Icons:** Lucide React

## DACH-Specific Features

- **Geburtsdatum & Geburtsort** — Standard in deutschen Lebensläufen
- **Staatsangehörigkeit** — Wichtig für internationale Bewerbungen
- **Anschreiben-Format** — Deutsche Geschäftsbrief-Konventionen
- **Sprachniveaus** — A1-C2 nach GER (Gemeinsamer Europäischer Referenzrahmen)
- **Fähigkeiten-Kategorien** — Technisch, Sprachen, Soft Skills

## Monetization Ideas

- **Freemium:** Kostenlose Lebensläufe, Premium Templates & KI-Anschreiben
- **One-time:** €9.99 für PDF Export ohne Wasserzeichen
- **Subscription:** €4.99/Monat für unbegrenzte KI-Anschreiben

## License

MIT