import { Body, Controller, Post, Get, Req, Delete } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UpdateUserDto } from './dto/update-use.dto';

@Controller('auth')
export class AuthController {
  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    return this.authService.findById(req.user.id);
  }

  @Patch('me')
  updateMe(@Req() req: RequestWithUser, @Body() dto: UpdateUserDto) {
    return this.authService.updateUser(req.user.id, dto);
  }

  @Delete('me')
  deleteMe(@Req() req: RequestWithUser) {
    return this.authService.deleteUser(req.user.id);
  }
}
