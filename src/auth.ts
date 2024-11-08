import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import prisma from '@/prisma-client';
import { z } from 'zod';
import type { User as DBUser } from '@prisma/client';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextResponse } from 'next/server';
import { getUser } from './actions/user';
// import GitHub from 'next-auth/providers/github';

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends Omit<DBUser, 'password'> {}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized: async ({ auth: session, request: { nextUrl } }) => {
      const isLoggedIn = !!session?.user;
      const isOnHome = nextUrl.pathname.startsWith('/home');

      if (isOnHome) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        const callbackUrl = nextUrl.searchParams.get('callbackUrl');
        if (callbackUrl) {
          console.log('callbackUrl: ', callbackUrl);
          return NextResponse.redirect(new URL(callbackUrl));
        }
        return NextResponse.redirect(new URL('/home', nextUrl));
      }
      return true;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.error) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);

        if (!user) {
          return null;
          throw new Error("User with this email doesn't exist");
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) {
          return null;
          throw new Error('Invalid password');
        }

        return {
          ...user,
          password: undefined,
        };
      },
    }),
    // TODO: handle it later
    // GitHub,
  ],
});
