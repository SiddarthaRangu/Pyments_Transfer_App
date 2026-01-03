💸 SwiftPay — Full-Stack Digital Wallet
=======================================

SwiftPay is a **full-stack peer-to-peer digital wallet application** that allows users to securely manage balances and transfer money between accounts.The project focuses on **real-world product behavior**, **transaction safety**, and **polished user experience**, going beyond basic CRUD functionality.

✨ Key Features
--------------

### 🔐 Authentication & Security

*   User Signup & Signin with **JWT-based authentication**
    
*   Protected routes and secure API access
    
*   Centralized auth handling using Axios interceptors
    

### 💰 Wallet & Payments

*   View real-time wallet balance
    
*   Add funds to wallet
    
*   Peer-to-peer money transfers
    
*   **Atomic transactions using MongoDB sessions** to prevent partial failures
    

### 🧭 User Experience

*   Step-based “Send Money” flow with confirmation
    
*   Inline validation and guarded actions (e.g. insufficient balance)
    
*   Skeleton loaders for perceived performance
    
*   Debounced user search to reduce unnecessary API calls
    
*   Toast-based success and error feedback
    

### 📊 Activity & Management

*   Transaction history with sent/received indicators
    
*   Contacts list for quick transfers
    
*   Profile & settings page
    

🛠️ Tech Stack
--------------

### 🌐 Frontend

*   **React**
    
*   **React Router**
    
*   **Tailwind CSS**
    
*   **shadcn/ui**
    
*   Axios
    

### 🖥️ Backend

*   **Node.js**
    
*   **Express.js**
    
*   **MongoDB**
    
*   **Mongoose**
    
*   JWT Authentication
    
*   MongoDB Transactions (startSession) for atomic transfers
    

🧠 Engineering Highlights
-------------------------

*   **ACID-compliant money transfers** using MongoDB sessions
    
*   **Centralized API layer** with Axios interceptors
    
*   **Debounced search & skeleton loading** for optimized UX
    
*   **Reusable component architecture** with clear separation of concerns
    
*   Focus on the “last 10%” of product polish that turns a demo into a usable app
    

🏗️ Installation & Local Setup
------------------------------

### ⚙️ Prerequisites

*   Node.js (v18+ recommended)
    
*   npm
    

### 🔧 Steps to Run Locally:
```sh
# Clone the repository
git clone https://github.com/SiddarthaRangu/Pyments_Transfer_App.git

# Navigate to the project folder
cd Pyments_Transfer_App

# Install frontend dependencies
cd client
npm install

# Start the frontend
npm run dev
```

```sh
# Open a new terminal for backend
cd server
npm install

# Start the backend
npm start
```
🚀 The frontend runs on `http://localhost:5173` (or `http://localhost:3000` depending on your setup).  
🔗 The backend runs on `http://localhost:3000/api`.

---

### 🌐 Local URLs

*   Frontend: http://localhost:5173
    
*   Backend API: http://localhost:3000/api
    

🚀 Live Demo
------------

🔗 **Deployed Application:**[https://pyments-transfer-app.vercel.app](https://pyments-transfer-app.vercel.app)

📌 Project Status
-----------------

This project is **actively evolving** and focused on:

*   UX polish
    
*   Better validation and feedback
    
*   Test coverage
    
*   Production-level refinements
    

🤝 Contributing
---------------

Contributions are welcome!Feel free to open an issue or submit a pull request.

📜 License
----------

This project is licensed under the **MIT License**.

📎 Repository
-------------

🔗 **GitHub:**[https://github.com/SiddarthaRangu/Pyments\_Transfer\_App](https://github.com/SiddarthaRangu/Pyments_Transfer_App)