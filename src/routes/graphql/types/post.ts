import { Post } from "@prisma/client";
import { GraphQLBoolean, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Context } from "./global.js";
import { UUIDType } from './uuid.js';

export const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  })
});

export const PostQuery = new GraphQLObjectType({
  name: "PostQuery",
  fields: () => ({
    posts: {
      type: new GraphQLList(PostType),
      resolve: (source, args, { prisma }: Context) => {
        return prisma.post.findMany();
      }
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: (source, { id }: { id: string; }, { prisma }: Context) => {
        return prisma.post.findUnique({ where: { id } });
      }
    },
  })
});


const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }
});

export const PostMutation = new GraphQLObjectType({
  name: "PostMutation",
  fields: () => ({
    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (source, { dto }: { dto: Post; }, { prisma }: Context) => {
        return await prisma.post.create({ data: dto });
      }
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (source, { id, dto }: { id: string; dto: Partial<Post>; }, { prisma }: Context) => {
        return await prisma.post.update({
          where: { id },
          data: dto,
        });
      }
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: { id: string; }, { prisma }: Context) => {
        await prisma.post.delete({ where: { id } });
        return true;
      }
    },
  })
});