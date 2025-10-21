import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongo";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email.toLowerCase() });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          // You can include extra fields in the token if you want:
          // age: user.age, gender: user.gender, emergencyContacts: user.emergencyContacts
        };
      },
    }),
  ],
  
    callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.name = user.name;
      token.email = user.email;
      (token as any).emergencyContacts = (user as any).emergencyContacts || [];
    }
    return token;
  },

  async session({ session, token }) {
    // ✅ Ensure session.user exists — important fix
    session.user = {
      name: token.name as string,
      email: token.email as string,
    };

    // ✅ Optional: pass emergency contacts too
    (session as any).emergencyContacts = (token as any).emergencyContacts || [];

    return session;
  },
}

}