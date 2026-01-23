import { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      householdId: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    householdId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    householdId?: string;
  }
}
