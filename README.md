# 🐸 Crypto Yearbook

A Pepe-the-Frog themed digital yearbook for crypto natives! Built with React, TypeScript, Supabase, and lots of meme energy.

## ✨ Features

- 🎨 **Pepe-themed UI** - Beautiful yearbook design with Pepe aesthetics
- 🔐 **Supabase Authentication** - Secure user authentication with magic links
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎭 **Profile System** - Create and customize your crypto native profile
- 🏆 **Achievement Badges** - Earn badges for crypto milestones
- 🎮 **Interactive Features** - Collaborative whiteboard and voting systems
- ⚡ **Fast & Modern** - Built with Vite for lightning-fast development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0xLLM73/crypto-yearbook.git
   cd crypto-yearbook
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Run the SQL schema in `database-schema.sql` in your Supabase SQL editor
   - This creates all necessary tables and Row Level Security policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the app**
   - Main app: `http://localhost:5173/`
   - Development bypass: `http://localhost:5173/bypass`
   - Static demo: `http://localhost:5173/static-yearbook.html`

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: Radix UI, Custom components
- **Deployment**: Vercel, Netlify, Docker ready

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── AuthPage.jsx    # Authentication
│   ├── YearbookPage.jsx # Main yearbook display
│   └── Layout.jsx      # App layout
├── contexts/           # React contexts
├── lib/               # Utilities and configurations
├── hooks/             # Custom React hooks
└── App.jsx            # Main app component

public/                # Static assets and demo files
database-schema.sql    # Supabase database schema
```

## 🎮 Development Features

### Authentication Bypass
For development, you can bypass authentication:
- Visit `/bypass` for a development portal
- Visit `/static-yearbook.html` for a static demo
- Use the bypass buttons in the auth page

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run deploy:vercel
```

### Netlify
```bash
npm run deploy:netlify
```

### Docker
```bash
npm run docker:build
npm run docker:run
```

## 🎨 Customization

### Colors & Themes
The app uses a custom Pepe-themed color palette defined in `tailwind.config.js`:
- `pepe-*` - Various shades of Pepe green
- `yearbook-*` - Yearbook cream colors
- `crypto-*` - Crypto-themed accent colors

### Adding Features
The project is designed to be extensible. Check out the component structure and follow the existing patterns.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- Pepe the Frog for being the ultimate meme
- The crypto community for inspiration
- All the amazing open-source libraries used

---

**Made with 💚 for the crypto community** 🐸✨