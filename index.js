import { GraphQLServer,  PubSub } from "graphql-yoga";
import { Query } from "./resolvers/Query.mjs";
import { Todo } from "./resolvers/Todo.mjs";
import { User } from "./resolvers/User.mjs"
import { Mutation } from "./resolvers/Mutation.mjs";
import { Subscription } from "./resolvers/Subsciption.mjs";

import { db } from "./data/db.mjs";

const typeDefs = "./schema/schema.graphql";
const pubsub = new PubSub();

const resolvers = {
  Query,
  Todo,
  User,
  Mutation,
  Subscription,
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: {
    db,
    pubsub,
  },
  
});




server.start( () =>
  console.log("Server is running on localhost:4000")
);