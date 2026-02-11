# CRM Backend Learning Guide
Learn the Go backend in `crm-backend` step-by-step. Paths are relative to `crm-backend/`.

---
## 1) Project Map
- `main.go` — entry point; loads env, logger, DB, router.
- `app/` — wires controllers with services (`InitApp`).
- `route/` — Gin router setup and route groups.
- `controller/` — HTTP handlers: decode/validate input, call services, shape responses.
- `service/` — business logic; orchestrates repositories and validation.
- `repository/` — database access via GORM; no HTTP concerns.
- `model/` — GORM models (table mappings).
- `dto/` — request/response DTOs sent over the wire.
- `middleware/` — cross-cutting layers (JWT auth).
- `config/` — configuration structs (MySQL).
- `database/` — database connection bootstrap.
- `util/` — shared helpers (JWT, password hashing, responses, validation, logging).
- `log/` — runtime log files (created at startup).

---
## 2) Entry Point & Startup
**main.go**
1. Load environment variables with `godotenv.Load(".env", "../.env")`.
2. Initialize logger: `util.InitializeLogger()`.
3. Initialize DB: `database.InitDB(config.GetPrimaryMySQLDBConfig())`.
4. Build app graph: `app.InitApp()` returns controllers.
5. Setup router: `route.SetupRouter(...)`.
6. Start server on `APP_PORT` (default `8080`): `r.Run(":" + port)`.

**Database init** (`database/mysql_connection.go`)
```go
dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", ...)
db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
DB = db
```

**Environment variables** (`config/mysql_config.go`)
- Reads `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` with defaults.
- `JWT_SECRET` read in `util/jwt_util.go`.
- `APP_PORT` read in `main.go`.

---
## 3) API Creation Flow (Layer by Layer)
### Model Layer (`model/`)
- A model is a Go struct with `gorm` tags mapping to a DB table.
- Example `model/lead.go`:
```go
type Lead struct {
    ID int `gorm:"primaryKey;autoIncrement"`
    LeadUUID string `gorm:"column:lead_uuid"`
    Name string `gorm:"column:name"`
    // ...
}
func (Lead) TableName() string { return "leads" }
```

### Repository/Service Layer
- **Repository**: Executes DB queries, returns models or DTOs. Example `repository/lead_repository.go` uses `database.DB`.
- **Service**: Holds business rules, validation, and model ↔ DTO mapping. Example `service/lead_service.go`:
  - Validates DTOs (`util.ValidateStruct`).
  - Creates models, calls repository, builds response DTOs.
  - Adds activities/follow-ups.
- Separation: Controllers never touch DB; repositories never know HTTP.

### Controller Layer (`controller/`)
- Receives Gin context, decodes JSON: `json.NewDecoder(c.Request.Body).Decode(&req)`.
- Validates: `util.ValidateStruct(req)`.
- Calls service; handles errors; returns standardized response via `util.SuccessResponse`, etc.

### Routes (`route/routes.go`)
- Registers endpoints on Gin router.
- Public routes: `/health-check`, `/user/register`, `/user/login`.
- Auth group with `middleware.TokenAuthentication()` for `/user/*` (list, details, update) and `/lead/*` (create, list, details, comments, followups, activities).

### Middleware (`middleware/auth_middleware.go`)
- JWT check: expects `Authorization: Bearer <token>`.
- Validates token via `util.ValidateToken`.
- Injects `auth_user_id` and `user_type` headers into the request for downstream use.
- (Role-based checks can build on `user_type`.)

---
## 4) Full Flow Example — Create Lead
Path: `POST /lead/create`

1. **Route** (`route/routes.go`): in `/lead` group protected by `TokenAuthentication`.
2. **Middleware**: validates JWT, sets `auth_user_id`, `user_type`.
3. **Controller** (`controller/lead_controller.go` → `Create`):
   - Decode `dto.LeadCreateRequest`.
   - `ValidateStruct` on DTO.
   - Call `LeadService.Create(req, userID)`.
4. **Service** (`service/lead_service.go` → `Create`):
   - Build `model.Lead` with defaults (`LeadStatus: "pending"`).
   - `repo.Create` saves lead.
   - Generate unique lead ID (`generateUniqueLeadID`).
   - `repo.Update` to persist generated ID.
   - Add activity log (`repo.AddActivity`).
   - Return `dto.LeadDetailsResponse`.
5. **Repository** (`repository/lead_repository.go`):
   - `Create` inserts lead (auto UUID if empty).
   - `Update` persists unique ID.
6. **DB**: MySQL via GORM.
7. **Response**: `util.SuccessResponse` → JSON with message and body (lead details).

Sequence summary: Request → Route → JWT middleware → Controller → Service → Repository → DB → Response.

---
## 5) Advanced Concepts in This Repo
- **Pagination**: DTOs carry `page`/`limit`; offset = `(page-1)*limit`; repositories use `Offset(...).Limit(...)`. Counts: `total` (unfiltered), `filtered` after filters.
- **Filtering**: Search with `LIKE`; status filter on leads; extend by adding fields to DTO and repository queries.
- **File upload**: Not implemented yet; see guidance in `BACKEND_ARCHITECTURE_GUIDE.md` Section 6 for S3 pattern.
- **Error handling**: Standardized via `util.ResponseBody` helpers (`SuccessResponse`, `ValidationResponse`, etc.). Consider future `AppError` wrapper.
- **Response standardization**: Always use `util.ResponseBody` with `message`, `Status_code`, optional `body`.

---
## 6) How to Create a New API (Step-by-Step)
1. **Model**: Add struct in `model/`, include `gorm` tags and `TableName()` if needed.
2. **DTO**: Define request/response structs in `dto/` with `json` and `validate` tags.
3. **Repository**: Add interface + struct in `repository/`; implement CRUD with `database.DB`.
4. **Service**: Add interface + struct in `service/`; validate DTOs; call repository; map models to DTOs.
5. **Controller**: Add handler in `controller/`; decode request, validate, call service, return `util` response.
6. **Route**: Register in `route/routes.go`; place under auth group if protected.
7. **Middleware (optional)**: Add or reuse for auth/roles/logging.
8. **Pagination/Filters**: Add fields to DTO; apply in repository with `Offset/Limit` and conditional `Where`.
9. **Tests (recommended)**: Unit-test services and repositories where feasible.

**Naming conventions**
- Files: `thing_service.go`, `thing_repository.go`, `thing_controller.go`, `thing_dto.go`, `thing.go` (model).
- Interfaces exported (`ThingService`), concrete structs unexported (`thingService`).
- DTO suffixes: `Request`, `Response`, `ListRequest`, etc.

**Checklist (quick)**
- Model struct + `TableName`.
- DTOs with `json` + `validate` tags.
- Repository methods for needed queries.
- Service methods with validation + mapping.
- Controller handler with decode → validate → service → `util.SuccessResponse`.
- Route added (with middleware if needed).
- Pagination/filters applied and counted.
- Env/config touched? document defaults.
- Response fields consistent (`message`, `Status_code`, `body` keys like `data/totalCount/filterCount`).
- Add logging where helpful.

---
## 7) Where to Look in Code
- Router: `route/routes.go`
- Controllers: `controller/user_controller.go`, `controller/lead_controller.go`
- Services: `service/user_service.go`, `service/lead_service.go`
- Repositories: `repository/user_repository.go`, `repository/lead_repository.go`
- Models: `model/*.go`
- DTOs: `dto/*.go`
- Middleware: `middleware/auth_middleware.go`
- Responses: `util/response_util.go`
- Auth/JWT: `util/jwt_util.go`
- Validation: `util/validator_util.go`
- DB config/conn: `config/mysql_config.go`, `database/mysql_connection.go`

Use this as your learning path: start at `main.go`, follow the flow through routes → controllers → services → repositories → models → DB, then practice by adding a small CRUD API using the checklist above.
