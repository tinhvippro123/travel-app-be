---
name: nestjs-best-practices
description: >
  NestJS best practices customized for Travel App Backend (Mobile App).
  Use when writing, reviewing, or refactoring code to ensure proper patterns
  for multi-module architecture, abstract class DI, TypeORM repositories,
  JWT authentication, and infrastructure layer separation.
license: MIT
metadata:
  author: Kadajett (customized for Travel App)
  version: "1.1.0"
---

# NestJS Best Practices — Travel App Backend

Comprehensive best practices guide for the Travel App NestJS backend.
Contains 40 rules across 10 categories + project-specific rules.

## When to Apply

Reference these guidelines when:

- Writing new feature modules (follow the module structure in `PROJECT_RULES.md`)
- Creating entities, DTOs, repositories, services
- Implementing authentication and authorization (JWT + Guards)
- Reviewing code for architecture and security issues
- Refactoring existing modules
- Adding infrastructure services (Cloudinary, Mail, Redis...)
- Writing tests

## Project-Specific Rules

**Read `PROJECT_RULES.md` FIRST** — it contains Travel App-specific patterns:

- Abstract class DI pattern (`IBaseRepository<T>` → concrete)
- Feature module structure (entities, dto, interfaces, repositories, services, controllers)
- Entity rules (`AbstractEntity`, soft delete, UUID)
- Import path rules (`.js` extension for nodenext)
- Cross-module communication (import Module, export Interface)
- Infrastructure layer separation

## Rule Categories by Priority

| Priority | Category | Impact | Prefix | Đã áp dụng? |
|----------|----------|--------|--------|-------------|
| 1 | Architecture | CRITICAL | `arch-` | ✅ Feature modules, Repository pattern |
| 2 | Dependency Injection | CRITICAL | `di-` | ✅ Abstract class tokens, Constructor injection |
| 3 | Error Handling | HIGH | `error-` | ✅ HttpExceptionFilter, TransformInterceptor |
| 4 | Security | HIGH | `security-` | ✅ JWT, Guards, ValidationPipe |
| 5 | Performance | HIGH | `perf-` | ⏳ Caching (Redis placeholder) |
| 6 | Testing | MEDIUM-HIGH | `test-` | ⏳ Chưa implement |
| 7 | Database & ORM | MEDIUM-HIGH | `db-` | ⏳ Migrations chưa setup |
| 8 | API Design | MEDIUM | `api-` | ✅ DTOs, Interceptors, v1 prefix |
| 9 | Microservices | MEDIUM | `micro-` | ❌ Không áp dụng (monolith) |
| 10 | DevOps & Deployment | LOW-MEDIUM | `devops-` | ⏳ ConfigModule done, Logging chưa |

## Quick Reference — Áp dụng cho Travel App

### Critical (Đã implement ✅)

- `arch-feature-modules` → `modules/user/`, `modules/tour/`, `modules/booking/`
- `arch-use-repository-pattern` → `IBaseRepository<T>` → concrete repos
- `di-use-interfaces-tokens` → Abstract class tokens (không dùng TS interface)
- `di-prefer-constructor-injection` → Tất cả services dùng constructor injection
- `security-auth-jwt` → `AuthModule` + `JwtStrategy` + `JwtAuthGuard`
- `security-use-guards` → `JwtAuthGuard` + `RolesGuard` (global APP_GUARD)
- `security-validate-all-input` → `ValidationPipe` global + class-validator DTOs

### Cần implement tiếp ⏳

- `perf-use-caching` → Setup Redis cache cho tour listing
- `db-use-migrations` → TypeORM migration scripts
- `db-use-transactions` → Booking creation với transaction
- `test-use-testing-module` → Unit tests cho services
- `test-e2e-supertest` → E2E tests cho API
- `devops-use-logging` → Structured logging (Winston/Pino)
- `devops-graceful-shutdown` → Graceful shutdown trong main.ts
- `security-rate-limiting` → Throttler cho auth endpoints

### Không áp dụng ❌

- `micro-*` → Dự án là monolith, không dùng microservices
- `perf-lazy-loading` → App size chưa đủ lớn

## How to Use

1. Đọc `PROJECT_RULES.md` trước — quy tắc riêng dự án
2. Đọc rule files trong `rules/` khi cần chi tiết
3. Đọc `AGENTS.md` cho full compiled document

```
PROJECT_RULES.md              # ← ĐỌC TRƯỚC — quy tắc Travel App
AGENTS.md                     # Full 40 rules compiled
rules/arch-feature-modules.md # Rule riêng lẻ
rules/security-auth-jwt.md
rules/_sections.md
```
