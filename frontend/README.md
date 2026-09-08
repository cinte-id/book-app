# Book Tracker App Frontend

A modern React application for managing your reading list, built with Vite, TypeScript, and shadcn/ui.

## Features

- 📚 Add, view, update, and delete books
- 📖 Track reading status (unread/reading/completed)
- 🎨 Modern and responsive UI with Tailwind CSS
- 🔄 Real-time updates
- ⚡ Fast and efficient with React + Vite
- 🛡️ Type-safe with TypeScript

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- ESLint
- PostCSS

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── data/          # Data and mock files
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── App.tsx        # Main React component
│   ├── App.css        # App-specific styles
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles
├── public/            # Static assets
├── tailwind.config.ts # Tailwind configuration
├── components.json    # shadcn/ui configuration
├── postcss.config.js  # PostCSS configuration
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── package.json       # Frontend dependencies
```

## Prerequisites

- Node.js 16.x or later
- npm or yarn

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Development

### Component Structure
- Use functional components with TypeScript
- Implement proper type definitions
- Follow shadcn/ui component patterns

### State Management
- Use React hooks for local state
- Implement custom hooks for shared logic
- Consider context for global state

### Styling
- Use Tailwind CSS classes
- Follow shadcn/ui design system
- Maintain consistent spacing and colors

### Type Safety
- Define interfaces for all data structures
- Use TypeScript strict mode
- Implement proper error handling

## Configuration Files

### tailwind.config.ts
- Tailwind CSS configuration
- Custom theme settings
- Plugin configurations

### components.json
- shadcn/ui component configuration
- Style and theme settings

### tsconfig.json
- TypeScript configuration
- Path aliases
- Compiler options

### vite.config.ts
- Vite bundler configuration
- Plugin settings
- Build options

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Authentication system
- [ ] Search and filtering
- [ ] Sorting options
- [ ] Book categories/tags
- [ ] Reading progress tracking
- [ ] Book ratings and reviews
- [ ] User profiles and personal libraries

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Customer Service Implementation

### Chosen Role

Customer Service

### Overview

This implementation adds a customer support system for the Book Tracker application, including self-service help, support ticket submission, user guidance, feedback collection, live chat UI, and internal customer service ticket monitoring.

### Features Implemented

- Searchable Help & FAQ
- Categorized FAQ content
- Accordion-based support sections
- Contact Support form
- Form validation
- Support ticket generation
- Ticket persistence using browser localStorage
- User Guide / Tutorial
- Feedback & Suggestion form
- User satisfaction rating
- Live Chat widget interface
- Customer Service Dashboard
- Support ticket search and status filtering
- Support ticket tracking interface

### Customer Flow

Customer support can be accessed through:

`Home → Profile → Customer Support`

The customer-facing support page contains:

- Help & FAQ
- Contact Support
- User Guide
- Feedback & Suggestion
- Live Chat

### Routes

- `/support` — Customer-facing support center
- `/support/dashboard` — Internal Customer Service Dashboard

### How to Run

1. Navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
http://localhost:8080/
Profile → Customer Support
http://localhost:8080/support
http://localhost:8080/support/dashboard 