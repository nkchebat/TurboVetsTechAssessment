import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FakeAuthMiddleware } from './auth/fake-auth.middleware';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const authMiddleware = new FakeAuthMiddleware(dataSource);
  app.use(authMiddleware.use.bind(authMiddleware));
  await app.listen(3000);
}
bootstrap();
