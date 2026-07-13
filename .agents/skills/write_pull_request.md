# Skill: Write Pull Request

## Goal
Tự động phân tích các thay đổi trong nhánh hiện tại so với nhánh `develop` và tạo ra mô tả cho Pull Request (PR) theo đúng chuẩn mực.

## Instructions
Khi được gọi, hãy thực hiện các bước sau:
1. Chạy lệnh git để lấy diff so với nhánh `develop`: `git diff develop...HEAD` (hoặc `git log develop..HEAD` kèm theo danh sách file thay đổi).
2. Phân tích các nội dung thay đổi, xác định các màn hình/tính năng mới (Presentation), logic (BLoC/Cubit), repository/api (Data), Dependencies, Injection, Tests...
3. Viết nội dung Pull Request bám sát format mẫu bên dưới. Toàn bộ nội dung đầu ra bắt buộc phải được đặt gọn trong một khối code markdown (```markdown ... ```) để người dùng dễ dàng copy.

## Template Bắt Buộc

Nội dung PR trả về phải tuân theo cấu trúc sau:

```markdown
Title: [Tên của Pull Request ngắn gọn, ví dụ: feat: Implement Admin Places management]

## Summary

[Tóm tắt ngắn gọn các thay đổi chính, mục đích của PR, và các tính năng mới được implement].

## Changes

### [Tên Nhóm 1] (Ví dụ: Admin Places — Presentation)
- [Thay đổi 1]
- [Thay đổi 2]

### [Tên Nhóm 2] (Ví dụ: Admin Places — BLoC)
- [Thay đổi 1]
- [Thay đổi 2]

### [Tên Nhóm 3] (Ví dụ: Places Repository)
- [Thay đổi 1]
- [Thay đổi 2]

## Dependencies (Nếu có thay đổi/thêm mới package)
- Added/Updated [Tên package]

## New Application Files
| File | Description |
|---|---|
| [Đường dẫn file] | [Mô tả file] |

## Modified Application Files
| File | Change |
|---|---|
| [Đường dẫn file] | [Mô tả thay đổi] |

## Tests Added and Updated
| Test File | Coverage |
|---|---|
| [Đường dẫn file test] | [Tính năng được test] |
```

## Example Output Cần Hướng Tới
(Hãy tham khảo mẫu này để cung cấp các kiểu nội dung)

Title: feat: Implement Admin Places management

## Summary
Implement the Admin Places management flow and integrate it into the existing Admin Portal.

## Changes

### Admin Places — Presentation
- Added `/admin/places` route.
- Added `AdminPlacesPage` for listing and managing places.

## Dependencies
- Added `flutter_quill`

## New Application Files
| File | Description |
|---|---|
| `lib/features/admin/admin_dependency_registrar.dart` | Registers admin feature dependencies |

## Modified Application Files
| File | Change |
|---|---|
| `lib/app/router.dart` | Adds `/admin/places` route |

## Tests Added and Updated
| Test File | Coverage |
|---|---|
| `test/features/admin/presentation/bloc/admin_places_bloc_test.dart` | Loading places, adding places, and toggling status |
