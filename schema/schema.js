const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull} = require('graphql')

const Notes = require('../models/note')
const User = require('../models/user')

const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: new GraphQLNonNull(GraphQLString)},
    text: {type: GraphQLString},
    time: {type: GraphQLString},
  })
})

const UserType = new GraphQLObjectType( {
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    username: {type: new GraphQLNonNull(GraphQLString)},
    avatar: {type: GraphQLString},
    age: {type: GraphQLString},
    goal: {type: GraphQLString},
    sex: {type: GraphQLString},
  })
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getSingleNote: {
      type: NoteType,
      args: { id: {type: GraphQLID} },
      resolve(parent, args) {
        return Notes.findById(args.id)
      }
    },
    getAllNotes: {
      type: new GraphQLList(NoteType),
      resolve() {
        return Notes.find({})
      }
    },
    getAllUsers: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({})
      }
    },
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addNote: {
      type: NoteType,
      args: {
        title: { type: GraphQLString},
        text: { type: GraphQLString},
        time: { type: GraphQLString},
      },
      resolve (parent, args) {
        const note = new Notes({
          title: args.title,
          text: args.text,
          time: args.time,
        })
        return note.save()
      }
    },
    delNote: {
      type: NoteType,
      args: {
        id: {type: GraphQLID}
      },
      resolve (parent, args) {
        return Notes.findByIdAndRemove(args.id)
      }
    },
    updateNote: {
      type: NoteType,
      args: {
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        text: {type: GraphQLString}
      },
      resolve (parent, args) {
        return Notes.findByIdAndUpdate(
          args.id,
          {$set: {title: args.title, text: args.text}},
        {new: true}
        )
      }
    },
    addUser:{
      type: UserType,
      args: {
        username: {type: new GraphQLNonNull(GraphQLString)},
        avatar: {type: GraphQLString},
        age: {type: GraphQLString},
        goal: {type: GraphQLString},
        sex: {type: GraphQLString},
      },
      resolve(parent, args) {
        const user = new User({
          username: args.username,
          avatar: args.avatar,
          age: args.age,
          goal: args.goal,
          sex: args.sex,
        })
        return user.save()
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})