import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '@database/entities/user.entity';
import { SendCodeDto, RegisterDto, LoginDto } from './dto';
import { generateUserNo } from '@utils/user-no.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async sendCode(dto: SendCodeDto) {
    const { phone, type } = dto;

    // TODO: 检查发送频率限制
    // TODO: 生成验证码并发送短信

    return {
      expireIn: 300,
    };
  }

  async register(dto: RegisterDto) {
    const { phone, code, nickname, password } = dto;

    // TODO: 验证验证码

    const existUser = await this.userRepository.findOne({
      where: { phone },
    });

    if (existUser) {
      throw new BadRequestException('手机号已注册');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userNo = await generateUserNo();

    const user = this.userRepository.create({
      userNo,
      phone,
      nickname,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const token = this.generateToken(user);

    return {
      token,
      expiresIn: 7200,
      user: {
        id: user.id,
        userNo: user.userNo,
        phone: this.maskPhone(user.phone),
        nickname: user.nickname,
        avatar: user.avatar,
      },
    };
  }

  async login(dto: LoginDto) {
    const { phone, loginType, password, code } = dto;

    let user: User;

    if (loginType === 'password') {
      user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.phone = :phone', { phone })
        .addSelect('user.password')
        .getOne();

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('手机号或密码错误');
      }
    } else {
      // TODO: 验证验证码
      user = await this.userRepository.findOne({
        where: { phone },
      });

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }
    }

    if (user.status !== 1) {
      throw new UnauthorizedException('用户已被禁用');
    }

    const token = this.generateToken(user);

    return {
      token,
      expiresIn: 7200,
      user: {
        id: user.id,
        userNo: user.userNo,
        phone: this.maskPhone(user.phone),
        nickname: user.nickname,
        avatar: user.avatar,
      },
    };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      userNo: user.userNo,
      phone: this.maskPhone(user.phone),
      nickname: user.nickname,
    };

    return this.jwtService.sign(payload);
  }

  private maskPhone(phone: string): string {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
}
