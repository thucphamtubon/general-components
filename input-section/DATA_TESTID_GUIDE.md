# Data TestID Guide - Input Section

## 📋 Tổng quan

Tất cả các component trong input-section đã được tích hợp hỗ trợ `data-testid` linh động để phục vụ testing chuyên sâu.

## 🎯 Cách sử dụng

### 1. Base Components

Tất cả base components hỗ trợ 2 props:
- `testId`: Chỉ định testId cụ thể
- `testIdPrefix`: Prefix để auto-generate testId

```typescript
// Chỉ định testId cụ thể
<BaseInputAntd testId="custom-input" />
// Kết quả: data-testid="custom-input"

// Sử dụng prefix để auto-generate
<BaseInputAntd testIdPrefix="user-form" />
// Kết quả: data-testid="user-form-input"

// Không chỉ định gì - không có testId
<BaseInputAntd />
// Kết quả: không có data-testid
```

### 2. Form Components

Form components tự động generate testId từ `name` prop:

```typescript
// Auto-generate từ name
<TextInputItem name="username" />
// Kết quả: 
// - Form.Item: data-testid="form-item-username"
// - Input: data-testid="form-input-username"

// Sử dụng prefix
<TextInputItem name="username" testIdPrefix="login" />
// Kết quả:
// - Form.Item: data-testid="login-form-item-username"
// - Input: data-testid="login-username"

// Override hoàn toàn
<TextInputItem name="username" testId="custom-username-input" />
// Kết quả:
// - Form.Item: data-testid="form-item-username"
// - Input: data-testid="custom-username-input"
```

## 🔧 Patterns được hỗ trợ

### Base Components Auto-generation

| Component | Pattern |
|-----------|----------|
| BaseInputAntd | `{prefix}-input` |
| BaseInputNumberAntd | `{prefix}-input-number` |
| BaseSelectAntd | `{prefix}-select` |
| BaseDatePickerAntd | `{prefix}-date-picker` |
| BaseTextAreaAntd | `{prefix}-textarea` |
| BaseCheckboxAntd | `{prefix}-checkbox` |
| BaseSwitchAntd | `{prefix}-switch` |
| BaseRangePickerAntd | `{prefix}-range-picker` |
| BaseTimePickerAntd | `{prefix}-time-picker` |

### Form Components Auto-generation

| Component | Form Item Pattern | Input Pattern |
|-----------|-------------------|---------------|
| TextInputItem | `{prefix}-form-item-{name}` | `{prefix}-{name}` hoặc `form-input-{name}` |
| NumberInputItem | `{prefix}-form-item-{name}` | `{prefix}-{name}` hoặc `form-input-number-{name}` |
| SelectInputItem | `{prefix}-form-item-{name}` | `{prefix}-{name}` hoặc `form-select-{name}` |

### Select Options

Select options tự động có testId:
```typescript
<SelectInputItem 
  name="status" 
  options={[{label: 'Active', value: 'active'}]} 
/>
// Option: data-testid="form-select-status-option-active"
```

## 🚀 Ví dụ thực tế

### 1. Form đăng nhập

```typescript
const LoginForm = () => {
  return (
    <Form>
      <TextInputItem 
        name="username" 
        testIdPrefix="login"
        label="Tên đăng nhập"
      />
      {/* data-testid="login-form-item-username" và "login-username" */}
      
      <TextInputItem 
        name="password" 
        testIdPrefix="login"
        type="password"
        label="Mật khẩu"
      />
      {/* data-testid="login-form-item-password" và "login-password" */}
    </Form>
  );
};
```

### 2. Form tạo user

```typescript
const CreateUserForm = () => {
  return (
    <Form>
      <TextInputItem 
        name="fullName" 
        testIdPrefix="create-user"
        label="Họ tên"
      />
      
      <SelectInputItem 
        name="role" 
        testIdPrefix="create-user"
        label="Vai trò"
        options={[
          {label: 'Admin', value: 'admin'},
          {label: 'User', value: 'user'}
        ]}
      />
      {/* Options: "create-user-role-option-admin", "create-user-role-option-user" */}
      
      <NumberInputItem 
        name="age" 
        testIdPrefix="create-user"
        label="Tuổi"
      />
    </Form>
  );
};
```

### 3. Testing với Cypress/Playwright

```typescript
// Cypress
cy.get('[data-testid="login-username"]').type('admin');
cy.get('[data-testid="login-password"]').type('password123');
cy.get('[data-testid="create-user-role"]').click();
cy.get('[data-testid="create-user-role-option-admin"]').click();

// Playwright
await page.fill('[data-testid="login-username"]', 'admin');
await page.fill('[data-testid="login-password"]', 'password123');
await page.click('[data-testid="create-user-role"]');
await page.click('[data-testid="create-user-role-option-admin"]');
```

## 📝 Best Practices

### 1. Sử dụng testIdPrefix nhất quán
```typescript
// ✅ Tốt - prefix nhất quán cho cả form
const prefix = "user-profile";
<TextInputItem name="name" testIdPrefix={prefix} />
<SelectInputItem name="role" testIdPrefix={prefix} />

// ❌ Tránh - prefix không nhất quán
<TextInputItem name="name" testIdPrefix="profile" />
<SelectInputItem name="role" testIdPrefix="user" />
```

### 2. Naming convention
```typescript
// ✅ Tốt - kebab-case, mô tả rõ ràng
testIdPrefix="user-profile"
testIdPrefix="order-form"
testIdPrefix="product-filter"

// ❌ Tránh - camelCase hoặc không rõ ràng
testIdPrefix="userProfile"
testIdPrefix="form1"
testIdPrefix="test"
```

### 3. Hierarchical testing
```typescript
// Module level
const modulePrefix = "inventory";

// Page level  
const pagePrefix = `${modulePrefix}-product-list`;

// Form level
const formPrefix = `${pagePrefix}-filter`;

<TextInputItem name="search" testIdPrefix={formPrefix} />
// Kết quả: "inventory-product-list-filter-search"
```

## 🔍 Debugging

Để kiểm tra testId đã được generate:

```typescript
// Trong DevTools Console
document.querySelectorAll('[data-testid]').forEach(el => {
  console.log(el.getAttribute('data-testid'), el);
});

// Hoặc tìm theo pattern
document.querySelectorAll('[data-testid*="login"]');
```

## 🎯 Lợi ích

1. **Tự động**: Không cần nhớ gắn testId cho mỗi component
2. **Nhất quán**: Pattern chuẩn cho toàn bộ ứng dụng
3. **Linh động**: Có thể override khi cần thiết
4. **Hierarchical**: Hỗ trợ testing theo cấp độ module/page/form
5. **Maintainable**: Dễ dàng refactor và maintain
6. **Scalable**: Phù hợp với dự án lớn có nhiều form phức tạp