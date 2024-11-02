import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { execute, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createMemberTypesLoader, createPostsLoader, createProfilesLoader, createSubscribedToUserLoader, createUserSubscribedToLoader } from './loaders.js';
import { schema } from './schema.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const loaders = {
        postsLoader: createPostsLoader(prisma),
        profilesLoader: createProfilesLoader(prisma),
        memberTypesLoader: createMemberTypesLoader(prisma),
        userSubscribedToLoader: createUserSubscribedToLoader(prisma),
        subscribedToUserLoader: createSubscribedToUserLoader(prisma),
      };

      try {
        const documentAST = parse(query);
        const validationErrors = validate(schema, documentAST, [depthLimit(5)]);

        if (validationErrors.length > 0) {
          return { errors: validationErrors };
        }

        const result = await execute({
          schema,
          document: documentAST,
          variableValues: variables,
          contextValue: { prisma, loaders }
        });

        return { data: result.data, errors: result.errors };
      } catch (error) {
        req.log.error(error);
        // return { errors: [new GraphQLError(error.message)] };
      }
    },
  });
};

export default plugin;
