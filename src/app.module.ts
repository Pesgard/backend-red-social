import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SyncModule } from './modules/sync/sync.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { HealthController } from './modules/health/health.controller';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env`,
  }),

  // Conexión a MongoDB
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI'),
      retryAttempts: 3,
      retryDelay: 1000,
    }),
  }),


    SyncModule, AuthModule, PostsModule, CommentsModule, FavoritesModule, UsersModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }
    
  ],
})
export class AppModule { }
