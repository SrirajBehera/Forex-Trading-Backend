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
  /**
   * Constructor of AuthService.
   * @param {Model<UserDocument>} userModel - The Mongoose model for User entity.
   * @param {JwtService} jwtService - The JWT service for token generation and verification.
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * Logs in a user with the provided credentials.
   * @param {LoginDto} loginDto - The DTO containing login credentials.
   * @returns {Promise<LoginResponseDto>} The response containing JWT access token and user email.
   */
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

  /**
   * Registers a new user with the provided details.
   * @param {RegisterDto} registerDto - The DTO containing registration details.
   * @returns {Promise<any>} The response containing the newly registered user's details.
   */
  async register(registerDto: RegisterDto): Promise<any> {
    const { email, password } = registerDto;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword });
    return await newUser.save();
  }

  /**
   * Validates a user with the provided email and password.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<UserDocument>} The user document if validation succeeds, otherwise null.
   */
  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
  
  /**
   * Retrieves the email address of the user from the JWT token.
   * @param {string} authHeader - The authorization header containing the JWT token.
   * @returns {Promise<string>} The email address extracted from the JWT token.
   * @throws {UnauthorizedException} Throws an error if the JWT token is invalid.
   */
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
