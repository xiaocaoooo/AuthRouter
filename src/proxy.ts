import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, Options, RequestHandler } from 'http-proxy-middleware';
import { parseUrl, selectRandomToken } from './utils';
import logger from './logger';

/**
 * 创建代理中间件
 * @returns Express中间件函数
 */
export function createProxy(): RequestHandler {
  const proxyOptions: Options = {
    target: 'https://example.com', // 默认目标，将在onProxyReq中动态修改
    changeOrigin: true,
    secure: true,
    router: (req) => {
      const parsed = parseUrl(req.originalUrl);
      if (parsed) {
        return `https://${parsed.host}`;
      }
      return 'https://example.com';
    },
    pathRewrite: (path, req) => {
      const parsed = parseUrl(path);
      if (!parsed) {
        return path;
      }
      return parsed.path;
    },
    onProxyReq: (proxyReq, req: Request, res: Response) => {
      const parsed = parseUrl(req.originalUrl);
      if (!parsed) {
        if (!res.headersSent) {
          res.status(400).send('Invalid URL format');
        }
        return;
      }
      
      // 处理Authorization头
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = selectRandomToken(authHeader);
        if (token) {
          proxyReq.setHeader('Authorization', `Bearer ${token}`);
          logger.info(`Forwarding request to https://${parsed.host}${parsed.path} with token: ${token}`);
        } else {
          logger.warn(`Invalid Authorization header format: ${authHeader}`);
          if (!res.headersSent) {
            res.status(400).send('Invalid Authorization header format');
          }
          return;
        }
      } else {
        logger.info(`Forwarding request to https://${parsed.host}${parsed.path} without Authorization header`);
      }
    },
    onProxyRes: (proxyRes: any, req: Request, res: Response) => {
      logger.info(`Received response with status: ${proxyRes.statusCode}`);
    },
    onError: (err, req: Request, res: Response) => {
      logger.error(`Proxy error: ${err.message}`);
      if (!res.headersSent) {
        res.status(500).send('Proxy error occurred');
      }
    }
  };
  
  return createProxyMiddleware(proxyOptions);
}

/**
 * 验证请求URL格式的中间件
 * @param req Express请求对象
 * @param res Express响应对象
 * @param next Express下一个中间件函数
 */
export function validateUrl(req: Request, res: Response, next: NextFunction): void {
  const parsed = parseUrl(req.originalUrl);
  if (!parsed) {
    logger.warn(`Invalid URL format: ${req.originalUrl}`);
    res.status(400).json({ error: 'Invalid URL format. Expected: /{host}/path' });
    return;
  }
  next();
}
