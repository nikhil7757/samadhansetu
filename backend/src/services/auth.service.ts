import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/jwt.js';
import { Role } from '@prisma/client';

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: string;
  organizationName?: string;
  district: string;
  preferredLanguage?: string;
}

export class AuthService {
  static async signup(data: SignupData) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role as Role,
        organizationName: data.organizationName,
        district: data.district,
        preferredLanguage: data.preferredLanguage || 'en',
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        district: user.district,
        preferredLanguage: user.preferredLanguage,
      },
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid email or password');
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        district: user.district,
        preferredLanguage: user.preferredLanguage,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organizationName: true,
        district: true,
        preferredLanguage: true,
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  }
}
