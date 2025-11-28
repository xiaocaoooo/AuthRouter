import express from 'express';
import { createProxy, validateUrl } from './proxy';
import logger from './logger';

const app = express();
const PORT = process.env.PORT || 8000;

// 创建日志目录
import { mkdirSync, existsSync } from 'fs';
if (!existsSync('logs')) {
  mkdirSync('logs');
}

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AuthRouter is running' });
});

// 代理路由
app.use('*', validateUrl, createProxy());

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
app.listen(PORT, () => {
  logger.info(`AuthRouter is running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`Usage example: http://localhost:${PORT}/example.com/api/resource`);
});
