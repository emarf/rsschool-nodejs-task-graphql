import { PrismaClient, Post, Profile, MemberType, User } from "@prisma/client";
import DataLoader from "dataloader";

export const createPostsLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Post[]>(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds as string[] } },
    });
    const postsMap = new Map<string, Post[]>();

    posts.forEach((post) => {
      postsMap.set(post.authorId, [...postsMap.get(post.authorId) || [], post]);
    });

    return authorIds.map((id) => postsMap.get(id) || []);
  });
};

export const createProfileLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Profile | null>(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds as string[] } },
    });

    const profilesMap = new Map<string, Profile>();
    profiles.forEach((profile) => {
      profilesMap.set(profile.userId, profile);
    });

    return userIds.map((id) => profilesMap.get(id) || null);
  });
};

export const createMemberTypeLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, MemberType | null>(async (memberTypeIds: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: memberTypeIds as string[] } },
    });

    const memberTypesMap = new Map<string, MemberType>();
    memberTypes.forEach((memberType) => {
      memberTypesMap.set(memberType.id, memberType);
    });

    return memberTypeIds.map((id) => memberTypesMap.get(id) || null);
  });
};

export const createUserLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User | null>(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds as string[] } },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true
      }
    });

    const usersMap = new Map<string, User>();
    users.forEach((user) => {
      usersMap.set(user.id, user);
    });

    return userIds.map((id) => usersMap.get(id) || null);
  });
};