import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':id/favorite')
  @HttpCode(HttpStatus.OK)
  toggleFavorite(
    @Param('id') postId: string,
    @CurrentUser('id') userId: string,
    @Body() toggleFavoriteDto: ToggleFavoriteDto,
  ) {
    return this.favoritesService.toggleFavorite(
      postId,
      userId,
      toggleFavoriteDto,
    );
  }
}
