# 🏥 WARDLY – ICU Alert and Attender Notification System

WARDLY is a real-time ICU alert and attender notification system designed to improve communication between ICU staff and patient attenders. 
It uses a smart outside display and automated phone-call escalation to ensure that no critical ICU call goes unnoticed.

---

## 📌 Problem Statement

In many hospitals, when nurses need to contact a patient’s attender, they step outside the ICU and call the patient’s name. 
If the attender is not nearby (for food, rest, or other reasons), the call is missed. 
This leads to delays, repeated calls, stress for nurses, and potential risks during emergency situations.

WARDLY was built to solve this real-world problem.

---

## 💡 Solution Overview

WARDLY provides a simple digital system where:
- Nurses can trigger alerts from inside the ICU
- Patient names are displayed clearly on a monitor outside the ICU
- If there is no response, automated phone calls are made to emergency contacts

The system is designed to be simple, safe, and practical for real hospital environments.

---

## ⚙️ How WARDLY Works

### 1️⃣ Secure Ward Login
- Each ICU ward logs in using a **Ward ID and password**
- The system automatically identifies the ICU ward

---

### 2️⃣ Patient Management Dashboard
Nurses can:
- Add patient details (patient name, patient ID, two emergency contact numbers)
- Delete patients (restricted during active alerts)
- Trigger alerts for patient attenders

🔒 No medical or sensitive patient data is stored.

---

### 3️⃣ Smart Queue-Based Alert System
- Multiple patients can be added to the alert queue
- Each patient runs on an independent timer
- Alerts operate in parallel, reflecting real ICU workflows

---

### 4️⃣ Outside ICU Display (Real-Time)
- Displays patient name and ID in large, clear text
- Screen dynamically splits based on the number of active alerts
- Uses subtle background pulsing for visibility
- Display is read-only and cannot be controlled from outside

---

### 5️⃣ Automated Call Escalation (Core Feature)
- If the attender does not respond within **2 minutes**:
  - The system automatically calls the **primary emergency contact**
  - If unanswered, it escalates to the **secondary contact**

📞 Calls are implemented using **Twilio**.  
For development and testing, a **US phone number was purchased using Twilio’s free trial credits**.


---

### 6️⃣ Safety-First Design
- Active patients cannot be deleted
- Alerts can be cancelled per patient
- Backend validations prevent unsafe actions

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Custom CSS (hospital-themed UI)

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Real-Time Communication
- Socket.IO

### Authentication
- JWT (JSON Web Tokens)

### Calling Service
- Twilio

### Architecture
- MERN Stack

---

## 🚀 Features Summary

- Real-time ICU alerts
- Queue-based alert handling
- Independent timers per patient
- Outside ICU display with dynamic screen split
- Automated call escalation using Twilio
- Secure ward-based authentication
- Safety checks for critical actions

---

## 🌱 Impact

WARDLY helps to:
- Reduce missed ICU calls
- Save nurses’ time
- Lower stress for staff and patient attenders
- Improve communication speed during critical situations

---

## 📂 Project Status

- Core features implemented
- Tested with real Twilio calls (trial account)
- Can be extended for production use

---

## 🔮 Future Enhancements

- SMS fallback if calls fail
- Role-based access control
- Call logs and audit history
- Mobile-friendly nurse interface
- Full production deployment

---

## 🙌 Acknowledgements

This project was inspired by a real hospital experience and built to solve a practical, real-world problem.

---

## 📄 License

This project is for educational and demonstration purposes only.
