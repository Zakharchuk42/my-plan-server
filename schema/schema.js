const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull} = require('graphql')

const Notes = require('../models/note')
const User = require('../models/user')
const NoteCategory = require('../models/noteCategory')

const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: new GraphQLNonNull(GraphQLString)},
    text: {type: GraphQLString},
    time: {type: GraphQLString},
    userId: {type: GraphQLString},
    day: {type: GraphQLString},
    startTime: {type: GraphQLString},
    endTime: {type: GraphQLString},
    color: {type: GraphQLString},
  })
})

const UserType = new GraphQLObjectType( {
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    username: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    avatar: {type: GraphQLString},
    userNotes: {
      type: new GraphQLList(NoteType),
      resolve(parent) {
        return Notes.find({userId: parent.id})
      }
    },
    noteCategory: {
      type: new GraphQLList(NoteCategoryType),
      resolve(parent) {
        return NoteCategory.find({userId: parent.id})
      }
    }
  })
})

const NoteCategoryType = new GraphQLObjectType({
  name: 'NoteCategory',
  fields: ()=>({
    id: {type: GraphQLID},
    userId: {type: (GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    color: {type: new GraphQLNonNull(GraphQLString)}
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
    getUser: {
      type: UserType,
      args: { id: {type: GraphQLID} },
      resolve(parent, args) {
        return User.findById(args.id)
      }
    },
    getAllUsers: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({})
      }
    },
    getNoteCategory: {
      type: new GraphQLList(NoteCategoryType),
      resolve() {
        return NoteCategory.find({})
      }
    }
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
        userId: { type: GraphQLString},
        day: {type: GraphQLString},
        startTime: {type: GraphQLString},
        endTime: {type: GraphQLString},
        color: {type: GraphQLString},
      },
      resolve (parent, args) {
        const note = new Notes({
          title: args.title,
          text: args.text,
          time: args.time,
          userId: args.userId,
          day: args.day,
          startTime: args.startTime,
          endTime: args.endTime,
          color: args.color,
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
        text: {type: GraphQLString},
        startTime: {type: GraphQLString},
        endTime: {type: GraphQLString},
        color: {type: GraphQLString},
      },
      resolve (parent, args) {
        return Notes.findByIdAndUpdate(
          args.id,
          {$set: {title: args.title, text: args.text, startTime: args.startTime, endTime: args.endTime, color: args.color}},
        {new: true}
        )
      }
    },
    addUser:{
      type: UserType,
      args: {
        username: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        avatar: {type: GraphQLString},
      },
      resolve(parent, args) {
        const user = new User({
          username: args.username,
          password: args.password,
          email: args.email,
          avatar: args.avatar,
        })
        return user.save()
      }
    },
    addNoteCategory:{
      type: NoteCategoryType,
      args: {
        userId: {type: GraphQLString},
        title: {type: new GraphQLNonNull(GraphQLString)},
        color: {type: new GraphQLNonNull((GraphQLString))},
      },
      resolve(parent, args) {
        const noteCategory = new NoteCategory({
          userId: args.userId,
          title: args.title,
          color: args.color,
        })
        return noteCategory.save()
      }
    },
    delNoteCategory: {
      type: NoteCategoryType,
      args: {
        id: {type: GraphQLID}
      },
      resolve (parent, args) {
        return NoteCategory.findByIdAndRemove(args.id)
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})