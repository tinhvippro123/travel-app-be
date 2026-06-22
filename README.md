# Travel App — Backend API (Mobile App)

Backend API cho **ứng dụng di động Travel App**, xây dựng bằng NestJS với kiến trúc **Multi-Module Clean Architecture**, sử dụng TypeScript.

> 📱 Backend này phục vụ cho mobile app (iOS/Android). Tất cả API trả về JSON chuẩn hoá cho client mobile consume.

## 🏗️ Cấu trúc folder

```
src/
├── main.ts                              # Bootstrap app (global pipes, filters, interceptors)
├── app.module.ts                        # Root module — import tất cả modules
│
├── common/                              # 📦 Shared — dùng chung cho tất cả modules
│   ├── entities/
│   │   └── base.entity.ts               # BaseEntity (id, createdAt, updatedAt, deletedAt)
│   ├── interfaces/
│   │   ├── base-repository.interface.ts # Abstract class IBaseRepository<T> (CRUD chung)
│   │   └── base-service.interface.ts    # Abstract class IBaseService<T> (CRUD chung)
│   ├── dto/
│   │   ├── pagination.dto.ts            # PaginationDto, PaginatedResultDto
│   │   └── api-response.dto.ts          # ApiResponseDto (chuẩn hoá response)
│   ├── enums/
│   │   └── index.ts                     # UserRole, BookingStatus, TourStatus
│   ├── filters/
│   │   └── http-exception.filter.ts     # Global exception filter
│   └── interceptors/
│       └── transform.interceptor.ts     # Auto-wrap response → { success, data, message }
│
├── infrastructure/                      # 🔧 Infrastructure — config dịch vụ bên ngoài
│   ├── config/
│   │   └── config.validation.ts         # Joi schema validate env variables
│   ├── database/
│   │   └── database.module.ts           # TypeORM + PostgreSQL config
│   ├── redis/
│   │   └── redis.module.ts              # Redis cache (placeholder)
│   ├── cloudinary/
│   │   ├── cloudinary.module.ts
│   │   ├── cloudinary.provider.ts       # Cloudinary SDK config
│   │   └── cloudinary.service.ts        # Upload / Delete file
│   └── mail/
│       ├── mail.module.ts
│       └── mail.service.ts              # Nodemailer wrapper
│
└── modules/                             # 🧩 Feature Modules — domain-driven
    ├── user/
    │   ├── entities/user.entity.ts      # User entity (extends BaseEntity)
    │   ├── dto/
    │   │   ├── create-user.dto.ts
    │   │   └── update-user.dto.ts
    │   ├── interfaces/
    │   │   ├── user-repository.interface.ts  # Abstract class IUserRepository
    │   │   └── user-service.interface.ts     # Abstract class IUserService
    │   ├── repositories/
    │   │   └── user.repository.ts       # Concrete impl → implements IUserRepository
    │   ├── services/
    │   │   └── user.service.ts          # Concrete impl → implements IUserService
    │   ├── controllers/
    │   │   └── user.controller.ts
    │   └── user.module.ts               # DI mapping: IUserRepository → UserRepository
    │
    ├── auth/
    │   ├── dto/                         # LoginDto, RegisterDto
    │   ├── strategies/jwt.strategy.ts   # Passport JWT strategy
    │   ├── guards/
    │   │   ├── jwt-auth.guard.ts        # JWT authentication guard
    │   │   └── roles.guard.ts           # Role-based authorization guard
    │   ├── decorators/
    │   │   ├── public.decorator.ts      # @Public() — bypass auth
    │   │   └── roles.decorator.ts       # @Roles(UserRole.ADMIN)
    │   ├── services/auth.service.ts
    │   ├── controllers/auth.controller.ts
    │   └── auth.module.ts
    │
    ├── tour/
    │   ├── entities/tour.entity.ts
    │   ├── dto/
    │   ├── interfaces/                  # ITourRepository, ITourService
    │   ├── repositories/
    │   ├── services/
    │   ├── controllers/
    │   └── tour.module.ts
    │
    └── booking/
        ├── entities/booking.entity.ts   # ManyToOne → User, Tour
        ├── dto/
        ├── interfaces/                  # IBookingRepository, IBookingService
        ├── repositories/
        ├── services/
        ├── controllers/
        └── booking.module.ts
```

## 🎯 Kiến trúc — Tại sao lại code như vậy?

### 1. Interface dùng Abstract Class (không phải `interface`)

TypeScript `interface` bị **xóa ở runtime**, nên NestJS DI không thể dùng nó làm token. Thay vào đó, dùng `abstract class`:

```typescript
// ❌ KHÔNG DÙNG — bị xóa ở runtime
export interface IUserRepository { ... }

// ✅ DÙNG CÁI NÀY — tồn tại ở runtime, dùng làm DI token
export abstract class IUserRepository extends IBaseRepository<User> {
  abstract findByEmail(email: string): Promise<User | null>;
}
```

### 2. DI Mapping trong Module

```typescript
// user.module.ts
@Module({
  providers: [
    { provide: IUserRepository, useClass: UserRepository },  // abstract → concrete
    { provide: IUserService, useClass: UserService },
  ],
})
```

**Lợi ích:**
- Dễ **swap implementation** (vd: đổi từ TypeORM sang Prisma chỉ cần đổi `useClass`)
- Dễ **mock trong unit test** (provide mock class thay concrete class)
- **Loosely coupled** — Service chỉ biết interface, không biết implementation

### 3. Shared Entity (BaseEntity)

Tất cả entity đều extends `BaseEntity` → tự động có:
- `id` (UUID)
- `createdAt`, `updatedAt` (auto timestamp)
- `deletedAt` (soft delete)

### 4. Infrastructure tách riêng

Các service bên ngoài (Database, Redis, Cloudinary, Mail) được gói trong `infrastructure/`:
- Feature modules **không import trực tiếp** thư viện bên ngoài
- Nếu cần đổi Cloudinary → AWS S3, chỉ sửa trong `infrastructure/cloudinary/`

## 🚀 Hướng dẫn chạy

### 1. Cài đặt
```bash
npm install
```

### 2. Tạo file `.env`
```bash
cp .env.example .env
# Sửa thông tin database, JWT secret, etc.
```

### 3. Chạy development
```bash
npm run start:dev
```

### 4. Build production
```bash
npm run build
npm run start:prod
```

## 📡 API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/api/v1/auth/register` | Đăng ký | ❌ |
| POST | `/api/v1/auth/login` | Đăng nhập | ❌ |
| GET | `/api/v1/auth/profile` | Xem profile | ✅ |
| GET | `/api/v1/users` | Danh sách users | ✅ |
| GET | `/api/v1/users/:id` | Chi tiết user | ✅ |
| GET | `/api/v1/tours` | Danh sách tours | ✅ |
| GET | `/api/v1/tours/search?destination=...` | Tìm tour | ✅ |
| POST | `/api/v1/tours` | Tạo tour | ✅ |
| GET | `/api/v1/bookings` | Danh sách booking | ✅ |
| POST | `/api/v1/bookings` | Tạo booking | ✅ |

## 🧩 Thêm module mới

Khi cần thêm module mới (ví dụ: `Review`), follow pattern sau:

```
src/modules/review/
├── entities/review.entity.ts          # extends BaseEntity
├── dto/
│   ├── create-review.dto.ts
│   └── update-review.dto.ts
├── interfaces/
│   ├── review-repository.interface.ts # extends IBaseRepository<Review>
│   └── review-service.interface.ts    # extends IBaseService<Review, ...>
├── repositories/
│   └── review.repository.ts          # implements IReviewRepository
├── services/
│   └── review.service.ts             # implements IReviewService
├── controllers/
│   └── review.controller.ts
└── review.module.ts                   # { provide: IReviewRepository, useClass: ReviewRepository }
```

Sau đó import `ReviewModule` vào `app.module.ts`.

## 🛠️ Tech Stack

- **Runtime:** Node.js + NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL + TypeORM
- **Auth:** JWT + Passport
- **Validation:** class-validator + class-transformer
- **Config:** @nestjs/config + Joi
- **Upload:** Cloudinary
- **Mail:** Nodemailer

---

## 📝 Quy tắc Commit (Conventional Commits)

Tất cả commit message **phải** tuân theo format [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <mô tả ngắn>

[body — giải thích chi tiết nếu cần]

[footer — breaking changes, issue references]
```

### Commit Types

| Type | Khi nào dùng | Ví dụ |
|------|-------------|-------|
| `feat` | Thêm tính năng mới | `feat(tour): add search by destination endpoint` |
| `fix` | Sửa bug | `fix(auth): fix JWT token expiration issue` |
| `docs` | Chỉ thay đổi documentation | `docs: update README with API endpoints` |
| `style` | Format code, không đổi logic (spaces, semicolons...) | `style(user): fix indentation in controller` |
| `refactor` | Tái cấu trúc code, không thêm feature hay fix bug | `refactor(booking): extract price calculation to helper` |
| `perf` | Cải thiện performance | `perf(tour): add database index on destination column` |
| `test` | Thêm/sửa test | `test(user): add unit tests for UserService` |
| `chore` | Thay đổi build, CI/CD, dependencies... | `chore: update TypeORM to v1.1.0` |
| `ci` | Thay đổi CI/CD config | `ci: add GitHub Actions workflow` |
| `build` | Thay đổi build system | `build: configure Docker multi-stage build` |
| `revert` | Revert commit trước | `revert: revert feat(tour): add search endpoint` |

### Scope (tuỳ chọn)

Dùng tên module hoặc layer:
- Module: `user`, `auth`, `tour`, `booking`
- Layer: `common`, `infra`, `config`
- Khác: `deps`, `docker`, `ci`

### Quy tắc

1. **Mô tả ngắn** viết bằng tiếng Anh, dạng mệnh lệnh (imperative): `add`, `fix`, `remove`... — **KHÔNG** viết `added`, `adding`, `fixes`
2. **Không viết hoa** chữ đầu mô tả
3. **Không** kết thúc bằng dấu chấm `.`
4. Giới hạn dòng đầu ≤ **72 ký tự**
5. Breaking changes **phải** có footer `BREAKING CHANGE:` hoặc `!` sau type

### Ví dụ commit

```bash
# Feature mới
git commit -m "feat(tour): add filter tours by price range"

# Fix bug
git commit -m "fix(booking): prevent duplicate booking for same tour"

# Refactor
git commit -m "refactor(common): rename BaseEntity to AbstractEntity"

# Breaking change
git commit -m "feat(auth)!: change JWT payload structure

BREAKING CHANGE: JWT payload now uses 'sub' instead of 'userId'.
All existing tokens will be invalidated."

# Chore
git commit -m "chore(deps): upgrade NestJS to v11.1.0"
```

---

## 🌿 Quy tắc Branch

### Branch naming

```
<type>/<mô-tả-ngắn>
```

| Branch | Mục đích |
|--------|----------|
| `main` | Production — luôn stable |
| `develop` | Development — merge feature vào đây |
| `feature/<tên>` | Tính năng mới | 
| `fix/<tên>` | Sửa bug |
| `hotfix/<tên>` | Fix khẩn cấp trên production |
| `refactor/<tên>` | Tái cấu trúc |
| `docs/<tên>` | Documentation |

### Ví dụ

```bash
git checkout -b feature/tour-search-filter
git checkout -b fix/booking-duplicate-check
git checkout -b hotfix/auth-token-expired
```

### Git Flow

```
main ← develop ← feature/xxx
                ← fix/xxx
main ← hotfix/xxx (khẩn cấp)
```

1. Tạo branch từ `develop`
2. Code xong → tạo Pull Request vào `develop`
3. Review + merge vào `develop`
4. Khi release → merge `develop` vào `main`

---

## 📐 Quy tắc Code (Coding Conventions)

### Naming Conventions

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| File | `kebab-case` | `create-user.dto.ts`, `user.service.ts` |
| Class | `PascalCase` | `UserService`, `CreateUserDto` |
| Interface/Abstract | `PascalCase` với prefix `I` | `IUserRepository`, `IBaseService` |
| Method / Function | `camelCase` | `findById()`, `createBooking()` |
| Variable | `camelCase` | `totalPrice`, `isActive` |
| Constant | `UPPER_SNAKE_CASE` | `JWT_SECRET`, `CLOUDINARY` |
| Enum | `PascalCase` (key: `UPPER_SNAKE_CASE`) | `UserRole.ADMIN` |
| DB Column | `snake_case` | `created_at`, `full_name` |
| API Endpoint | `kebab-case`, số nhiều | `/api/v1/tour-packages` |

### Cấu trúc Module (bắt buộc)

Mỗi feature module **phải** có đủ các thư mục:

```
modules/<tên-module>/
├── entities/          # TypeORM entity (extends AbstractEntity)
├── dto/               # Input validation (class-validator)
├── interfaces/        # Abstract class cho Repository + Service
├── repositories/      # Concrete repository (implements interface)
├── services/          # Concrete service (implements interface)
├── controllers/       # REST endpoints
└── <tên>.module.ts    # DI mapping: { provide: Interface, useClass: Concrete }
```

### Quy tắc chung

1. **Luôn dùng interface (abstract class)** — Controller inject `IUserService`, **KHÔNG** inject `UserService` trực tiếp
2. **Không import thư viện bên ngoài trong feature module** — Dùng qua `infrastructure/` layer
3. **Mọi entity phải extends `AbstractEntity`** — để có id, timestamps, soft delete
4. **Mọi DTO phải có class-validator decorators** — không bao giờ trust input từ client
5. **Không hardcode config** — Dùng `ConfigService` từ `@nestjs/config`
6. **Soft delete mặc định** — Chỉ dùng hard delete khi thực sự cần
7. **Response format chuẩn** — `{ success, data, message, timestamp }` (đã có TransformInterceptor)
8. **Error format chuẩn** — `{ success, statusCode, message, timestamp, path }` (đã có HttpExceptionFilter)
9. **Mỗi file chỉ export 1 class chính** — Không gộp nhiều class vào 1 file
10. **Comment bằng tiếng Việt hoặc tiếng Anh** — nhất quán trong cùng 1 file

### API Design Rules

1. **RESTful** — dùng đúng HTTP method (GET, POST, PUT, DELETE)
2. **Prefix** — tất cả endpoint bắt đầu bằng `/api/v1/`
3. **Số nhiều** — `/users`, `/tours`, `/bookings` (không phải `/user`)
4. **UUID params** — dùng `ParseUUIDPipe` validate param
5. **Status codes** — `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found
6. **Pagination** — dùng query params `?page=1&limit=10`
