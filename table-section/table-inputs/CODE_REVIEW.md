# Đánh giá thư mục `table-inputs`

*Thời gian đánh giá: 15/07/2025*

## 1. Tổng quan
Thư mục `table-inputs` định nghĩa tập hợp các component nhập liệu (text, number, select, date, textarea, switch) được thiết kế để tái sử dụng trong bảng. Kiến trúc tách biệt thành ba khối chính:

1. `components/` – Chứa các component React (sử dụng `forwardRef`).
2. `shared/` – Chứa `hooks`, `types`, `utils` dùng chung.
3. `styles/` – CSS dùng chung cho tất cả component.

Các dòng export tại `index.ts` giúp developer import tiện lợi từ duy nhất một entry point.

## 2. Điểm mạnh
- **TypeScript đầy đủ**: Các props, hook, util đều có kiểu rõ ràng → giảm bug & auto-complete tốt.
- **Tách biệt logic – UI**: Phần xử lý state/validation nằm trong hook `useTableInput`, giúp component gọn gàng.
- **Tái sử dụng cao**: Nhiều util (format/parse, debounce, throttle…) và hook (`useDebounce`, `useInputFocus`, `useInputValidation`).
- **Khả năng mở rộng**: Mỗi input có các biến thể `Default` và cho phép truyền formatter/parser tuỳ ý.
- **A11y cơ bản**: Có `aria-label`, `aria-invalid`, `role="alert"` cho thông báo lỗi.
- **Kiểm soát ref**: Dùng `forwardRef` + merge ref hợp lý.

## 3. Vấn đề & Cải tiến
| Mức | Mô tả |
|-----|-------|
|⚠️| **Bug logic điều kiện** trong `TableInputNumber.tsx` dòng 69: `if (allowMath && value.includes('+') || value.includes('-') || ...)` do thứ tự ưu tiên toán tử. Cần thêm ngoặc `if (allowMath && (value.includes('+') || value.includes('-') || ...))`.|
|⚠️| `evaluateMathExpression()` (trong `utils.ts`) khả năng sử dụng `eval` → rủi ro bảo mật & hiệu năng. Nên dùng parser math (ví dụ `mathjs`) hoặc tự viết parser an toàn. |
|⚠️| Thiếu test/unit test cho hook `useTableInput` và các util → khó đảm bảo ổn định khi refactor. |
|⚠️| CSS được import toàn cục (`table-inputs.css`) → có thể sinh xung đột class khi app lớn. Đề xuất dùng CSS Module hoặc CSS-in-JS. |
|⚠️| `data-row={row ? JSON.stringify(row) : undefined}` có thể gây rò rỉ dữ liệu lớn vào DOM & ảnh hưởng hiệu năng. Cân nhắc truyền id thay vì toàn bộ object. |
|⚠️| Không phát hiện kiểm soát focus vòng (`TabLoop`) cho accessibility nâng cao; có thể bổ sung. |
|ℹ️| Tên file `hooks.ts`, `utils.ts` khá dài; xem xét tách nhỏ hơn để dễ bảo trì. |
|👍| Đã clear timeout trong `useEffect` cleanup, tránh memory leak. |

## 4. Đề xuất hành động
1. Sửa ngay bug điều kiện `allowMath` (thêm ngoặc).
2. Thay thế `eval` bằng thư viện/thuật toán tính toán chuỗi an toàn.
3. Viết test (Jest + React Testing Library):
   - `useTableInput` – validate, debounce, formatter.
   - `TableInputNumber` – các edge-case (`allowMath`, min/max, step).
4. Chuyển CSS sang CSS Module hoặc thêm prefix để tránh xung đột.
5. Giảm dữ liệu gắn trên DOM (`data-row`). Chỉ nên truyền `rowKey`.
6. Xem xét tách hook lớn thành các hook nhỏ (`useFormatter`, `useValidation`).
7. Thêm storybook hoặc doc site nhỏ để demo component.
8. Bổ sung ESLint plugin `jsx-a11y` & CI để đảm bảo a11y.

## 5. Kết luận
Mã nguồn `table-inputs` được tổ chức tốt, dễ đọc, đáp ứng phần lớn nhu cầu nhập liệu trong bảng. Chỉ cần khắc phục một số vấn đề logic & bảo mật nhỏ, thêm test và cải thiện CSS/a11y là có thể dùng trong production ở quy mô lớn.
