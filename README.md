# TLE-Intern-Assi
# TLE Eliminators

**TLE Eliminators** is a full-stack web application for tracking and managing student progress in competitive programming, with tight integration to [Codeforces](https://codeforces.com/). It provides a clean UI, powerful analytics, and tools for educators or teams to monitor coding performance.

---

## ✨ Features

* **Student Management**: Add, edit, delete, and view student records.
* **Codeforces Sync**: Automatically fetch and update each student's contest and problem-solving history.
* **Analytics**: Visualize rating progression, contest history, and problem-solving activity.
* **CSV Export**: Export filtered student data as a CSV file for offline use.
* **Responsive UI**: Built with Tailwind CSS for a modern, mobile-friendly experience.

---

## 🚀 Tech Stack

| Layer         | Technology                                   |
| ------------- | -------------------------------------------- |
| Frontend      | React, TypeScript, Tailwind CSS              |
| Backend       | Node.js, Express, MongoDB, Mongoose          |
| External APIs | [Codeforces API](https://codeforces.com/api) |

---

## ⚡ Getting Started

### 🔺 Prerequisites

* Node.js v16 or later
* MongoDB (local or cloud, e.g., MongoDB Atlas)
* npm or yarn

### 🔁 Installation

```bash
# 1. Clone the repository
$ git clone https://github.com/your-username/tle-eliminators.git
$ cd tle-eliminators
```

```bash
# 2. Install dependencies
$ cd backend && npm install
$ cd ../frontend && npm install
```

```bash
# 3. Create .env file in /backend
MONGODB_URI=<your_mongodb_uri>
PORT=3001
```

```bash
# 4. Start backend
$ cd backend
$ npm run dev
```

```bash
# 5. Start frontend
$ cd frontend
$ npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:3001](http://localhost:3001)

---

## 🔐 Backend API

### 📃 Student Routes

#### `GET /students`

Fetch all students.

```json
Response: [ { _id, name, email, codeforcesHandle, ... } ]
```

#### `GET /students/:id`

Fetch a student by ID.

```json
Response: { _id, name, email, ... }
```

#### `POST /students`

Create a new student.

```json
Request body:
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "codeforcesHandle": "janedoe",
  "phoneNumber": "1234567890"
}
```

#### `PUT /students/:id`

Update student details.

#### `DELETE /students/:id`

Delete a student.

---

### 🌐 Codeforces Sync

#### `POST /students/:id/sync-codeforces`

Fetch and update a student's Codeforces history.

```json
Response:
{
  "_id": "...",
  "codeforces": {
    "contestHistory": [
      { "contestId": 1567, "rank": 322, "ratingChange": 57, ... }
    ],
    "problemStats": {
      "totalSolved": 123,
      "easy": 55,
      "medium": 45,
      "hard": 23
    }
  }
}
```

---

## 🌐 Frontend Screenshots

* **Student Dashboard**: View enrolled students with rating, handle, and basic info.
* **Student Details**: See charts for contests and problem-solving activity.
* **Sync Button**: Instantly update a student’s Codeforces data.

---

## ⚖ Customization

* App name: Hardcoded as **TLE Eliminators** in UI.
* Theme: Modify `tailwind.config.ts` for branding changes.
* Cron jobs: Add syncing logic in `cron.js` (backend) to automate data fetch.

---

## 🙌 Contributing

We welcome contributions! Please:

* Fork the repo
* Create a feature branch
* Submit a pull request

For large changes, open an issue to discuss ideas.

---

## ✉ Contact

Have questions or suggestions?

* Open an issue on GitHub
* Email: [your-email@example.com](mailto:godaralokesh2023@example.com)

---

## ⚖ License

MIT License. See [LICENSE](LICENSE) for details.

---

> 🚀 **Track, improve, and win** with TLE Eliminators. Empower your competitive programming journey today!
