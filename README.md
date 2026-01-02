# 🔐 Secure Realtime Chat

A **secure, ephemeral realtime chat application** built with **Next.js** and **Elysia**. Rooms are temporary, messages are realtime, and everything self-destructs when the room expires.

This project focuses on **speed**, **simplicity**, and **privacy** using modern tools like **Upstash Redis**, **Upstash Realtime**, **React Query**, and **shadcn/ui**.

---

## ✨ Features

* 🔒 **Secure temporary chat rooms**
* ⏱ **Auto room destruction (TTL-based)**
* ⚡ **Realtime messaging** (Upstash Realtime)
* 🧠 **Server state management** with React Query
* 🎨 **Modern UI** using shadcn/ui + Tailwind CSS
* 📱 **Mobile responsive** layout
* 🔁 **Live updates** on message & room destruction

---

## 🧱 Tech Stack

### Frontend

* **Next.js (App Router)**
* **React**
* **@tanstack/react-query** – server state & caching
* **shadcn/ui** – accessible UI components
* **Tailwind CSS** – styling

### Backend / API

* **Elysia** – fast, type-safe API framework
* **Upstash Redis** – message storage & TTL handling
* **Upstash Realtime** – pub/sub realtime events

---

## 📂 Project Structure

```
.
├── app/                # Next.js App Router
│   ├── room/[roomId]/  # Chat room UI
│   └── page.tsx        # Landing / create room
├── components/         # UI components (shadcn)
├── hooks/              # Custom hooks (username, realtime)
├── lib/                # Clients & utilities
│   ├── eden-client.ts  # Elysia client
│   ├── realtime-client.ts
│   └── formatters.ts
├── api/                # Elysia API routes
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/secure-chat.git
cd secure-chat
```

### 2️⃣ Install dependencies

```bash
npm install
# or
pnpm install
```

### 3️⃣ Environment Variables

Create a `.env.local` file and add:

```env
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
UPSTASH_REALTIME_URL=your_realtime_url
UPSTASH_REALTIME_TOKEN=your_realtime_token
```

> ⚠️ Make sure your Upstash database has **TTL enabled**.

---

### 4️⃣ Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧠 How It Works

### 🏠 Room Creation

* A room is created via Elysia API
* A TTL is assigned in Redis
* User is redirected to `/room/[roomId]`

### 💬 Messaging

* Messages are stored in Redis
* Each message publish triggers a realtime event
* Clients subscribed via Upstash Realtime update instantly

### 💥 Room Destruction

* Room auto-expires via Redis TTL
* Manual destruction triggers a realtime event
* All users are redirected when room is destroyed

---

## 📡 Realtime Events

| Event Name     | Description      |
| -------------- | ---------------- |
| `chat.message` | New message sent |
| `chat.destroy` | Room destroyed   |

---

## 📱 Mobile Responsiveness

* Responsive layout using Tailwind breakpoints
* Touch-friendly inputs & buttons
* Sticky chat input on mobile
* Works on small screens (320px+)

---

## 🛡 Security Notes

* No authentication (by design)
* Rooms are ephemeral
* Messages are not persisted long-term
* URLs act as temporary access keys

---

## 🧪 Future Improvements

* ✅ Chat bubbles
* ⏳ Typing indicators
* 🔐 Optional auth
* 📎 Attachments
* 🧹 Message cleanup animations

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Built with ❤️ using modern web tools.

If you like this project, feel free to ⭐ the repo!
