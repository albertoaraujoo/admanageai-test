import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { NextResponse } from 'next/server'

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl
      const isLogin = pathname.startsWith('/login')
      const isLoggedIn = !!auth?.user

      if (isLogin && isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
      }
      if (!isLogin && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
      }
      return true
    },
    jwt({ token, user, account }) {
      if (account?.providerAccountId) {
        token.sub = account.providerAccountId
      }
      if (user?.image) {
        token.picture = user.image
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        if (typeof token.picture === 'string' && token.picture) {
          session.user.image = token.picture
        }
      }
      return session
    },
  },
  trustHost: true,
} satisfies NextAuthConfig
