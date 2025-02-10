const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongoDbStringHere', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    farmingType: { 
        type: String, 
        required: true, 
        enum: [
            "agriculture",
            "horticulture",
            "floriculture",
            "sericulture",
            "apiculture",
            "aquaculture",
            "mariculture",
            "poultry",
            "dairy",
            "livestock",
            "mixed",
            "agroforestry",
            "organic",
            "urban",
            "precision",
            "hydroponics",
            "aeroponics",
            "aquaponics",
            "vertical",
            "mechanized",
            "permaculture"
          ] 
    },
    sections: [{ subHeading: String, text: String, imageUrl: String }],
    createdAt: { type: Date, default: Date.now },
    author: {
        name: { type: String, required: true },
        email: { type: String, required: true }
    }
});

const Post = mongoose.model('Post', postSchema);
const farmingTypeEnum = postSchema.path('farmingType').enumValues;

// Create a new post
app.post('/api/posts', async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).send(post);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Get posts by farmingType
app.get('/api/posts', async (req, res) => {
    const farmingType = req.query.farmingType;
    if (!farmingType) {
        return res.status(400).send({ error: 'farmingType query parameter is required' });
    }
    if (!farmingTypeEnum.includes(farmingType)) {
        return res.status(400).send({ error: `Invalid farmingType. Allowed values: ${farmingTypeEnum.join(', ')}` });
    }
    try {
        const posts = await Post.find({ farmingType }).select("title _id createdAt sections");
        res.send(posts.map(post => ({ id: post._id, title: post.title, createdAt: post.createdAt, sections: post.sections })));
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Get post by ID
app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }
        res.send(post);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update post by ID
app.put('/api/posts/:id', async (req, res) => {
    console.log("in update post");
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }
        res.send(post);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});



// Delete post by ID
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }
        res.send({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
