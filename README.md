# Completely replace the README.md with clean content
@'
# Nairobi Matatu Monitor

Community-powered real-time traffic and transit information for Nairobi commuters.

## Features

- Real-time traffic updates
- Matatu route information  
- Live fare information
- Crowdsourced reports
- Interactive map view

## Tech Stack

- React 18 with TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui components
- Google Maps API

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
1. Clone the repository:
\`\`\`bash
git clone https://github.com/ronaldkiprotich1/nairobi-route-sense-clean.git
cd nairobi-route-sense-clean
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open http://localhost:8080 in your browser

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production  
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## Project Structure

\`\`\`
src/
├── components/     # React components
├── pages/         # Page components  
├── hooks/         # Custom React hooks
├── lib/           # Utilities
└── types/         # TypeScript definitions
\`\`\`

## License

MIT License
'@ | Set-Content README.md
