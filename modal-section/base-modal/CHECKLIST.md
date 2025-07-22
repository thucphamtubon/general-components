# BaseModal Checklist - Kiểm tra Chức năng

## 📋 Tổng quan
Checklist này giúp đảm bảo tất cả chức năng của BaseModal hoạt động đúng theo thiết kế và yêu cầu.

---

## 🔥 CẤP ĐỘ 1: CHỨC NĂNG CƠ BẢN (CRITICAL)

### ✅ Hiển thị Modal
- [ ] Modal hiển thị đúng khi `open={true}`
- [ ] Modal ẩn đúng khi `open={false}`
- [ ] Title hiển thị đúng nội dung
- [ ] Children content render đúng
- [ ] Modal có đúng kích thước mặc định (800px width)

### ✅ Chức năng Đóng Modal
- [ ] Nút X (close button) hoạt động đúng
- [ ] Callback `onCancel` được gọi khi đóng modal
- [ ] Nhấn ESC để đóng modal (nếu `keyboard={true}`)
- [ ] Click outside để đóng modal (nếu `maskClosable={true}`)

### ✅ Chức năng Kéo thả (Dragging)
- [ ] Modal có thể kéo thả khi `draggable={true}`
- [ ] Cursor thay đổi thành "move" khi hover vào title bar
- [ ] Modal di chuyển theo chuột khi kéo
- [ ] Modal không di chuyển ra ngoài viewport
- [ ] Vị trí modal được lưu sau khi kéo thả
- [ ] Modal khôi phục vị trí đã lưu khi mở lại

### ✅ Quản lý Vị trí (Position Management)
- [ ] Modal hiển thị ở vị trí trung tâm lần đầu tiên
- [ ] Vị trí được lưu vào localStorage với đúng modalId
- [ ] Vị trí được khôi phục chính xác khi mở lại
- [ ] Reset position hoạt động đúng
- [ ] Vị trí hợp lệ trong viewport

---

## 🚀 CẤP ĐỘ 2: CHỨC NĂNG NÂNG CAO (IMPORTANT)

### ✅ Trạng thái Loading
- [ ] Loading overlay hiển thị khi `loading={true}`
- [ ] Spinner animation hoạt động mượt mà
- [ ] Modal content bị disable khi loading
- [ ] Loading text hiển thị đúng (nếu có)

### ✅ Hệ thống Hướng dẫn (Guidance)
- [ ] Toggle guidance button hiển thị đúng
- [ ] Icon guidance thay đổi khi toggle
- [ ] Guidance content hiển thị/ẩn đúng
- [ ] Trạng thái guidance được lưu vào store
- [ ] Guidance responsive trên mobile

### ✅ Chỉ báo Thay đổi chưa lưu (Unsaved Changes)
- [ ] Indicator hiển thị khi `hasUnsavedChanges={true}`
- [ ] Icon và text hiển thị đúng
- [ ] Màu sắc warning hiển thị chính xác
- [ ] Animation pulse hoạt động

### ✅ Footer tùy chỉnh
- [ ] Default footer hiển thị đúng (Cancel, OK)
- [ ] Custom footer render đúng khi truyền `footer`
- [ ] Footer buttons hoạt động đúng
- [ ] Footer responsive

### ✅ Keyboard Navigation
- [ ] Tab navigation hoạt động trong modal
- [ ] Focus trap hoạt động đúng
- [ ] ESC key đóng modal
- [ ] Enter key submit form (nếu có)

---

## 🎨 CẤP ĐỘ 3: UI/UX & STYLING (MEDIUM)

### ✅ Responsive Design
- [ ] Modal responsive trên desktop (>= 1200px)
- [ ] Modal responsive trên tablet (768px - 1199px)
- [ ] Modal responsive trên mobile (< 768px)
- [ ] Width tự động điều chỉnh theo screen size
- [ ] Dragging bị disable trên mobile

### ✅ Dark Mode Support
- [ ] Modal hiển thị đúng trong dark mode
- [ ] Colors contrast đủ trong dark mode
- [ ] Icons hiển thị rõ ràng trong dark mode
- [ ] Borders và shadows phù hợp

### ✅ Animations & Transitions
- [ ] Modal fade in/out animation mượt mà
- [ ] Dragging animation không lag
- [ ] Hover effects hoạt động đúng
- [ ] Loading spinner animation mượt
- [ ] Icon rotation animation (guidance toggle)

### ✅ Visual States
- [ ] Hover states hiển thị đúng
- [ ] Active states hiển thị đúng
- [ ] Disabled states hiển thị đúng
- [ ] Focus states hiển thị rõ ràng
- [ ] Error states (nếu có) hiển thị đúng

---

## ♿ CẤP ĐỘ 4: ACCESSIBILITY (MEDIUM)

### ✅ ARIA Labels & Roles
- [ ] Modal có đúng `role="dialog"`
- [ ] `aria-labelledby` trỏ đến title
- [ ] `aria-describedby` trỏ đến content (nếu có)
- [ ] Buttons có đúng `aria-label`
- [ ] Loading state có `aria-live`

### ✅ Screen Reader Support
- [ ] Screen reader đọc được title
- [ ] Screen reader đọc được content
- [ ] Screen reader thông báo khi modal mở/đóng
- [ ] Screen reader thông báo trạng thái loading
- [ ] Screen reader thông báo unsaved changes

### ✅ Keyboard Accessibility
- [ ] Tất cả interactive elements có thể focus
- [ ] Tab order logic và intuitive
- [ ] Focus visible rõ ràng
- [ ] Không có keyboard trap ngoài modal
- [ ] Skip links hoạt động (nếu có)

### ✅ Color & Contrast
- [ ] Text contrast ratio >= 4.5:1
- [ ] Interactive elements contrast >= 3:1
- [ ] Color không phải là cách duy nhất truyền đạt thông tin
- [ ] High contrast mode support

---

## 🔧 CẤP ĐỘ 5: TECHNICAL & PERFORMANCE (LOW)

### ✅ Performance
- [ ] Modal render không gây lag
- [ ] Dragging performance mượt mà (60fps)
- [ ] Memory không leak khi unmount
- [ ] Event listeners được cleanup đúng
- [ ] Store state được cleanup khi cần

### ✅ Error Handling
- [ ] Modal handle được invalid props
- [ ] Graceful fallback khi localStorage không available
- [ ] Error boundaries hoạt động (nếu có)
- [ ] Console không có error/warning

### ✅ TypeScript Support
- [ ] All props có đúng types
- [ ] Generic types hoạt động đúng
- [ ] No TypeScript errors
- [ ] IntelliSense hoạt động đúng

### ✅ Browser Compatibility
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)

---

## 🧪 CẤP ĐỘ 6: TESTING & INTEGRATION (LOW)

### ✅ Unit Tests
- [ ] Component render tests
- [ ] Props validation tests
- [ ] Event handler tests
- [ ] Hook functionality tests
- [ ] Store state tests

### ✅ Integration Tests
- [ ] Modal với form integration
- [ ] Modal với table integration
- [ ] Multiple modals handling
- [ ] Modal với routing integration

### ✅ E2E Tests
- [ ] Complete user workflows
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance testing

---

## 📊 CHECKLIST SUMMARY

### Cấp độ ưu tiên kiểm tra:
1. **🔥 CẤP ĐỘ 1 (CRITICAL)**: Phải pass 100% - Chức năng cơ bản
2. **🚀 CẤP ĐỘ 2 (IMPORTANT)**: Nên pass >= 90% - Chức năng nâng cao
3. **🎨 CẤP ĐỘ 3 (MEDIUM)**: Nên pass >= 80% - UI/UX
4. **♿ CẤP ĐỘ 4 (MEDIUM)**: Nên pass >= 75% - Accessibility
5. **🔧 CẤP ĐỘ 5 (LOW)**: Nên pass >= 70% - Technical
6. **🧪 CẤP ĐỘ 6 (LOW)**: Nên pass >= 60% - Testing

### Ghi chú kiểm tra:
- ✅ = Pass
- ❌ = Fail
- ⚠️ = Partial/Needs improvement
- 🔄 = In progress
- ➖ = Not applicable

### Môi trường kiểm tra:
- [ ] Development environment
- [ ] Staging environment
- [ ] Production environment
- [ ] Mobile devices
- [ ] Different screen sizes
- [ ] Different browsers

---

## 🚨 CRITICAL ISSUES LOG

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| | | | |

---

## 📝 IMPROVEMENT SUGGESTIONS

| Suggestion | Priority | Effort | Impact |
|------------|----------|--------|--------|
| | | | |

---

**Ngày kiểm tra**: ___________  
**Người kiểm tra**: ___________  
**Version**: ___________  
**Kết quả tổng thể**: ___________