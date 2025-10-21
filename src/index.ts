import { initDataSource } from './config/data-source';
import { redisClient } from './config/redis';
import { createApp } from './app';

const PORT = Number(process.env.PORT || 3000);

async function main() {
  await initDataSource();
  await redisClient.connect();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`🚀 API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
