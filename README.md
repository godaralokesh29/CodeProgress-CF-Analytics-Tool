# CodeProgress

**CodeProgress** is a full-stack web application for tracking and managing student progress in competitive programming, with tight integration to [Codeforces](https://codeforces.com/). It provides a clean UI, powerful analytics, and tools for educators or teams to monitor coding performance.

📄 **Notion Doc**: [Project Overview & Docs](https://www.notion.so/CF-Student-DashBoard-21759dc85019818494d0c2bed1b5eff6?source=copy_link)

---

## ✨ Features

- **Student Management**: Add, edit, delete, and view student records.
- **Codeforces Sync**: Automatically fetch and update each student's contest and problem-solving history.
- **Analytics**: Visualize rating progression, contest history, and problem-solving activity.
- **CSV Export**: Export filtered student data as a CSV file.
- **Responsive UI**: Built with Tailwind CSS for a modern experience.

### 📬 Email Reminder System

- Auto reminders for inactive students
- Manual trigger and tracking
- Toggle reminders per student
- Gmail SMTP-based system

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

- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn
- Gmail account for email service

### 🔧 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/codeprogress.git
cd codeprogress
# Install dependencies
cd backend && npm install
cd ../project && npm install
# Create .env file in /backend
MONGODB_URI=<your_mongodb_uri>
MONGO_URI=mongodb://localhost:27017/codeprogress
PORT=3001
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
# Start servers
cd backend && npm run dev
cd ../project && npm run dev
```
## 🔐 Backend API Overview

### 📚 Student Endpoints

- `GET /students` – Fetch all students
- `GET /students/:id` – Fetch student by ID
- `POST /students` – Create a new student
- `PUT /students/:id` – Update student details
- `DELETE /students/:id` – Delete a student

### 🌐 Codeforces Sync

- `POST /students/:id/sync-codeforces` – Sync student's Codeforces data

### 📬 Reminder System

- `GET /reminders/students` – Get all students with reminder settings
- `GET /reminders/stats/:studentId` – Get reminder stats for a student
- `PATCH /reminders/toggle/:studentId` – Enable/disable reminders for a student
- `POST /reminders/reset-count/:studentId` – Reset reminder count for a student
- `POST /reminders/check-now` – Manually trigger reminder check
- `GET /reminders/email-config` – Check email configuration status

### ⏱️ Cron Management

- `GET /settings/cron/current` – Get current cron schedule
- `POST /settings/cron/set` – Update cron schedule

---

## 📸 Screenshots

- 📊 Student Dashboard with ratings and handles
- 📈 Detailed activity graphs
- 🔄 Sync and Reminder control tabs

---

## ⚙ Customization

- **App Name**: Change `CodeProgress` wherever referenced in UI
- **Theme**: Customize via `tailwind.config.ts`
- **Email Template**: Located in `backend/services/emailService.js`
- **Cron Logic**: Controlled via `backend/cron.js`

---

## 📊 Email Reminder Workflow

1. Detects inactivity after latest Codeforces sync  
2. Sends motivational reminder email with Codeforces links  
3. Enforces 24-hour cooldown between reminders  
4. Tracks number of reminders sent and last reminder date

---

## 🧪 Usage Tips

### ➕ Add Students

- Navigate to the **Students** tab → Click **Add Student**
- Fill in all required fields including Codeforces handle

### 📩 Manage Reminders

- Use the **Email Reminders** tab to:
  - Toggle reminders per student
  - View status and count
  - Manually trigger reminders
  - Reset reminder stats

### 📊 Monitor Activity

- ✅ Green – Active (recent submissions)
- 🔴 Red – Inactive (7+ days)
- ⚪ Gray – Reminders disabled

---

## 🛠 Troubleshooting

- **Email Not Sending**: Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
- **Authentication Errors**: Use Gmail App Password instead of account password
- **Gmail Blocking**: Adjust Gmail security settings
- **Codeforces API Errors**: Retry later or check API status
- **Network Issues**: Ensure proper internet connectivity

---

## 📁 Project Structure

```plaintext
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # REST API routes
│   ├── services/        # Core logic and utilities
│   └── server.js        # Main backend server entry
├── project/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── types/       # TypeScript interfaces/types
│   │   └── utils/       # Helpers and utilities
└── README.md

