import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: { id: string; email: string; role: string }) {
    return this.authService.findById(user.id);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: { id: string; email: string; role: string },
    @Body() dto: UpdateUserDto,
  ) {
    return this.authService.updateUser(user.id, dto);
  }

  @Delete('me')
  deleteMe(@CurrentUser() user: { id: string; email: string; role: string }) {
    return this.authService.deleteUser(user.id);
  }
}
