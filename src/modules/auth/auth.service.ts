import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      email: user.email,
    };
  }

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    const { email, password } = registerDto;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword });
    return await newUser.save();
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  // async getUserEmailByIdOrToken(idOrToken: string): Promise<string> {
  //   let userId: string;

  //   // Check if the input is a JWT token or a user ID
  //   if (this.jwtService.verify(idOrToken)) {
  //     const { sub } = this.jwtService.decode(idOrToken);
  //     userId = sub;
  //   } else {
  //     userId = idOrToken;
  //   }

  //   const user = await this.userModel.findById(userId);
  //   return user.email;
  // }

  async getUserEmailFromToken(authHeader: string): Promise<string> {
    try {
      const token = authHeader.split(' ')[1]; // Extract the JWT token from the 'Bearer <token>' format
      const decoded = this.jwtService.verify(token);
      return decoded.email;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
}
