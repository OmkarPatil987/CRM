# React.js Project with Environment Setup

## **Introduction**  
This project is a React.js application that dynamically configures API endpoints based on the environment (local, UAT, or live). The configuration is managed using environment variables defined in `.env` files.

---

## **Environment Variables**  
The application uses environment variables to handle different configurations for development, testing, and production.

### **Sample `.env` File**
```plaintext
REACT_APP_BASE_URL='http://localhost:3000/'              # Base URL for local development
REACT_APP_IS_LIVE='0'                                    # '1' for live, '0' for UAT
REACT_APP_API_BASE_URL_UAT='https://---------/apis/'  # UAT API Base URL
REACT_APP_API_BASE_URL_LIVE='https://--------/apis/'    # Live API Base URL
```

### **Environment Variable Details**
| Variable                   | Description                                | Example Value                                |
|----------------------------|--------------------------------------------|---------------------------------------------|
| `REACT_APP_BASE_URL`       | Base URL for the app                      | `http://localhost:3000/`                    |
| `REACT_APP_IS_LIVE`        | Flag to toggle between UAT and Live API   | `0` (UAT), `1` (Live)                       |
| `REACT_APP_API_BASE_URL_UAT` | Base URL for UAT API                     | `https://-----/apis/`  |
| `REACT_APP_API_BASE_URL_LIVE` | Base URL for Live API                   | `https://-----/apis/`      |

---

## **Configuration in Code**
The app dynamically determines which API to use based on the environment variable `REACT_APP_IS_LIVE`.

### **Implementation**
```javascript
const ISLIVE = process.env.REACT_APP_IS_LIVE === '1';

export const BaseUrls = {
    API_SERVER: {
        url: ISLIVE ? process.env.REACT_APP_API_BASE_URL_LIVE : process.env.REACT_APP_API_BASE_URL_UAT,
    },
};
```

### **How It Works**
- If `REACT_APP_IS_LIVE` is `'1'`, the app will use the **Live API URL**.
- If `REACT_APP_IS_LIVE` is `'0'`, the app will use the **UAT API URL**.

---

### **  how to use **
-  const [searchTerm, setSearchTerm] = useState('');
-  const handleSearchTermChange = (term: string) => {
      setSearchTerm(term);
   };
-  const handleSearch = (term: string) => {
      console.log("Searching for:", term);
   };
- <SearchBar searchTerm={searchTerm} onSearch={handleSearch} onSearchTermChange={handleSearchTermChange} /> 
---
## **Getting Started**

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd <project-folder>
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Create Environment Files**
Create a `.env` file in the root directory with the required variables. For local development, you can use `.env.development`.

### **4. Run the Application**
```bash
npm start
```

### **5. Build for Production**
```bash
npm run build
```

---

## **Best Practices**
1. **Environment-Specific Files**  
   Use `.env.development`, `.env.production`, and `.env.local` to handle configurations for different environments.
   
2. **Do Not Commit `.env` Files**  
   Ensure `.env` files are added to `.gitignore` to prevent sensitive information from being pushed to the repository.

3. **Secure API Keys**  
   Use secret management tools to share and manage sensitive environment variables securely.

---

## **Folder Structure**
```plaintext
├── src
│   ├── components       # Reusable React components
│   ├── config           # Configuration files (BaseUrls.js)
│   ├── pages            # Page components
│   ├── utils            # Utility functions
│   └── App.js           # Main app entry point
├── public
│   └── index.html       # Main HTML file
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

---

## **Contributing**
1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b <branch-name>
   ```
2. Commit your changes:
   ```bash
   git commit -m "Your commit message"
   ```
3. Push to the branch:
   ```bash
   git push origin <branch-name>
   ```
4. Create a merge request on GitLab.