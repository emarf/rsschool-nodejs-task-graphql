import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { MemberQuery } from './types/member.js';
import { PostMutation, PostQuery } from './types/post.js';
import { ProfileMutation, ProfileQuery } from './types/profile.js';
import { UserMutation, UserQuery } from './types/user.js';



const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    ...MemberQuery.toConfig().fields,
    ...PostQuery.toConfig().fields,
    ...ProfileQuery.toConfig().fields,
    ...UserQuery.toConfig().fields
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    ...UserMutation.toConfig().fields,
    ...PostMutation.toConfig().fields,
    ...ProfileMutation.toConfig().fields
  }
});

export const schema: GraphQLSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
