/**
 * Hàm đánh giá biểu thức toán học đơn giản thay thế cho math.evaluate
 * Hỗ trợ các phép toán cơ bản: +, -, *, /, ^, (), sqrt, sin, cos, tan, log, ln
 * @param expression - Biểu thức toán học dưới dạng chuỗi
 * @param scope - Đối tượng chứa các biến (tùy chọn)
 * @returns Kết quả tính toán
 */
export function evaluate(expression: string, scope?: Record<string, number>): number {
  if (!expression || typeof expression !== 'string') {
    throw new Error('Biểu thức không hợp lệ');
  }

  // Loại bỏ khoảng trắng
  let expr = expression.replace(/\s+/g, '');
  
  // Thay thế các biến từ scope
  if (scope) {
    for (const [key, value] of Object.entries(scope)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      expr = expr.replace(regex, value.toString());
    }
  }
  
  // Thay thế các hàm toán học
  expr = expr.replace(/sqrt\(([^)]+)\)/g, (match, p1) => {
    return `Math.sqrt(${p1})`;
  });
  
  expr = expr.replace(/sin\(([^)]+)\)/g, (match, p1) => {
    return `Math.sin(${p1})`;
  });
  
  expr = expr.replace(/cos\(([^)]+)\)/g, (match, p1) => {
    return `Math.cos(${p1})`;
  });
  
  expr = expr.replace(/tan\(([^)]+)\)/g, (match, p1) => {
    return `Math.tan(${p1})`;
  });
  
  expr = expr.replace(/log\(([^)]+)\)/g, (match, p1) => {
    return `Math.log10(${p1})`;
  });
  
  expr = expr.replace(/ln\(([^)]+)\)/g, (match, p1) => {
    return `Math.log(${p1})`;
  });
  
  // Thay thế lũy thừa ^ bằng Math.pow
  expr = expr.replace(/(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g, (match, base, exponent) => {
    return `Math.pow(${base}, ${exponent})`;
  });
  
  // Thay thế các hằng số toán học
  expr = expr.replace(/\bpi\b/g, 'Math.PI');
  expr = expr.replace(/\be\b/g, 'Math.E');
  
  try {
    // Kiểm tra biểu thức chỉ chứa các ký tự an toàn
    const safePattern = /^[0-9+\-*/().\sMath\w,]+$/;
    if (!safePattern.test(expr)) {
      throw new Error('Biểu thức chứa ký tự không an toàn');
    }
    
    // Đánh giá biểu thức
    const result = Function(`"use strict"; return (${expr})`)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Kết quả không phải là số hợp lệ');
    }
    
    return result;
  } catch (error) {
    throw new Error(`Lỗi đánh giá biểu thức: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
  }
}

/**
 * Hàm đánh giá biểu thức đơn giản chỉ với các phép toán cơ bản
 * An toàn hơn cho việc tính toán số lượng trong ứng dụng
 * @param expression - Biểu thức toán học đơn giản
 * @returns Kết quả tính toán
 */
export function evaluateSimple(expression: string): number {
  if (!expression || typeof expression !== 'string') {
    return 0;
  }
  
  // Loại bỏ khoảng trắng và chỉ giữ lại số, phép toán cơ bản và dấu ngoặc
  const cleanExpr = expression.replace(/\s+/g, '').replace(/[^0-9+\-*/.()]/g, '');
  
  if (!cleanExpr) {
    return 0;
  }
  
  try {
    // Kiểm tra biểu thức chỉ chứa các ký tự an toàn
    const safePattern = /^[0-9+\-*/.()]+$/;
    if (!safePattern.test(cleanExpr)) {
      return 0;
    }
    
    // Kiểm tra cân bằng dấu ngoặc
    let parenthesesCount = 0;
    for (const char of cleanExpr) {
      if (char === '(') parenthesesCount++;
      if (char === ')') parenthesesCount--;
      if (parenthesesCount < 0) return 0;
    }
    if (parenthesesCount !== 0) return 0;
    
    const result = Function(`"use strict"; return (${cleanExpr})`)();
    
    return typeof result === 'number' && isFinite(result) ? result : 0;
  } catch {
    return 0;
  }
}

// Export default cho compatibility
export default { evaluate, evaluateSimple };

// Ví dụ sử dụng:
// const result1 = evaluate('2 + 3 * 4'); // 14
// const result2 = evaluate('sqrt(3^2 + 4^2)'); // 5
// const result3 = evaluate('a * b + c', { a: 5, b: 2, c: 3 }); // 13
// const result4 = evaluateSimple('2 + 3 * 4'); // 14

