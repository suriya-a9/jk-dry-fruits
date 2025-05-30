

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import connectMongo from "@/lib/mongodb";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectMongo();
                const admin = await Admin.findOne({ email: credentials.email });
                if (!admin) throw new Error("No admin found");

                const isValid = await bcrypt.compare(credentials.password, admin.password);
                if (!isValid) throw new Error("Invalid password");

                return { email: admin.email };
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.email = user.email;
            return token;
        },
        async session({ session, token }) {
            session.user.email = token.email;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };