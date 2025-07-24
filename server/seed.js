const mongoose = require('mongoose');
require('dotenv').config();

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gallery');

// 媒体资源模型
const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  category: { type: String, default: 'general' },
  createdAt: { type: Date, default: Date.now }
});

const Media = mongoose.model('Media', mediaSchema);

// 示例数据
const sampleData = [
  {
    title: '美丽的风景',
    description: '这是一张美丽的自然风景照片',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
    category: 'nature'
  },
  {
    title: '城市夜景',
    description: '繁华都市的夜晚灯火',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500',
    category: 'city'
  },
  {
    title: '艺术作品',
    description: '现代艺术的精美展示',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500',
    category: 'art'
  }
];

async function seedDatabase() {
  try {
    // 清空现有数据
    await Media.deleteMany({});
    
    // 插入示例数据
    await Media.insertMany(sampleData);
    
    console.log('数据库初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

seedDatabase();