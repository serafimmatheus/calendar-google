import { Adapter } from "next-auth/adapters";
import { prisma } from "../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie, parseCookies } from "nookies";

export function PrismaAdapter(
  req: NextApiRequest,
  res: NextApiResponse
): Adapter {
  return {
    async createUser(user) {
      const { "@ignitecall:userId": userIdOnCookies } = parseCookies({ req });

      if (!userIdOnCookies) {
        throw new Error("User ID not found on cookies");
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      });

      destroyCookie({ res }, "@ignitecall:userId", {
        path: "/",
      });

      return {
        id: prismaUser.id,
        name: prismaUser.name!,
        username: prismaUser.username,
        email: prismaUser.email!,
        avatarUrl: prismaUser.avatarUrl!,
        emailVerified: null,
      };
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name!,
        username: user.username,
        email: user.email!,
        avatarUrl: user.avatarUrl!,
        emailVerified: null,
      };
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name!,
        username: user.username,
        email: user.email!,
        avatarUrl: user.avatarUrl!,
        emailVerified: null,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            providerAccountId,
            provider,
          },
        },
        include: {
          user: true,
        },
      });

      if (!account) {
        return null;
      }

      const { user } = account;

      return {
        id: user.id,
        name: user.name!,
        username: user.username,
        email: user.email!,
        avatarUrl: user.avatarUrl!,
        emailVerified: null,
      };
    },

    async updateUser(user) {
      const userUpdated = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      });

      return {
        id: userUpdated.id,
        name: userUpdated.name!,
        username: userUpdated.username,
        email: userUpdated.email!,
        avatarUrl: userUpdated.avatarUrl!,
        emailVerified: null,
      };
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refresh_token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
          sessionState: account.session_state,
        },
      });
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          sessionToken,
          userId,
          expires,
        },
      });

      return {
        sessionToken,
        userId,
        expires,
      };
    },

    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUnique({
        where: {
          sessionToken,
        },
        include: {
          user: true,
        },
      });

      if (!session) {
        return null;
      }

      const { user } = session;

      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires,
        },
        user: {
          id: user.id,
          name: user.name!,
          username: user.username,
          email: user.email!,
          avatarUrl: user.avatarUrl!,
          emailVerified: null,
        },
      };
    },

    async updateSession({ sessionToken, expires, userId }) {
      const prismaSession = await prisma.session.update({
        where: {
          sessionToken,
        },
        data: {
          expires,
          userId,
        },
      });

      return {
        sessionToken: prismaSession.sessionToken,
        userId: prismaSession.userId,
        expires: prismaSession.expires,
      };
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          sessionToken,
        },
      });
    },
  };
}
