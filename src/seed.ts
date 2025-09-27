import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeedModule);
  const seeder = appContext.get(SeedService);
  await seeder.run();

  await appContext.close();
}

bootstrap();
