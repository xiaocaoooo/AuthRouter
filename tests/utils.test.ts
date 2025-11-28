import { parseUrl, selectRandomToken } from '../src/utils';

describe('parseUrl', () => {
  test('should parse valid URL correctly', () => {
    const url = '/example.com/api/resource';
    const result = parseUrl(url);
    
    expect(result).not.toBeNull();
    expect(result?.host).toBe('example.com');
    expect(result?.path).toBe('/api/resource');
  });
  
  test('should parse URL with multiple path segments', () => {
    const url = '/example.com/v1/users/123/profile';
    const result = parseUrl(url);
    
    expect(result).not.toBeNull();
    expect(result?.host).toBe('example.com');
    expect(result?.path).toBe('/v1/users/123/profile');
  });
  
  test('should return null for empty URL', () => {
    const url = '/';
    const result = parseUrl(url);
    
    expect(result).toBeNull();
  });
  
  test('should return null for invalid URL format', () => {
    const url = '';
    const result = parseUrl(url);
    
    expect(result).toBeNull();
  });
});

describe('selectRandomToken', () => {
  test('should select a random token from valid Authorization header', () => {
    const authHeader = 'Bearer token1,token2,token3';
    const tokens = new Set<string>();
    
    // 多次调用，验证随机选择
    for (let i = 0; i < 100; i++) {
      const token = selectRandomToken(authHeader);
      expect(token).not.toBeNull();
      if (token) {
        tokens.add(token);
      }
    }
    
    // 验证所有令牌都被选中过
    expect(tokens.size).toBe(3);
    expect(tokens.has('token1')).toBeTruthy();
    expect(tokens.has('token2')).toBeTruthy();
    expect(tokens.has('token3')).toBeTruthy();
  });
  
  test('should return null for invalid Authorization header format', () => {
    const authHeader = 'InvalidFormat token1,token2';
    const result = selectRandomToken(authHeader);
    
    expect(result).toBeNull();
  });
  
  test('should return null for empty tokens list', () => {
    const authHeader = 'Bearer ';
    const result = selectRandomToken(authHeader);
    
    expect(result).toBeNull();
  });
  
  test('should return null for Authorization header with only commas', () => {
    const authHeader = 'Bearer ,,,,';
    const result = selectRandomToken(authHeader);
    
    expect(result).toBeNull();
  });
  
  test('should handle single token correctly', () => {
    const authHeader = 'Bearer singleToken';
    const result = selectRandomToken(authHeader);
    
    expect(result).toBe('singleToken');
  });
});
