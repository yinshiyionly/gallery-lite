import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/media');
      setMedia(response.data);
      setError(null);
    } catch (err) {
      setError('获取媒体资源失败');
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>多端画廊</h1>
        <p>精美的图片展示平台</p>
      </header>

      {media.length === 0 ? (
        <div className="loading">暂无媒体资源</div>
      ) : (
        <div className="gallery-grid">
          {media.map((item) => (
            <div key={item._id} className="media-card">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="media-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=图片加载失败';
                }}
              />
              <div className="media-content">
                <h3 className="media-title">{item.title}</h3>
                {item.description && (
                  <p className="media-description">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;