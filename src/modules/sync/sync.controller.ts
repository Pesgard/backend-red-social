import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncPostsDto } from './dto/sync-posts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  syncPosts(
    @CurrentUser('id') userId: string,
    @Body() syncPostsDto: SyncPostsDto,
  ) {
    return this.syncService.syncPosts(userId, syncPostsDto);
  }
}
