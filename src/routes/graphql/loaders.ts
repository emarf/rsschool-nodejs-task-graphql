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


export const createProfilesLoader = (prisma: PrismaClient) => {
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

export const createMemberTypesLoader = (prisma: PrismaClient) => {
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


export const createUserSubscribedToLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User[]>(async (userIds) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: { in: userIds as string[] } },
      include: { author: true },
    });

    const userToAuthorsMap = new Map<string, User[]>();

    subscriptions.forEach((subscription) => {
      userToAuthorsMap.set(subscription.subscriberId, [...userToAuthorsMap.get(subscription.subscriberId) || [], subscription.author]);
    });

    return userIds.map((id) => userToAuthorsMap.get(id) || []);
  });
};

export const createSubscribedToUserLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User[]>(async (userIds) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { authorId: { in: userIds as string[] } },
      include: { subscriber: true },
    });
    const userToSubscribersMap = new Map<string, User[]>();

    subscriptions.forEach((subscription) => {
      userToSubscribersMap.set(subscription.authorId, [...userToSubscribersMap.get(subscription.authorId) || [], subscription.subscriber]);
    });

    return userIds.map((id) => userToSubscribersMap.get(id) || []);
  });
};