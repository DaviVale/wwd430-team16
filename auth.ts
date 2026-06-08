import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { query } from "@/lib/db";

// AUTH_SECRET, AUTH_GITHUB_ID, and AUTH_GITHUB_SECRET are read automatically
// from the environment (see .env.local).
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // On sign-in, link the session to a row in the `users` table so the profile
    // page has a stable record to read and update. Prefer an existing row —
    // matched by the GitHub account id (a returning user) or by email (a row
    // seeded before this account first signed in) — and only insert a new row
    // when neither exists, so we never collide with the unique email constraint.
    async jwt({ token, account }) {
      if (account?.provider === "github") {
        const githubId = String(account.providerAccountId);
        const email = token.email ?? null;

        const existing = await query<{ id: string }>(
          `select id from users
            where id = $1 or ($2::text is not null and email = $2)
            limit 1`,
          [githubId, email],
        );

        if (existing.rows[0]) {
          token.userId = existing.rows[0].id;
        } else {
          await query(
            `insert into users (id, name, email, image, "createdAt")
             values ($1, $2, $3, $4, now())
             on conflict do nothing`,
            [githubId, token.name ?? null, email, token.picture ?? null],
          );
          token.userId = githubId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId && session.user) {
        session.user.id = String(token.userId);
        // Read profile fields back from our database so saved edits are the
        // source of truth everywhere (header, account, etc.) — not GitHub.
        const result = await query<{ name: string | null; email: string | null; image: string | null }>(
          `select name, email, image from users where id = $1`,
          [session.user.id],
        );
        const user = result.rows[0];
        if (user) {
          session.user.name = user.name ?? session.user.name;
          session.user.email = user.email ?? session.user.email;
          session.user.image = user.image ?? session.user.image;
        }
      }
      return session;
    },
  },
});
