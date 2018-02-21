const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should allow valid strings', () => {
    expect(isRealString('  as  dbadaf  ')).toBe(true);
  });

  it('should reject non-string values', () => {
    expect(isRealString(1)).toBe(false);
  });

  it('should reject strings with only spaces', () => {
    expect(isRealString('          ')).toBe(false);
  });
});
