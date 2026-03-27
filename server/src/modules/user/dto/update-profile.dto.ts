import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @Length(2, 20, { message: '昵称长度为2-20个字符' })
  nickname?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
