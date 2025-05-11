import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({ error: 'User already exists.' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return Response.json({ message: 'User created successfully.' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
