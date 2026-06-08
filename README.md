# MERN Personal Finance Tracker

A full-stack web application built with the MERN (MongoDB, Express, React, Node.js) stack for tracking personal finances, managing budgets, and analyzing spending habits.

## Features

- **User Authentication**: Secure JWT-based user authentication with password hashing
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Budget Tracking**: Set and monitor monthly budgets by category
- **Category Management**: Create custom expense and income categories
- **Dashboard**: Real-time financial overview with income, expenses, and balance
- **Data Visualization**: Charts and analytics for spending patterns
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication
- **bcryptjs**: Password hashing

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization

## Project Structure

```
MERN/
├── server/                 # Backend application
│   ├── config/            # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database schemas
│   ├── routes/            # API routes
│   ├── server.js          # Express app setup
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context for state management
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service calls
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Frontend dependencies
│   └── .env.example       # Environment variables template
├── package.json           # Root package.json
└── README.md             # This file
```

Happy tracking! 💰
