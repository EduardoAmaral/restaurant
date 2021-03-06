import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CredentialsDto } from './dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from './user.session.interface';
import { Token } from './token.interface';
import { User } from './model/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private repository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(credentials: CredentialsDto): Promise<Token> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(credentials.password, salt);
    const user = await this.repository.createUser({
      email: credentials.email,
      password: hashedPassword,
    });

    return this.signToken(user);
  }

  async signIn(credentials: CredentialsDto): Promise<Token> {
    const user = await this.repository.findOne({ email: credentials.email });
    if (user && (await bcrypt.compare(credentials.password, user.password))) {
      return this.signToken(user);
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  private signToken(user: User): Token {
    const payload: UserSession = { userId: user.id, userEmail: user.email };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
