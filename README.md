# TLE-Intern-Assi
# TLE Eliminators

**TLE Eliminators** is a full-stack web application for tracking and managing student progress in competitive programming, with tight integration to [Codeforces](https://codeforces.com/). It provides a clean UI, powerful analytics, and tools for educators or teams to monitor coding performance.

NOTION DOC of Project - https://www.notion.so/CF-Student-DashBoard-21759dc85019818494d0c2bed1b5eff6?source=copy_link

---

## ✨ Features

* **Student Management**: Add, edit, delete, and view student records.
* **Codeforces Sync**: Automatically fetch and update each student's contest and problem-solving history.
* **Analytics**: Visualize rating progression, contest history, and problem-solving activity.
* **CSV Export**: Export filtered student data as a CSV file for offline use.
* **Responsive UI**: Built with Tailwind CSS for a modern, mobile-friendly experience.

### Email Reminder System
- **Automatic Reminders**: Send emails to students who haven't submitted in 7 days
- **Individual Control**: Enable/disable reminders for specific students
- **Reminder Tracking**: View how many times reminders have been sent to each student
- **Manual Trigger**: Manually check and send reminders for testing
- **Email Configuration**: Easy setup with Gmail SMTP

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
* Gmail account (for sending emails)

### 🔁 Installation

```bash
# 1. Clone the repository
$ git clone https://github.com/your-username/tle-eliminators.git
$ cd tle-eliminators
```

```bash
# 2. Install dependencies
$ cd backend && npm install
$ cd ../project && npm install
```

```bash
# 3. Create .env file in /backend
MONGODB_URI=<your_mongodb_uri>
MONGO_URI=mongodb://localhost:27017/tle
PORT=3001
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

```bash
# 4. Start backend
$ cd backend
$ npm run dev
```

```bash
# 5. Start frontend
$ cd project
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
* **Sync Button**: Instantly update a student's Codeforces data.

---

## ⚖ Customization

* App name:  **TLE Eliminators** in UI.
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
* Email: [godaralokesh2023@gmail.com]

---

## ⚖ License

MIT License. See [LICENSE](LICENSE) for details.

---

## Email Reminder System

### How It Works
1. **Automatic Detection**: After each data sync, the system identifies students who haven't made submissions in the last 7 days
2. **Email Sending**: Sends personalized reminder emails to inactive students
3. **Rate Limiting**: Prevents sending too many emails (24-hour cooldown between reminders)
4. **Tracking**: Records the number of reminders sent and last reminder date

### Email Features
- **Personalized Content**: Includes student name and motivational content
- **Actionable Links**: Direct link to Codeforces problem set
- **Tips Section**: Provides problem-solving tips and strategies
- **Professional Design**: Clean, responsive email template

### Management Interface
- **Status Overview**: View all students with their reminder status
- **Individual Controls**: Enable/disable reminders per student
- **Statistics**: See reminder counts and last submission dates
- **Manual Testing**: Trigger reminder checks manually
- **Configuration Status**: Check if email is properly configured

### API Endpoints

#### Reminder Management
- `GET /reminders/students` - Get all students with reminder settings
- `GET /reminders/stats/:studentId` - Get reminder stats for a student
- `PATCH /reminders/toggle/:studentId` - Toggle email reminders for a student
- `POST /reminders/reset-count/:studentId` - Reset reminder count for a student
- `POST /reminders/check-now` - Manually trigger reminder check
- `GET /reminders/email-config` - Check email configuration status

#### Cron Management
- `GET /settings/cron/current` - Get current cron schedule
- `POST /settings/cron/set` - Update cron schedule

## Usage

### Adding Students
1. Navigate to the Students tab
2. Click "Add Student"
3. Fill in student details including email and Codeforces handle
4. Email reminders are enabled by default

### Managing Reminders
1. Navigate to the "Email Reminders" tab
2. View all students and their reminder status
3. Use the toggle buttons to enable/disable reminders
4. Reset reminder counts if needed
5. Use "Check Reminders Now" to manually trigger the system

### Monitoring Activity
- **Active Students**: Green status, recent submissions
- **Inactive Students**: Red status, no submissions in 7+ days
- **Disabled Reminders**: Gray status, reminders turned off

## Configuration

### Cron Schedule
The default schedule runs at 2 AM daily. You can modify this via the API:
```bash
curl -X POST http://localhost:3001/settings/cron/set \
  -H "Content-Type: application/json" \
  -d '{"schedule": "0 2 * * *"}'
```

### Email Template
The email template is located in `backend/services/emailService.js` and can be customized as needed.

## Troubleshooting

### Email Issues
- **Not Sending**: Check EMAIL_USER and EMAIL_PASS in .env
- **Authentication Failed**: Ensure you're using an App Password, not your regular password
- **Gmail Blocked**: Check Gmail's security settings and allow less secure apps if needed

### Data Sync Issues
- **API Errors**: Check Codeforces API status
- **Rate Limiting**: The system handles rate limiting automatically
- **Network Issues**: Check your internet connection

## Development

### Project Structure
```
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── server.js        # Main server file
├── project/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   └── package.json
└── README.md
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

---

> 🚀 **Track, improve, and win** with TLE Eliminators. Empower your competitive programming journey today!
