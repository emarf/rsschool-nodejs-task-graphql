import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberTypeId } from "../../member-types/schemas.js";
import { Context } from "./global.js";

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: "MemberTypeId",
  values: {
    BASIC: { value: MemberTypeId.BASIC },
    BUSINESS: { value: MemberTypeId.BUSINESS },
  },
});

export const MemberType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});


export const MemberQuery = new GraphQLObjectType({
  name: "MemberQuery",
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (source, args, { prisma }: Context) => {
        return await prisma.memberType.findMany();
      }
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) }
      },
      resolve: async (source, { id }: { id: string; }, { prisma }: Context) => {
        return await prisma.memberType.findUnique({ where: { id } });
      }
    },
  })
});