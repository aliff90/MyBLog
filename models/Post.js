const mongoose = require("mongoose");
const Schema = mongoose.Schema

const PostSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    image: {
        type: String
    },
    contents: {
        subHeader: {
            type: String
        },
        text: {
            type: String,
            
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
          user: {
            type: Schema.Types.ObjectId
          }
        }
      ],
    comments: 
       [ {
            user: {
                type: Schema.Types.ObjectId
            },
            text: {
                type: String,
                required: true,
            },
            name: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
})

module.exports = Post = mongoose.model("post", PostSchema);