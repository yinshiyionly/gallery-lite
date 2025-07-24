const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// MongoDB 连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gallery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 媒体资源模型
const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  category: { type: String, default: 'general' },
  createdAt: { type: Date, default: Date.now }
});

const Media = mongoose.model('Media', mediaSchema);

// API 路由
app.get('/api/media', async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/media/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/media', async (req, res) => {
  try {
    const media = new Media(req.body);
    await media.save();
    res.status(201).json(media);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});