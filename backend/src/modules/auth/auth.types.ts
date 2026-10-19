import { Role } from '@prisma/client';

export interface LoginRequestDto {
  usernameOrEmail: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
}

export interface LoginResponseDto {
  user: UserResponseDto;
  token: string;
  expiresIn: string;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}
