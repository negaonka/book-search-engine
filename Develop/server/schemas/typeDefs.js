// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        title: String
        description: String
        image: String
        link: String
    }
    
    type Query {
        me: User
        users: [User]
        user(username: String!) : User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(authors: [String]!, description: String!, bookId: String!, title: String!, image: String, link: String): User
        deleteBook(bookId: ID!): User
    }

    type Auth {
        token: ID!
        user: User
    }
`;


// export the typeDefs
module.exports = typeDefs;