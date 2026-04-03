# SkillBridge – Peer Skill Exchange Platform

## 📌 Overview

SkillBridge is a web-based platform that connects learners and teachers within a community. Users can list skills they can teach and skills they want to learn, enabling peer-to-peer knowledge exchange.

The goal is to simplify finding mentors, collaborators, or practice partners for various skills such as programming, languages, and arts.

---

## 🚀 Tech Stack

* **Frontend:** React + TypeScript
* **Backend:** Node.js + TypeScript (Express/NestJS)
* **Database:** MongoDB / PostgreSQL
* **Authentication:** JWT
* **Version Control:** Git + GitHub

---

## ✨ Features

* User profiles with offered and desired skills
* Skill-based search and matching
* Peer connections and notifications
* Messaging / session scheduling
* Ratings and feedback system

---

## 🧩 Design Pattern Used

### Observer Pattern

The Observer pattern is used for implementing the notification system.

#### 📌 Purpose

To notify users automatically when:

* A new match is found
* A skill is added
* A message is received

#### 🏗 Structure

* **Subject:** MatchService / SkillService
* **Observers:** Users / NotificationService

#### ⚙️ Example

When a new skill is added, the system notifies all relevant users subscribed to that skill.

#### ✅ Benefits

* Loose coupling between components
* Scalable notification system
* Easy to extend (email, SMS, etc.)

---

## 🧱 System Design

### Architecture

The project follows a **three-tier architecture**:

1. **Frontend (React)** – User interface
2. **Backend (Node.js API)** – Business logic
3. **Database** – Data storage

### API Design

RESTful APIs will be used:

* `POST /users` – Create user
* `GET /skills` – Fetch skills
* `POST /matches` – Create match
* `GET /sessions` – Fetch sessions

---

## 🧠 OOP Design

### Core Classes

#### User

* Manages user profile and skills

#### Skill

* Represents a specific skill

#### Session

* Represents a learning interaction between users

### Relationships

* User ↔ Skill → Many-to-Many
* User ↔ Session → One-to-Many
* Session ↔ Skill → Many-to-One

---

## 📊 ER Diagram (Conceptual)

### Entities

* User
* Skill
* Session
* Message
* Rating

### Relationships

* Users can have multiple skills
* Users participate in multiple sessions
* Sessions include messages and ratings

---

## 🔄 SDLC Approach

The project follows an **Agile (Iterative) model**:

1. Requirement Analysis
2. System Design (OOP, ER diagrams, APIs)
3. Implementation
4. Testing (Unit + Integration)
5. Deployment
6. Maintenance

---

## 🧩 SOLID Principles Applied

* **SRP:** Each class has a single responsibility
* **OCP:** Matching logic can be extended without modification
* **LSP:** Subclasses (Teacher/Learner) behave like User
* **ISP:** Separate interfaces for different functionalities
* **DIP:** High-level modules depend on abstractions

---

## 📁 Project Structure

```
/src        → Source code  
/docs       → Documentation  
/diagrams   → UML & ER diagrams  
/db         → Database schema/config  
```

---

## 🔐 Security Considerations

* JWT-based authentication
* Input validation
* Secure API endpoints

---

## 📌 Future Enhancements

* Real-time chat using WebSockets
* Advanced matching algorithm
* Mobile app version
* Integration with email/SMS services

---

## 👨‍💻 How to Run (Basic)

```bash
# Clone repo
git clone <repo-url>

# Install dependencies
npm install

# Run backend
npm run dev

# Run frontend
npm start
```

---

## 📖 Conclusion

SkillBridge demonstrates the application of:

* Object-Oriented Programming
* Design Patterns (Observer)
* SOLID principles
* System Design and Architecture

It provides a practical solution for peer-to-peer skill exchange in a scalable and maintainable way.
