import { createApp } from '../server/src/app';

const app = createApp();

export default app;
// Ensure CommonJS compatibility for Vercel runtime
module.exports = app;
