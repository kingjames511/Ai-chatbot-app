# AI Chatbot App 🤖

A full-stack AI chatbot application built with React, Supabase, and OpenAI API. Features secure authentication, persistent chat history, multiple conversation modes, and real-time AI responses.

![AI Chatbot Demo](./assets/demo-screenshot.png)

## ✨ Features

- 🔐 **Secure Authentication** - Email/password and magic link login via Supabase Auth
- 💬 **Real-time Chat Interface** - Interactive chat UI with typing indicators
- 🧠 **OpenAI Integration** - Powered by GPT models via secure backend endpoints
- 📚 **Chat History** - Persistent conversation storage across sessions
- 🎭 **Multiple Chat Modes** - Tutor, Career Coach, Code Helper, and more
- 🌙 **Dark/Light Theme** - Toggle between themes for better UX
- 📱 **Responsive Design** - Mobile-friendly interface
- ⚡ **Streaming Responses** - Real-time typing effect for AI responses
- 🔒 **Secure API Calls** - OpenAI API key protected via Supabase Edge Functions

## 🛠️ Tech Stack

- **Frontend**: React/Next.js, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **AI**: OpenAI GPT API
- **Deployment**: Vercel (Frontend), Supabase (Backend)
- **Database**: PostgreSQL (via Supabase)

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │───▶│  Supabase        │───▶│   OpenAI API    │
│   (Frontend)    │    │  Edge Functions  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Supabase DB    │
                       │   (PostgreSQL)   │
                       └──────────────────┘
```

## 📊 Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chats table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  mode TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-chatbot-app.git
cd ai-chatbot-app
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Configuration

1. Create a new Supabase project
2. Run the database schema (see schema above)
3. Enable Row Level Security (RLS) policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own chats" ON chats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own messages" ON messages FOR ALL USING (
  EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid())
);
```

### 4. Deploy Supabase Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the chat function
supabase functions deploy chat

# Set your OpenAI API key
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your chatbot in action!

## 📁 Project Structure

```
ai-chatbot-app/
├── components/
│   ├── Chat/
│   │   ├── ChatWindow.jsx
│   │   ├── MessageList.jsx
│   │   ├── MessageInput.jsx
│   │   └── TypingIndicator.jsx
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   └── SignupForm.jsx
│   └── Layout/
│       ├── Header.jsx
│       └── Sidebar.jsx
├── pages/
│   ├── index.js
│   ├── chat/[id].js
│   └── auth/
├── lib/
│   ├── supabase.js
│   └── utils.js
├── supabase/
│   └── functions/
│       └── chat/
│           └── index.ts
└── styles/
    └── globals.css
```

## 🔧 Supabase Edge Function

The chat functionality is powered by a secure Supabase Edge Function:

```typescript
// supabase/functions/chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  try {
    const { message, chat_id } = await req.json()
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      }),
    })
    
    const data = await response.json()
    const aiResponse = data.choices[0].message.content
    
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

## 🎨 Available Chat Modes

- **General** - Open-ended conversations
- **Tutor** - Educational assistance and explanations
- **Career Coach** - Professional development guidance
- **Code Helper** - Programming assistance and debugging
- **Creative Writer** - Story writing and creative content

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Backend (Supabase)

The backend is automatically deployed with Supabase Edge Functions.

## 📝 Development Timeline

This project was built following a structured 6-week development plan:

- **Week 1**: Project setup and authentication
- **Week 2**: Database design and integration
- **Week 3**: OpenAI API integration via Edge Functions
- **Week 4**: Chat UI development
- **Week 5**: Enhanced features (themes, multiple chats, modes)
- **Week 6**: Deployment and documentation

## 🔮 Future Enhancements

- [ ] Voice input/output capabilities
- [ ] File upload and processing
- [ ] Chat export functionality
- [ ] Usage analytics and insights
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Custom AI model fine-tuning

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for the GPT API
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for deployment
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Contact

king james(omekejames1@gmail.com)

Project Link: [https://github.com/kingjames511/ai-chatbot-app](https://github.com/yourusername/ai-chatbot-app)

Live Demo: [https://your-chatbot-app.vercel.app](https://your-chatbot-app.vercel.app)

---

⭐ **Built with React, Supabase, and OpenAI API** ⭐
