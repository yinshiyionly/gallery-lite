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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aa');

// 媒体资源模型 - 根据实际数据库结构
const mediaSchema = new mongoose.Schema({
  code: { type: String, required: true },
  origin_url: { type: String, required: true },
  hd_url: { type: String, required: true },
  title: String, // 可选字段，用于显示
  description: String, // 可选字段，用于显示
  createdAt: { type: Date, default: Date.now }
}, { collection: 'hd_cover' });

const Media = mongoose.model('hd_cover', mediaSchema);

// API 路由
app.get('/api/media', async (_req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    console.log(media)
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
    const { code, origin_url, hd_url, title, description } = req.body;

    // 验证必需字段
    if (!code || !origin_url || !hd_url) {
      return res.status(400).json({
        error: 'code, origin_url, hd_url 是必需字段'
      });
    }

    const media = new Media({
      code,
      origin_url,
      hd_url,
      title,
      description
    });

    await media.save();
    res.status(201).json(media);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});