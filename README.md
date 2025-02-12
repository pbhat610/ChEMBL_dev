# ChEMBL_dev

This project is a Full-Stack Web Application designed to visualize ChEMBL compound data.

##  Features

- **Real-time Scatter Plot** (D3.js + WebSockets)
- **Interactive Charts and Table**:
  - **Bar Chart**
  - **Pie Chart**
  - **Histogram**
  - **MUI DataGrid**
- **Dynamic Filtering System**
- **Backend API with PostgreSQL**

## Built With

- **Frontend**: React.js, D3.js, ECharts, Material-UI
- **Backend**: Node.js, Express, PostgreSQL, WebSockets (Socket.io)
- **Database**: ChEMBL dataset stored in PostgreSQL\



##  Installation Guide
To set up the project, follow these steps:



### **🔹 1. Clone the Repository**
```bash
git clone https://github.com/pbhat610/ChEMBL_dev.git
cd ChEMBL_dev
```

---

### **🔹 2. Install Dependencies**
Run the following commands to install dependencies for both **backend** and **frontend**.

####  Install in Root (`./ChEMBL_dev`)
```bash
npm install
```

####  Install in Backend (`./ChEMBL_dev/backend`)
```bash
cd backend
npm install
```

#### Install in Frontend (`./ChEMBL_dev/frontend`)
```bash
cd ../frontend
npm install
```

---

### **🔹 3. Start the Application**
This will run both front-end and backend
```bash
cd ./ChEMBL_dev
npm start
```

### **🔹Alternative method to Start the Application**
####  Start Backend (`./ChEMBL_dev/backend`)
```bash
cd ../backend/src
node server.js
```
**Backend runs on:** `http://localhost:5000`

####  Start Frontend (`./ChEMBL_dev/frontend`)
```bash
cd ../frontend
npm run dev
```



---
**Frontend runs on:** `http://localhost:3000` or default port


