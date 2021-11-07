const express = require("express");
const Post = require("../../models/Post");
const User = require("../../models/User");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const {upload, deleteFile} = require("../../middleware/upload");
const { MulterError } = require("multer");

// @route    GET api/posts
// @desc     Get all post
// @access   Public
router.get("/", async (req, res) => {
    const pageSize = 5;
    const page= parseInt(req.query.page || "0");
    try {
        const total = await Post.countDocuments();
        const totalPages = Math.ceil(total/pageSize);

        const posts = await Post.find().sort("-date")
        .limit(pageSize)
        .skip(pageSize * page);

        res.send({posts, totalPages});
    } catch (error) {
        console.log(error);
        res.status(500).send("Serverr Error")
    }
});

// @route    POST api/posts
// @desc     Add a post
// @access   Private
router.post("/", auth, 
upload.single("image"),
[check("title", "Title is required").notEmpty()
], 
async (req, res) => {
    // uploaded(req, res, function(err) {
    //     if (err instanceof multer.MulterError) {
    //         return req.send({"Error": err})
    //     } else if (err) {
    //         return res.send("Error")
    //     } 
    // })
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    try {
        const user = await User.findById(req.user.id).select("-password");

        if(req.file) {
            const newPost = new Post({
                user: req.user.id,
                title: req.body.title,
                name: user.name,
                image: req.file.location,
                contents: {
                    subHeader: req.body.subHeader,
                    text: req.body.text
                }
            })

            const post = await newPost.save();
            await post.save();

            res.json(post);
        } else {
            const newPost = new Post({
                user: req.user.id,
                title: req.body.title,
                name: user.name,
                image: "",
                contents: {
                    subHeader: req.body.subHeader,
                    text: req.body.text
                }
            })
            const post = await newPost.save();
            await post.save();

            res.json(post);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("error", error)
    }
});

// @route    Get api/posts/:id
// @desc     Get a post
// @access   Public
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).send({ msg: "Post not found" });
        };

        res.json(post)
    } catch (error) {
        res.status(500).json({ error});
    }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete("/:id", auth, async (req, res) => {
    try {
        const user = req.user.id;

        const post = await Post.findById(req.params.id);
    
        if(!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        if(user !== post.user.toString()) {
            return res.status(401).send("Not allowed")
        }

        // Remove post from database
        await post.deleteOne();

        // Remove post image from S3
        if(post.image) {
            const imageUrl = post.image;
            const key = imageUrl.substring(imageUrl.lastIndexOf("/") + 1)
            await deleteFile(key);
        }
        

        res.status(201).send("Delete successful");

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error");
    }
});

// @route    PUT api/posts/:id
// @desc     Update a post
// @access   Private

router.put("/:id", auth, 
upload.single("image"),
[check("title", "Title is required").notEmpty(),
check("text", "Text is required").notEmpty()],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ msg: "Invalid entry" })
    }

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const post = await Post.findById(req.params.id)

    try {
        // Update when file is uploaded
        if(req.file) {
            // Remove old image from S3
            if(post.image) {
                const imageUrl = post.image;
                const key = imageUrl.substring(imageUrl.lastIndexOf("/") + 1)
                await deleteFile(key);
            }

            const updatePost = ({
                title: req.body.title,
                image: req.file.location,
                contents: {
                    subHeader: req.body.subHeader,
                    text: req.body.text
                }
            })
            const updatePosts = await Post.findByIdAndUpdate( req.params.id, {$set: updatePost}, { new: true});
            res.send(updatePosts)
            
        } else {
            // Update when no file is uploaded
            const updatePost = ({
                title: req.body.title,
                contents: {
                    subHeader: req.body.subHeader,
                    text: req.body.text
                }
            })
            const updatePosts = await Post.findByIdAndUpdate( req.params.id, {$set: updatePost}, { new: true});
            res.send(updatePosts)
        }

    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error", error);
    }
});

// @route    POST api/posts/comment/:id
// @desc     comment a post
// @access   Private
router.post("/comment/:id", auth, 
    check("text", "Text is empty").notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const post = await Post.findById(req.params.id);
            const user = await User.findById(req.user.id).select("-password");
    
            const newComment = {
                text: req.body.text,
                name: user.name,
                user: req.user.id
            };
    
            post.comments.unshift(newComment);
    
            await post.save();
        
            res.json(post.comments)
        } catch (error) {
            console.log(error);
            res.status(500).send("Server Error")
        }
})

// @route    Delete api/posts/comment/:id/:comment_id
// @desc     comment a post
// @access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);

    // Pull out the comment
    const comment = post.comments.find((comment) => comment.id === req.params.comment_id);

    // Check comment exist
    if(!comment) {
        return res.status(400).json({ msg: "Comment does not exist" })
    };
    
    if(req.user.id !== comment.user.toString()) {
        return res.status(401).json({ msg: "Not authorize" })
    }

    post.comments = post.comments.filter(({id}) => id !== req.params.comment_id);

    await post.save();

    res.json(post.comments)
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      // Check if the post has already been liked
      if (post.likes.some((like) => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: 'Post already liked' });
      }
      
      post.likes.unshift({ user: req.user.id });
  
      await post.save();

      return res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // @route    PUT api/posts/unlike/:id
  // @desc     Unlike a post
  // @access   Private
  router.put('/unlike/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      // Check if the post has not yet been liked
      if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: 'Post has not yet been liked' });
      }
  
      // remove the like
      post.likes = post.likes.filter(
        ({ user }) => user.toString() !== req.user.id
      );
  
      await post.save();
  
      return res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;