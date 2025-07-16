# Math Evaluate - Thay thế cho mathjs

File này chứa các hàm đánh giá biểu thức toán học đơn giản để thay thế cho thư viện `mathjs`, giúp giảm kích thước bundle của ứng dụng.

## Các hàm có sẵn

### 1. `evaluate(expression: string, scope?: Record<string, number>): number`

Hàm đánh giá biểu thức toán học phức tạp với hỗ trợ:
- Các phép toán cơ bản: `+`, `-`, `*`, `/`, `()` 
- Lũy thừa: `^` (được chuyển thành `Math.pow`)
- Hàm toán học: `sqrt()`, `sin()`, `cos()`, `tan()`, `log()`, `ln()`
- Hằng số: `pi`, `e`
- Biến từ scope

#### Ví dụ sử dụng:

```typescript
import { evaluate } from './math-evaluate';

// Phép toán cơ bản
const result1 = evaluate('2 + 3 * 4'); // 14
const result2 = evaluate('(2 + 3) * 4'); // 20

// Hàm toán học
const result3 = evaluate('sqrt(16)'); // 4
const result4 = evaluate('sqrt(3^2 + 4^2)'); // 5

// Với biến
const result5 = evaluate('a * b + c', { a: 5, b: 2, c: 3 }); // 13
const result6 = evaluate('x^2 + y^2', { x: 3, y: 4 }); // 25

// Hằng số
const result7 = evaluate('pi'); // 3.141592653589793
const result8 = evaluate('e'); // 2.718281828459045
```

### 2. `evaluateSimple(expression: string): number`

Hàm đánh giá biểu thức đơn giản và an toàn hơn, chỉ hỗ trợ:
- Các phép toán cơ bản: `+`, `-`, `*`, `/`, `()`
- Số thập phân
- Trả về `0` nếu biểu thức không hợp lệ

#### Ví dụ sử dụng:

```typescript
import { evaluateSimple } from './math-evaluate';

// Phép toán cơ bản
const result1 = evaluateSimple('2 + 3 * 4'); // 14
const result2 = evaluateSimple('(10 + 5) / 3'); // 5
const result3 = evaluateSimple('100 - 25 * 2'); // 50

// Biểu thức không hợp lệ
const result4 = evaluateSimple('abc'); // 0
const result5 = evaluateSimple(''); // 0
const result6 = evaluateSimple('2 + abc'); // 0 (sau khi loại bỏ ký tự không hợp lệ)
```

## So sánh với mathjs

| Tính năng | mathjs | math-evaluate |
|-----------|--------|---------------|
| Kích thước bundle | ~500KB | ~2KB |
| Phép toán cơ bản | ✅ | ✅ |
| Hàm toán học | ✅ | ✅ (giới hạn) |
| Biến/Scope | ✅ | ✅ |
| Ma trận | ✅ | ❌ |
| Đơn vị đo lường | ✅ | ❌ |
| Số phức | ✅ | ❌ |
| Bảo mật | ⚠️ | ✅ (kiểm tra nghiêm ngặt) |

## Bảo mật

Các hàm này được thiết kế với tính bảo mật cao:
- Kiểm tra nghiêm ngặt các ký tự đầu vào
- Chỉ cho phép các phép toán và hàm an toàn
- Không cho phép thực thi code JavaScript tùy ý
- Kiểm tra cân bằng dấu ngoặc

## Khi nào nên sử dụng

### Sử dụng `evaluate()` khi:
- Cần đánh giá biểu thức phức tạp với hàm toán học
- Cần hỗ trợ biến từ scope
- Tin tưởng nguồn dữ liệu đầu vào

### Sử dụng `evaluateSimple()` khi:
- Chỉ cần phép toán cơ bản
- Dữ liệu đầu vào từ người dùng (không tin tưởng)
- Cần tính toán số lượng trong form
- Ưu tiên tính an toàn

## Thay thế mathjs trong code cũ

```typescript
// Trước đây
import * as math from 'mathjs';
const result = math.evaluate(expression);

// Bây giờ
import { evaluate } from './math-evaluate';
const result = evaluate(expression);
```

## Lưu ý

1. Hàm `evaluate()` sử dụng `Function()` constructor nên cần cẩn thận với dữ liệu đầu vào
2. Hàm `evaluateSimple()` an toàn hơn và được khuyến nghị cho dữ liệu từ người dùng
3. Không hỗ trợ tất cả tính năng của mathjs, chỉ các tính năng cơ bản nhất
4. Hiệu suất tốt hơn mathjs cho các phép toán đơn giản