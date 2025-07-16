import { evaluateMathExpression } from '../utils';

describe('evaluateMathExpression', () => {
  it('evaluates simple arithmetic correctly', () => {
    expect(evaluateMathExpression('1 + 2 * 3')).toBe(7);
  });

  it('returns original string for invalid characters', () => {
    const malicious = 'alert(1)';
    expect(evaluateMathExpression(malicious)).toBe(malicious);
  });

  it('returns original string on malformed expression', () => {
    const bad = '1 +++ 2';
    expect(evaluateMathExpression(bad)).toBe(bad);
  });
});
