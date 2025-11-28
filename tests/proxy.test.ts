import request from 'supertest';
import express from 'express';
import { createProxy, validateUrl } from '../src/proxy';

// 创建测试Express应用
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('*', validateUrl, createProxy());

describe('Proxy Middleware', () => {
  test('should return 400 for invalid URL format', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid URL format. Expected: /{host}/path' });
  });
  
  test('should return 400 for invalid Authorization header format', async () => {
    const response = await request(app)
      .get('/example.com/api/resource')
      .set('Authorization', 'InvalidFormat token1,token2');
    
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid Authorization header format');
  });
  
  // 注意：这个测试会实际尝试连接到example.com，可能会失败
  // 我们主要测试请求格式验证，而不是实际的代理转发
  test('should handle valid request format', async () => {
    // 由于实际代理可能超时，我们只测试请求是否被正确处理到代理阶段
    // 而不等待完整的代理响应
    const response = await request(app)
      .get('/example.com/api/resource')
      .set('Authorization', 'Bearer token1,token2,token3')
      .timeout(5000)
      .catch(err => err.response);
    
    // 响应可能是500（代理错误）或超时，但不应该是400（格式错误）
    expect(response?.status).not.toBe(400);
  });
});
