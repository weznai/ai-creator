import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: '手机号不能为空' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: '验证码不能为空' })
  @Length(6, 6, { message: '验证码必须是6位' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: '昵称不能为空' })
  @Length(2, 20, { message: '昵称长度为2-20个字符' })
  nickname: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, {
    message: '密码必须是8-20位，包含字母和数字',
  })
  password: string;
}
