import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// Sample data for products (you can replace this with your database)
const todos = [
  { id: "1", task: "Task A", isCompleted: true },
  { id: "2", task: "Task B", isCompleted: false },
  // Add more products here
];

const typeDefs = `
  type Todo {
    id: ID!
    task: String!
    isCompleted: Boolean
  }

  type Query {
    getAllTodos: [Todo]
    getTodoById(id: ID!): Todo
    getTodosByTask(task: String!): [Todo]
  }

  type Mutation {
    updateTodo(
        id: ID!
        task: String!
        isCompleted: Boolean
    ): Todo
    deleteTodo(id: ID!): String
    createTodo(task: String!, isCompleted: Boolean): Todo
  }

  type Subscription {
    todoUpdated: Todo
  }
`;

const resolvers = {
  Query: {
    getAllTodos: () => todos,
    getTodoById: (_, { id }) =>
      todos.find((todo) => todo.id === id),
    getTodosByTask: (_, { task }) =>
      todos.filter((todo) => todo.task.includes(task)),
  },
  Mutation: {
    updateTodo: (_, { task, isCompleted }) => {
      const todoIndex = todos.findIndex((todo) => todo.id === id);
      if (todoIndex === -1) {
        throw new Error("To do not found");
      }
      todos[todoIndex] = {
        ...todos[todoIndex],
        task,
        isCompleted,
      };
      return todos[todoIndex];
    },
    deleteTodo: (_, { id }) => {
      const todoIndex = todos.findIndex((todo) => todo.id === id);
      if (todoIndex === -1) {
        throw new Error("Todo not found");
      }
      todos.splice(todoIndex, 1);
      return "Todo deleted successfully";
    },
    createTodo: (_, { task, isCompleted }) => {
      const newTodo = {
        id: String(todos.length + 1),
        task,
        isCompleted,
      };
      todos.push(newTodo);
      return newTodo;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);