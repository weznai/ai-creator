import {
  IsString,
  IsNotEmpty,
  Matches,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: '手机号不能为空' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: '登录类型不能为空' })
  loginType: 'password' | 'code';

  @ValidateIf((o) => o.loginType === 'password')
  @IsNotEmpty({ message: '密码不能为空' })
  password?: string;

  @ValidateIf((o) => o.loginType === 'code')
  @IsNotEmpty({ message: '验证码不能为空' })
  code?: string;
}
