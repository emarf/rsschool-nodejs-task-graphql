
import { PrismaClient } from "@prisma/client";
import { createMemberTypeLoader, createPostsLoader, createProfileLoader, createUserLoader } from "../loaders.js";

export interface Context {
  prisma: PrismaClient;
  loaders: {
    postsLoader: ReturnType<typeof createPostsLoader>;
    profileLoader: ReturnType<typeof createProfileLoader>;
    memberTypeLoader: ReturnType<typeof createMemberTypeLoader>;
    userLoader: ReturnType<typeof createUserLoader>;
  };
}