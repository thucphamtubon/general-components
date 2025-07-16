# ConfirmModal - Hướng dẫn Implementation và Kiến trúc

## Tổng quan về ConfirmModal

ConfirmModal là một component modal xác nhận được thiết kế theo kiến trúc DRY (Don't Repeat Yourself) trong hệ thống CaterSoft. Component này cung cấp giao diện thống nhất cho các hành động cần xác nhận từ người dùng với hỗ trợ tiếng Việt mặc định.

## Mục đích và Tác dụng

### Chức năng chính
- **Modal Xác nhận**: Hiển thị hộp thoại yêu cầu người dùng xác nhận trước khi thực hiện hành động quan trọng
- **Hỗ trợ Async Operations**: Xử lý các thao tác bất đồng bộ với loading state
- **Error Handling**: Xử lý lỗi tự động với logging phù hợp
- **Vietnamese Localization**: Văn bản tiếng Việt mặc định phù hợp với người dùng Việt Nam

### Ứng dụng thực tế
- Xác nhận xóa dữ liệu quan trọng
- Xác nhận thay đổi cài đặt hệ thống
- Xác nhận thực hiện các giao dịch tài chính
- Xác nhận đăng xuất hoặc hủy thao tác

## Kiến trúc Implementation

### 1. Dual Usage Pattern (Mô hình Sử dụng Kép)

ConfirmModal được thiết kế với hai cách sử dụng distinct:

#### Component Usage (Controlled - Điều khiển bởi Component)
- Phù hợp cho các tình huống phức tạp cần quản lý state
- Tích hợp với Redux store hoặc local state management
- Cho phép kiểm soát fine-grained về lifecycle của modal
- Hỗ trợ conditional rendering dựa trên business logic

#### Static Method Usage (Uncontrolled - Phương thức Tĩnh)
- Phù hợp cho quick confirmations đơn giản
- Không cần quản lý visibility state
- Tạo và hiển thị modal ngay lập tức
- Tự động cleanup khi đóng modal

### 2. Shared Utilities Integration

ConfirmModal tận dụng hệ thống utilities được chia sẻ:

#### showConfirmModal Utility
- Function trung tâm để tạo Ant Design Modal.confirm
- Xử lý configuration chung cho tất cả confirm modals
- Đảm bảo consistent behavior across application

#### defaultTexts System
- Centralized text management cho Vietnamese localization
- Cho phép customization nhưng vẫn giữ defaults phù hợp
- Tách biệt presentation text khỏi component logic

#### Error Handling
- Automatic error logging với context information
- Differentiation giữa validation errors và system errors
- Graceful error recovery không làm crash application

### 3. TypeScript Integration

#### Interface Design
- IConfirmModalProps extends IContentModalProps để tái sử dụng common props
- Strict typing cho onOk callback với support cho async operations
- Generic interface IModalComponent cho static method pattern

#### Type Safety
- Compile-time validation của props
- IntelliSense support cho better developer experience
- Consistent interface across toàn bộ modal library

## Implementation Architecture

### 1. Component Structure

ConfirmModal được implement như một React Functional Component với attached static method:

#### Core Implementation Pattern
- Component nhận props và render conditional dựa trên visible state
- Khi visible = true, gọi showConfirmModal utility
- Component bản thân không render DOM elements trực tiếp
- Return null để avoid DOM pollution

#### Static Method Attachment
- show method được attach như property của component function
- Sử dụng same underlying showConfirmModal utility
- Provides clean API cho quick usage scenarios

### 2. State Management

#### Stateless Design
- Component không maintain internal state
- All state management delegated to parent components
- This enables better integration với complex state management systems

#### Event Handling
- onOk callback support both synchronous và asynchronous operations
- Automatic error catching và logging
- Loading state management during async operations

### 3. Integration với Ant Design

#### Modal.confirm Usage
- Built on top của Ant Design's Modal.confirm method
- Inherits all Ant Design styling và behavior
- Extends với custom error handling và Vietnamese localization

#### Consistent Styling
- Follows Ant Design design system
- Responsive behavior inherited từ base Modal component
- Theme integration với CaterSoft's design tokens

## Shared Utilities và Dependencies

### 1. showConfirmModal Function
- Centralized factory function cho creating confirm modals
- Handles common configuration setup
- Provides consistent error handling wrapper
- Manages loading state và button props

### 2. defaultTexts System
- Vietnamese text constants cho common actions
- Fallback values cho undefined props
- Centralized localization management
- Easy customization cho specific use cases

### 3. handleModalError Utility
- Consistent error logging across all modals
- Context-aware error messages
- Differentiation giữa user errors và system errors
- Integration với application logging system

## Benefits của Architecture

### 1. Code Reusability
- Single component serves multiple use cases
- Shared utilities reduce duplication across modal types
- Consistent behavior pattern across application

### 2. Maintainability
- Centralized error handling reduces maintenance burden
- Shared utilities có single source of truth
- TypeScript interfaces ensure API consistency

### 3. Developer Experience
- Clear API với both simple và advanced usage patterns
- Comprehensive TypeScript support
- Vietnamese defaults reduce localization overhead

### 4. Performance
- Minimal DOM overhead with conditional rendering
- Efficient memory usage với automatic cleanup
- Lazy evaluation của modal content

## Best Practices cho Usage

### Khi nào sử dụng Component Pattern
- Complex state management scenarios
- Integration với Redux hoặc Context
- Conditional modal behavior dựa trên business logic
- Need for custom lifecycle management

### Khi nào sử dụng Static Method
- Simple confirmation dialogs
- Quick action confirmations
- One-off modal usage
- Minimal state management requirements

### Error Handling Considerations
- Always handle async errors trong onOk callbacks
- Provide meaningful error messages cho users
- Log errors với appropriate context information
- Consider user experience during error states

## Integration với CaterSoft Ecosystem

### Business Context
- Designed specifically cho industrial catering management
- Vietnamese localization phù hợp với target users
- Integration với business workflows như material estimation, inventory management

### Technical Integration
- Follows CaterSoft coding standards và naming conventions
- Integration với existing Redux stores
- Compatibility với CRACO build system và TypeScript configuration

### Future Extensibility
- Architecture supports adding new modal types
- Shared utilities có thể extend cho additional functionality
- TypeScript interfaces allow safe API evolution 