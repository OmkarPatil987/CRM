# Deep Dive: Lead CRUD API 🚀

Welcome to the backend! I've analyzed your `Lead` creation flow. Here is the breakdown.

## 1. What does this API do?
In simple terms, the `POST /lead/create` API is the **entry point** for new potential customers.
When a user (like a sales agent) fills out a form to add a new lead, this API:
1.  **Validates** the data (name, mobile, email).
2.  **Saves** the lead to the database.
3.  **Generates** a readable "Unique Lead ID" (e.g., `LEAD/2310/00001`).
4.  **Logs** an activity ("Created Lead by...").
5.  (Optional) Creates an initial **Follow-Up** task.

It's not just "inserting a row"; it's initializing a business process.

---

## 2. Request Flow (Step-by-Step)

1.  **Client** sends a `POST` request with JSON data + `Authorization` header (Bearer Token).
2.  **Router** (`routes.go`) matches the URL `/lead/create`.
3.  **Middleware** (`middleware/auth_middleware.go`) intercepts the request:
    *   Checks if the token is valid.
    *   Extracts `UserID` from the token.
    *   Adds `auth_user_id` to the request headers for the controller to use.
4.  **Controller** (`lead_controller.go`) takes over:
    *   Reads the JSON body.
    *   Validates format (e.g., is Email valid?).
    *   Calls the Service.
5.  **Service** (`lead_service.go`) handles logic:
    *   Prepares the data model.
    *   Calls Repository to save raw lead.
    *   Generates the fancy `UniqueLeadID`.
    *   Updates the lead with this ID.
    *   Adds an "Activity" log.
6.  **Repository** (`lead_repository.go`) converts structs to SQL queries and executes them on the DB.
7.  **Response**: JSON confirms success to the Client.

---

## 3. Data Movement

**Route** (`routes.go`)
⬇️ *Passes `gin.Context`*
**Controller** (`lead.go`)
⬇️ *Converts DTO (Data Transfer Object) → Service Params*
**Service** (`lead_service.go`)
⬇️ *Converts Service Params → Database Model (`model/lead.go`)*
**Repository** (`lead_repository.go`)
⬇️ *Executes SQL (GORM)*
**Database** (leads table)

---

## 4. Middleware: The Bouncer 🛡️

You have `TokenAuthentication` middleware in `auth_middleware.go`.
*   **Role**: Security Guard.
*   **Action**: It looks at `Authorization: Bearer <token>`.
*   **If valid**: It decodes the token (JWT), grabs the `UserID`, and "stamps" the request with `c.Request.Header.Set("auth_user_id", ...)`.
*   **If invalid**: It immediately returns `401 Unauthorized` and stops the request from reaching the controller.

---

## 5. Validation Logic ✅

Validation happens in two layers:
1.  **JSON Decoding**: If you send "Age": "Ten" for an integer field, it fails immediately in the Controller (`json.NewDecoder`).
2.  **Struct Validation**: The controller calls `util.ValidateStruct(req)`.
    *   This likely uses the `validator` library tags (like `validate:"required,email"`) defined in your `dto` package.
    *   If a field is missing or invalid, it returns a 400 error describing *which* field failed.

---

## 6. Possible Edge Cases ⚠️

1.  **Race Condition on Unique ID**:
    *   The code generates IDs like `LEAD/YYMM/00001`.
    *   It counts existing leads to determine the number (e.g., count is 5, next is 6).
    *   *Risk*: If two requests hit at the *exact same microsecond*, they might both see "count = 5" and both try to create #6.
2.  **Partial Failures**:
    *   The service creates the Lead first.
    *   Then, it updates it with the UniqueID.
    *   Then, it adds an Activity.
    *   *Risk*: If the server crashes after creating the lead but before adding the Activity, you have a Lead without an Activity log. (See "Improvements").

---

## 7. Error Handling 🚨

Currently, error handling is "Bubble Up":
*   **DB Error** -> **Repository** returns `error`.
*   **Service** sees error -> returns `error` to Controller.
*   **Controller** sees error -> returns `500 Internal Server Error` with the message.

*Critique*: Returning raw DB errors (like "Duplicate entry for key...") to the frontend is bad for security. Usually, we maps these to user-friendly messages.

---

## 8. Frontend Consumption ⚛️

Using Axios (React):

```javascript
// DTO matches the JSON expected by Backend
const payload = {
  name: "John Doe",
  mobile_number: "9876543210",
  email: "john@example.com", 
  enquiry_text: "Interested in CRM"
};

try {
  const response = await axios.post('/api/lead/create', payload, {
    headers: {
      Authorization: `Bearer ${token}` // Critical!
    }
  }); 
  console.log("Lead Created:", response.data);
} catch (error) {
  if (error.response.status === 400) {
    console.error("Validation failed:", error.response.data.message);
  }
}
```

---

## 9. Suggested Improvements (Backend) 🛠️

1.  **Use Transactions (`Begin -> Commit/Rollback`)**:
    *   Since you are doing multiple DB writes (Create Lead, Update ID, Add Activity, Add FollowUp), you should wrap them in a **Transaction**.
    *   *Why?* If adding the Activity fails, the whole Lead creation should be rolled back so you don't have "ghost" data.
    
    ```go
    tx := database.DB.Begin()
    // pass 'tx' to repo methods instead of using global DB
    if err := tx.Create(&lead).Error; err != nil {
       tx.Rollback()
       return err
    }
    // ... other ops ...
    tx.Commit()
    ```

2.  **Fix `auth_user_name`**:
    *   The middleware sets `auth_user_id` but *not* `auth_user_name`.
    *   The Controller tries to read `auth_user_name` but it's empty.
    *   The Service then has to make an *extra DB call* in `resolveUserName` to fetch the name.
    *   *Fix*: Add the name to the JWT token claims so the middleware can set it directly at `c.Request.Header.Set("auth_user_name", claims.Name)`. Saves 1 DB query per request!

3.  **Atomic ID Generation**:
    *   Instead of `Count() + 1`, use a database sequence or a separate "counters" table to ensure IDs never duplicate even under high load.

---
