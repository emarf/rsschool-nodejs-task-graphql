
import { PrismaClient } from "@prisma/client";
import { createMemberTypesLoader, createPostsLoader, createProfilesLoader, createSubscribedToUserLoader, createUserSubscribedToLoader } from "../loaders.js";

export interface Context {
  prisma: PrismaClient;
  loaders: {
    postsLoader: ReturnType<typeof createPostsLoader>;
    profilesLoader: ReturnType<typeof createProfilesLoader>;
    memberTypesLoader: ReturnType<typeof createMemberTypesLoader>;
    userSubscribedToLoader: ReturnType<typeof createUserSubscribedToLoader>;
    subscribedToUserLoader: ReturnType<typeof createSubscribedToUserLoader>;
  };
}