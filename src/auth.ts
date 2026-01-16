import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// Get allowed emails from environment variable (comma-separated)
const getAllowedEmails = (): string[] => {
  const emails = process.env.ALLOWED_EMAILS || '';
  return emails.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = getAllowedEmails();

      // If no allowlist is configured, deny all (fail-safe)
      if (allowedEmails.length === 0) {
        console.error('No ALLOWED_EMAILS configured. Denying access.');
        return false;
      }

      const userEmail = user.email?.toLowerCase();

      if (!userEmail) {
        return false;
      }

      const isAllowed = allowedEmails.includes(userEmail);

      if (!isAllowed) {
        console.log(`Access denied for email: ${userEmail}`);
        return false;
      }

      return true;
    },
    async session({ session, token }) {
      // Add user id to session
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
