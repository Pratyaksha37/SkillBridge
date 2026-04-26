# SkillBridge – Peer Skill Exchange Platform

## 📌 Overview
SkillBridge is a high-premium, web-based platform that connects learners and teachers within a community. It enables peer-to-peer knowledge exchange by allowing users to list skills they offer and skills they seek, with a built-in bidirectional matching algorithm.

---

## 🚀 Tech Stack
* **Frontend:** React + TypeScript + Tailwind CSS
* **Backend:** Node.js + Express + TypeScript
* **ORM:** Prisma (Schema-driven development)
* **Database:** PostgreSQL (Neon.tech)
* **Authentication:** JWT (JSON Web Tokens)

---

## ✨ Key Features
* **Smart Matching:** A real-time algorithm that calculates match percentages between users based on skill overlap.
* **Collaboration Hub:** Instant meeting link generation (Google Meet) and a comprehensive peer rating system.
* **Connection Management:** Build and manage your personal learning network with "Connect" and "Remove" features.
* **Advanced Explore:** Multi-filter search (by category or keyword) to find the perfect mentor.
* **Reputation System:** Dynamic average ratings displayed on profiles and search cards.

---

## 🏗️ Architectural Design Patterns

### 1. Singleton Pattern
All services and repositories are exported as singletons to ensure a single source of truth and efficient memory usage across the backend.
- **Example:** `export const userService = new UserService();`

### 2. Repository Pattern
We decouple database logic from business logic. The `userRepository` handles raw Prisma queries, while the `userService` handles the actual matching and dashboard logic.

### 3. Adapter Pattern
Our Service layer acts as an adapter, transforming complex database relations into clean, ready-to-render objects (DTOs) for the frontend.

### 4. Observer (Notification) Pattern
The frontend uses an observer-like pattern via React's `useEffect` hooks, which "observe" state changes (like category selection) and trigger automatic data synchronization.

---

## 🧩 SOLID Principles Applied

*   **S (Single Responsibility):** Each service is dedicated to a single domain (Auth, Users, Connections, Ratings).
*   **O (Open/Closed):** The filtering logic in `getMentors` is open to extension for new filters without modifying core query functions.
*   **L (Liskov Substitution):** We use a custom `AuthRequest` that seamlessly extends the Express `Request` interface.
*   **I (Interface Segregation):** Frontend components use lean, focused Prop interfaces to minimize unnecessary dependencies.
*   **D (Dependency Inversion):** High-level services depend on Repository abstractions rather than direct DB calls.

---

## 🧩 API Endpoints

### 👤 User & Profile
* `GET /api/users/dashboard` – Personalized dashboard with matching peers and connection history.
* `GET /api/users/mentors` – Filterable list of all peer mentors.
* `PATCH /api/users/profile` – Update user profile, bio, and availability.

### 🤝 Connections
* `POST /api/connections` – Establish a new connection.
* `DELETE /api/connections/:receiverId` – Remove an existing connection.

### 🌟 Skills & Ratings
* `POST /api/skills` – Add a new skill to your profile.
* `DELETE /api/skills` – Remove a specific skill.
* `POST /api/ratings` – Rate a peer's collaboration performance.

---

## 👨‍💻 How to Run

### Backend
```bash
cd backend
npm install
# Setup .env with DATABASE_URL and JWT_SECRET
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📖 Conclusion
SkillBridge demonstrates how modern software engineering principles like **SOLID** and **Design Patterns** can be used to build a robust, maintainable, and premium-quality peer-to-peer exchange platform.
