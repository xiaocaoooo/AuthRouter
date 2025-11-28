/**
 * 解析请求URL，提取目标主机和路径
 * @param url 请求URL，格式为 /{host}/aaa/bbb
 * @returns 包含目标主机和路径的对象，或null如果URL格式无效
 */
export function parseUrl(url: string): { host: string; path: string } | null {
  const parts = url.split('/').filter(Boolean);
  
  if (parts.length === 0) {
    return null;
  }
  
  const host = parts[0];
  const path = `/${parts.slice(1).join('/')}`;
  
  return { host, path };
}

/**
 * 从Authorization头中解析并随机选择一个令牌
 * @param authHeader Authorization头，格式为 "Bearer AAA,BBB,CCC"
 * @returns 随机选择的令牌，或null如果Authorization头格式无效
 */
export function selectRandomToken(authHeader: string): string | null {
  const bearerPrefix = 'Bearer ';
  
  if (!authHeader.startsWith(bearerPrefix)) {
    return null;
  }
  
  const tokensPart = authHeader.slice(bearerPrefix.length);
  const tokens = tokensPart.split(',').map(token => token.trim()).filter(Boolean);
  
  if (tokens.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * tokens.length);
  return tokens[randomIndex];
}

/**
 * 生成随机字符串（用于测试）
 * @param length 字符串长度
 * @returns 随机字符串
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}
