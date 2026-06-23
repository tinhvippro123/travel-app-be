# Travel App — Backend Project Rules

> Quy tắc riêng cho dự án Travel App Backend.
> Đọc kèm với `AGENTS.md` (NestJS Best Practices chung).
> Khi có xung đột giữa 2 file, ưu tiên file này.

---

## 1. Kiến trúc dự án

### 1.1 Cấu trúc 3 Layer

```
src/
├── common/           # Shared utilities, base classes, DTOs dùng chung
├── infrastructure/   # Config & kết nối dịch vụ bên ngoài
└── modules/          # Feature modules (domain-driven)
```

**Quy tắc:**
- Feature modules **KHÔNG ĐƯỢC** import trực tiếp thư viện bên ngoài (cloudinary, nodemailer, ioredis...)
- Phải dùng qua wrapper trong `infrastructure/`
- Ví dụ: Cần upload ảnh → inject `CloudinaryService` từ `infrastructure/cloudinary/`, **KHÔNG** import `cloudinary` trực tiếp

### 1.2 Cấu trúc Feature Module (BẮT BUỘC)

Mỗi feature module **PHẢI** có đủ các thư mục sau:

```
modules/<tên-module>/
├── entities/                          # TypeORM entity
│   └── <tên>.entity.ts               # extends AbstractEntity
├── dto/                               # Input validation
│   ├── create-<tên>.dto.ts            # class-validator decorators
│   └── update-<tên>.dto.ts
├── interfaces/                        # Abstract classes cho DI
│   ├── <tên>-repository.interface.ts  # extends IBaseRepository<Entity>
│   └── <tên>-service.interface.ts     # extends IBaseService<Entity, CreateDto, UpdateDto>
├── repositories/                      # Concrete repository
│   └── <tên>.repository.ts           # implements I<Tên>Repository
├── services/                          # Concrete service
│   └── <tên>.service.ts              # implements I<Tên>Service
├── controllers/                       # REST endpoints
│   └── <tên>.controller.ts
└── <tên>.module.ts                    # DI mapping
```

**KHÔNG ĐƯỢC** bỏ qua bất kỳ thư mục nào, kể cả khi module đơn giản.

---

## 2. Interface Pattern — Abstract Class

### 2.1 Tại sao dùng Abstract Class thay vì Interface?

TypeScript `interface` bị **xóa ở runtime** → NestJS DI không thể resolve. Dùng `abstract class` để:
- Tồn tại ở runtime → dùng làm DI token
- Không cần `@Inject()` decorator
- Constructor injection tự động resolve

### 2.2 Cách tạo Interface

```typescript
// ✅ ĐÚNG — Abstract class, extends base
export abstract class IUserRepository extends IBaseRepository<User> {
  abstract findByEmail(email: string): Promise<User | null>;
}

// ❌ SAI — TypeScript interface
export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
```

### 2.3 DI Mapping trong Module

```typescript
@Module({
  providers: [
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IUserService, useClass: UserService },
  ],
  exports: [IUserService, IUserRepository],
})
```

### 2.4 Inject trong Service/Controller

```typescript
// ✅ ĐÚNG — Inject abstract class
constructor(private readonly userRepository: IUserRepository) {}

// ❌ SAI — Inject concrete class trực tiếp
constructor(private readonly userRepository: UserRepository) {}
```

---

## 3. Entity Rules

### 3.1 Mọi Entity PHẢI extends AbstractEntity

```typescript
import { AbstractEntity } from '../../../common/entities/base.entity.js';

@Entity('tên_bảng')
export class TenEntity extends AbstractEntity {
  // fields...
}
```

`AbstractEntity` tự động cung cấp:
- `id` — UUID auto-generate
- `createdAt` — auto timestamp
- `updatedAt` — auto timestamp
- `deletedAt` — soft delete

### 3.2 Column Naming

- DB column: `snake_case` — `full_name`, `created_at`
- TypeScript property: `camelCase` — `fullName`, `createdAt`
- Dùng `@Column({ name: 'snake_case' })` khi tên khác nhau

### 3.3 Soft Delete mặc định

- Dùng `softDelete()` thay vì `delete()` trong mọi trường hợp
- Chỉ dùng `hardDelete()` khi thực sự cần xóa vĩnh viễn

### 3.4 Password field

- Luôn dùng `@Column({ select: false })` cho password
- Khi cần password (login), dùng QueryBuilder với `.addSelect('user.password')`

---

## 4. DTO Rules

### 4.1 Mọi DTO PHẢI có class-validator decorators

```typescript
// ✅ ĐÚNG
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// ❌ SAI — Không có validation
export class CreateUserDto {
  email: string;
  password: string;
}
```

### 4.2 UpdateDto — Tất cả fields optional

```typescript
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;
}
```

---

## 5. Service Rules

### 5.1 Throw HttpException từ Service

```typescript
// ✅ ĐÚNG — Service throw exception
async findById(id: string): Promise<User> {
  const user = await this.userRepository.findById(id);
  if (!user) {
    throw new NotFoundException(`User with id "${id}" not found`);
  }
  return user;
}

// ❌ SAI — Return null rồi check ở controller
async findById(id: string): Promise<User | null> {
  return this.userRepository.findById(id);
}
```

### 5.2 Kiểm tra trước khi update/delete

```typescript
async update(id: string, dto: UpdateDto): Promise<Entity> {
  await this.findById(id); // Throw NotFoundException nếu không tìm thấy
  return this.repository.update(id, dto);
}
```

### 5.3 Business Logic trong Service, Query Logic trong Repository

- **Service**: validation, business rules, orchestration
- **Repository**: database queries, TypeORM operations

---

## 6. Controller Rules

### 6.1 Controller phải mỏng (thin controller)

Controller chỉ:
- Nhận request
- Gọi service
- Return response

**KHÔNG** viết business logic trong controller.

### 6.2 UUID Param Validation

```typescript
@Get(':id')
findById(@Param('id', ParseUUIDPipe) id: string) {
  return this.service.findById(id);
}
```

### 6.3 API Prefix

Tất cả endpoint bắt đầu bằng `/api/v1/` (đã config global trong `main.ts`).

---

## 7. Cross-Module Communication

### 7.1 Import Module, không import Service trực tiếp

```typescript
// ✅ ĐÚNG — Import module
@Module({
  imports: [TourModule],  // TourModule exports ITourService
})
export class BookingModule {}

// ❌ SAI — Import service trực tiếp
@Module({
  providers: [TourService],  // Tạo instance mới, không phải singleton
})
```

### 7.2 Export Interface, không export Concrete

```typescript
// ✅ ĐÚNG
exports: [IUserService, IUserRepository]

// ❌ SAI
exports: [UserService, UserRepository]
```

---

## 8. Infrastructure Rules

### 8.1 Config phải validate bằng Joi

Mọi env variable mới **PHẢI** thêm vào:
1. `infrastructure/config/config.validation.ts` — Joi schema
2. `.env.example` — template

### 8.2 Thêm service bên ngoài

Khi cần tích hợp service mới (ví dụ: Firebase, Stripe):

```
infrastructure/<tên-service>/
├── <tên>.module.ts      # Module + provider
├── <tên>.provider.ts    # Factory config từ ConfigService
└── <tên>.service.ts     # Wrapper service
```

---

## 9. Response Format

### 9.1 Success Response (tự động bởi TransformInterceptor)

```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

### 9.2 Error Response (tự động bởi HttpExceptionFilter)

```json
{
  "success": false,
  "statusCode": 404,
  "message": "User with id \"xxx\" not found",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "path": "/api/v1/users/xxx"
}
```

---

## 10. Naming Conventions

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| File | `kebab-case` | `create-user.dto.ts` |
| Class | `PascalCase` | `UserService` |
| Interface/Abstract | `I` + `PascalCase` | `IUserRepository` |
| Method | `camelCase` | `findById()` |
| Variable | `camelCase` | `totalPrice` |
| Constant | `UPPER_SNAKE_CASE` | `CLOUDINARY` |
| Enum | `PascalCase` | `UserRole.ADMIN` |
| DB Column | `snake_case` | `created_at` |
| DB Table | `snake_case`, số nhiều | `users`, `bookings` |
| API Endpoint | `kebab-case`, số nhiều | `/api/v1/tours` |
| Branch | `<type>/<tên>` | `feature/tour-search` |
| Commit | Conventional Commits | `feat(tour): add search` |

---

## 11. Import Path

NestJS v11 dùng `"module": "nodenext"` → **PHẢI** có `.js` extension trong import:

```typescript
// ✅ ĐÚNG
import { User } from '../entities/user.entity.js';
import { IUserRepository } from '../interfaces/user-repository.interface.js';

// ❌ SAI
import { User } from '../entities/user.entity';
```

---

## 12. Git Rules

### Commit Message

```
<type>(<scope>): <mô tả ngắn>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`
Scopes: `user`, `auth`, `tour`, `booking`, `common`, `infra`, `config`

### Branch

```
feature/<tên>    # Tính năng mới
fix/<tên>        # Sửa bug
hotfix/<tên>     # Fix khẩn cấp production
```

### Flow

```
main ← develop ← feature/xxx
```

---

## 13. Modules hiện có

| Module | Entity | Quan hệ | Chức năng |
|--------|--------|---------|-----------|
| `user` | User | — | CRUD users, profile |
| `auth` | — | UserModule | Login, Register, JWT |
| `tour` | Tour | — | CRUD tours, search |
| `booking` | Booking | User, Tour (ManyToOne) | CRUD bookings, tính giá |

### Khi thêm module mới:

1. Tạo đủ cấu trúc folder (mục 1.2)
2. Entity extends `AbstractEntity`
3. Interface extends `IBaseRepository` / `IBaseService`
4. DI mapping trong module
5. Import module vào `app.module.ts`
6. Commit: `feat(<module>): init <module> module`
