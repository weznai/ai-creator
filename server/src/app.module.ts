import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { MaterialModule } from '@modules/material/material.module';
import { ImageTaskModule } from '@modules/image-task/image-task.module';
import { VideoTaskModule } from '@modules/video-task/video-task.module';
import { WorkModule } from '@modules/work/work.module';
import { AdminModule } from '@modules/admin/admin.module';

import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import redisConfig from '@config/redis.config';
import jwtConfig from '@config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, jwtConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [__dirname + '/database/entities/**/*.entity{.ts,.js}'],
        synchronize: configService.get('nodeEnv') === 'development',
        logging: configService.get('nodeEnv') === 'development',
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UserModule,
    MaterialModule,
    ImageTaskModule,
    VideoTaskModule,
    WorkModule,
    AdminModule,
  ],
})
export class AppModule {}
