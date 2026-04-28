# Task Tracker — Backend

A robust Express.js backend for the Task Tracker application, built with TypeScript and Mongoose.

## 🚀 Tech Stack

- **Framework**: [Express.js 5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Environment**: Node.js
- **Tooling**: [Nodemon](https://nodemon.io/) & [ts-node](https://typestrong.org/ts-node/)

## 📁 Project Structure

```bash
├── src/
│   ├── models/         # Mongoose Schemas (Tag, Task, etc.)
│   ├── routes/         # Express API Routes
│   ├── controllers/    # Request handlers and logic
│   └── server.ts       # Application entry point
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root of the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints (Planned/Implemented)

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update task status/details
- `DELETE /api/tasks/:id` - Remove a task
- `GET /api/tags` - Fetch task categories/tags

---
Part of the **Md Danish Alam** development workspace.
