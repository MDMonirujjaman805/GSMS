import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.lib';
import { envConfig } from '../../config/env.config';
import { AppError } from '../../errors/app-error';
import {
  LoginRequestDto,
  LoginResponseDto,
  UserResponseDto,
  ChangePasswordRequestDto,
} from './auth.types';

export class AuthService {
  public async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const { usernameOrEmail, password } = dto;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail.toLowerCase().trim() },
          { email: usernameOrEmail.toLowerCase().trim() },
        ],
      },
    });

    if (!user) {
      throw AppError.unauthorized('Invalid credentials provided');
    }

    if (!user.isActive) {
      throw AppError.unauthorized('User account has been deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid credentials provided');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      envConfig.jwtSecret,
      { expiresIn: envConfig.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
    );

    const userDto: UserResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    return {
      user: userDto,
      token,
      expiresIn: envConfig.jwtExpiresIn,
    };
  }

  public async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw AppError.notFound('User profile not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  public async changePassword(
    userId: string,
    dto: ChangePasswordRequestDto
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = dto;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw AppError.notFound('User profile not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw AppError.badRequest('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    return { message: 'Password changed successfully' };
  }
}

export const authService = new AuthService();
