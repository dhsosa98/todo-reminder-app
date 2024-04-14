import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { Public } from 'src/decorators/public.decorator';
import { UserDto } from 'src/dtos/user.dto';
import { AuthService } from 'src/services/auth.service';


@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('auth/signup')
  getProfile(@Body() user: UserDto) {
    return this.authService.register(user);
  }

  @Public()
  @Post('auth/google/signup')
  async signUpWithGoogle(@Body() body: { token: string, user: any}) {
    return this.authService.signUpWithGoogle(body.token, body.user);
  }

  @Post('auth/fdc/register')
  async registerFdcToken(@Request() req, @Body() body: { token: string }) {
    return this.authService.registerFdcToken(req.user.userId, body.token);
  }
}