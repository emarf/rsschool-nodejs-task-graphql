import { User } from '@prisma/client';
import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLResolveInfo, GraphQLString } from "graphql";
import { Context } from './global.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UUIDType } from './uuid.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async ({ id }: { id: string; }, args, { loaders }: Context) => {
        return await loaders.profilesLoader.load(id);
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }: { id: string; }, args, { loaders }: Context) => {
        return await loaders.postsLoader.load(id);
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source, args, { loaders }: Context) => {
        return await loaders.subscribedToUserLoader.load(source.id);
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source, args, { loaders }: Context) => {
        return await loaders.userSubscribedToLoader.load(source.id);
      }
    },
  })
});


export const UserQuery = new GraphQLObjectType({
  name: "UserQuery",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve: async (source, args, { prisma }: Context, resolveInfo: GraphQLResolveInfo) => {
        // const parsedResolveInfo = parseResolveInfo(resolveInfo);
        // console.log('parsedResolveInfo', parsedResolveInfo);
        // const include = {} as any;

        // if (parsedResolveInfo) {
        //   const { fields }: { fields?: UserFields } = simplifyParsedResolveInfoFragmentWithType(
        //     parsedResolveInfo as ResolveTree,
        //     resolveInfo.returnType,
        //   );

        //   if (fields?.subscribedToUser) {
        //     include.subscribedToUser = { include: { subscriber: true } };
        //   }

        //   if (fields?.userSubscribedTo) {
        //     include.userSubscribedTo = { include: { author: true } };
        //   }
        // }
        // console.log('include', include);
        // const result = await prisma.user.findMany({ include });
        // console.log('result', result);
        // return result;

        return await prisma.user.findMany();
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (source, { id }: { id: string; }, { prisma }: Context) => {
        return await prisma.user.findUnique({ where: { id } });
      }
    },
  })
});


const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }
});


export const UserMutation = new GraphQLObjectType({
  name: "UserMutation",
  fields: () => ({
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (source, { dto }: { dto: User; }, { prisma }: Context) => {
        return await prisma.user.create({ data: dto });
      }
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (source, { id, dto }: { id: string; dto: Partial<User>; }, { prisma }: Context) => {
        return await prisma.user.update({
          where: { id },
          data: dto,
        });
      }
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: { id: string; }, { prisma }: Context) => {
        await prisma.user.delete({ where: { id } });
        return true;
      }
    },
    subscribeTo: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { userId, authorId }: { userId: string; authorId: string; }, { prisma }: Context) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId: authorId,
          },
        });
        return true;
      }
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { userId, authorId }: { userId: string; authorId: string; }, { prisma }: Context) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
        return true;
      }
    }
  })
})


