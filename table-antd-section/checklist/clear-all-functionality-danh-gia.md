# Checklist: Kiểm tra chức năng "Clear All" trong EnhancedTable

## Mục tiêu
Đảm bảo nút "Clear All" trong EnhancedTable hoạt động chính xác, reset tất cả các trạng thái bảng về mặc định khi người dùng click vào nút.

## Các trường hợp kiểm tra

### 1. Kiểm tra trạng thái hiển thị của nút Clear All
- [x] Nút "Clear All" hiển thị khi prop `onClearAll` được truyền vào TableSearchBar
- [x] Nút có tooltip hiển thị "Xóa tất cả bộ lọc, sắp xếp và tìm kiếm" khi hover
- [x] Nút có icon ClearOutlined đúng và rõ ràng
- [x] Nút có data-testid="clear-all-button" cho việc testing

### 2. Kiểm tra chức năng xóa bộ lọc (filters)
- [x] Khi click nút "Clear All", tất cả các filter trên các cột đều được reset
- [x] Trạng thái filters trong store (useTableFiltersAndSorterStore) được reset về {}
- [x] Các component filter UI (dropdown, checkbox, v.v.) được cập nhật để hiển thị trạng thái không filter
- [x] Callback onFilterChange (nếu có) được gọi với giá trị filters rỗng {}

### 3. Kiểm tra chức năng xóa sắp xếp (sorter)
- [x] Khi click nút "Clear All", tất cả các sorter trên các cột đều được reset
- [x] Trạng thái sorter trong store (useTableFiltersAndSorterStore) được reset về {}
- [x] Các icon sắp xếp trên header cột được cập nhật (không hiển thị icon sắp xếp)
- [x] Callback onSortChange (nếu có) được gọi với giá trị sorter rỗng {}

### 4. Kiểm tra chức năng xóa tìm kiếm (search)
- [x] Khi click nút "Clear All", text tìm kiếm trong input search được xóa (trở thành chuỗi rỗng)
- [x] Trạng thái searchTerm trong store (useTableSearchStore) được reset về ""
- [x] Callback onSearch (nếu có) được gọi với chuỗi rỗng
- [x] Kết quả tìm kiếm được cập nhật để hiển thị tất cả dữ liệu không bị lọc bởi search

### 5. Kiểm tra chức năng reset phân trang (pagination)
- [x] Khi click nút "Clear All", trang hiện tại được reset về trang 1
- [x] Kích thước trang (pageSize) được reset về giá trị mặc định
- [x] UI phân trang được cập nhật để hiển thị đang ở trang 1
- [x] Dữ liệu được hiển thị từ bản ghi đầu tiên của dataset

### 6. Kiểm tra chức năng xóa selection
- [x] Khi click nút "Clear All", tất cả các hàng được chọn đều bị bỏ chọn
- [x] Trạng thái selectedRowKeys được reset về []
- [x] Callback onSelectionChange (nếu có) được gọi với mảng rỗng []
- [x] UI checkbox trên các hàng được cập nhật để hiển thị trạng thái không chọn

### 7. Kiểm tra tích hợp với các loại dữ liệu khác nhau
- [x] Hoạt động chính xác với bảng có dữ liệu text
- [x] Hoạt động chính xác với bảng có dữ liệu số
- [x] Hoạt động chính xác với bảng có dữ liệu ngày tháng
- [x] Hoạt động chính xác với bảng có dữ liệu boolean (true/false)
- [x] Hoạt động chính xác với bảng có dữ liệu phức tạp (nested objects, arrays)

### 8. Kiểm tra tính nhất quán khi dữ liệu thay đổi
- [x] Chức năng vẫn hoạt động đúng khi dữ liệu source thay đổi sau khi đã áp dụng filters/sort/search
- [x] Sau khi clear all, dữ liệu mới được hiển thị chính xác mà không còn bị ảnh hưởng bởi các filter/sort/search trước đó

### 9. Kiểm tra lưu trữ trạng thái người dùng
- [x] Sau khi clear all, trạng thái trong local storage (nếu sử dụng saveUserPreferences=true) cũng được reset
- [x] Khi refresh trang sau khi đã clear all, bảng không khôi phục lại các filter/sort/search đã bị xóa

### 10. Kiểm tra tương tác với các thành phần khác
- [x] Các thành phần khác trên trang (nếu có tương tác với EnhancedTable) phản ứng đúng với việc reset dữ liệu
- [x] Các callback được gọi đúng thứ tự và với các giá trị đúng
- [x] Không xảy ra side effect ngoài ý muốn khi clear all

### 11. Kiểm tra hiệu suất
- [x] Thời gian phản hồi khi click Clear All phù hợp, không bị lag kể cả với bảng lớn
- [x] Không bị render lại không cần thiết các thành phần không liên quan

### 12. Kiểm tra trên các thiết bị và trình duyệt khác nhau
- [x] Nút hiển thị và hoạt động đúng trên màn hình desktop
- [x] Nút hiển thị và hoạt động đúng trên màn hình tablet
- [x] Nút hiển thị và hoạt động đúng trên màn hình mobile
- [x] Hoạt động đúng trên các trình duyệt chính (Chrome, Firefox, Safari, Edge)

## Các lỗi tiềm ẩn cần chú ý
- [x] Trường hợp một số cột không hỗ trợ filter/sort
- [x] Trường hợp bảng không có dữ liệu
- [x] Trường hợp bảng có rất nhiều dữ liệu (>1000 hàng)
- [x] Xử lý đồng bộ/bất đồng bộ giữa các thao tác reset

## Quy trình kiểm tra
1. Thiết lập môi trường test với các trường hợp dữ liệu khác nhau
2. Áp dụng các filter, sort, search và chọn row
3. Click nút "Clear All"
4. Kiểm tra tất cả các trạng thái đã được reset về mặc định
5. Lặp lại với các kịch bản dữ liệu và UI khác nhau
