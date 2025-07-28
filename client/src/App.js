import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

function App() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observer = useRef();

  const ITEMS_PER_PAGE = 12; // 每页显示12个项目

  useEffect(() => {
    fetchMedia(1, true);

    // 监听滚动事件，显示/隐藏回到顶部按钮
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchMedia = async (pageNum = 1, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await axios.get(`/api/media?page=${pageNum}&limit=${ITEMS_PER_PAGE}`);
      const newMedia = response.data.media || response.data;
      const total = response.data.total || newMedia.length;

      console.log(`客户端接收数据: Page ${pageNum}, 新数据数量: ${newMedia.length}, 总数: ${total}`);
      console.log('新数据IDs:', newMedia.map(item => item._id.slice(-6)));

      if (isInitial) {
        setMedia(newMedia);
        console.log('初始化数据，设置媒体列表');
      } else {
        setMedia(prev => {
          const combined = [...prev, ...newMedia];
          console.log(`合并数据: 之前${prev.length}个 + 新增${newMedia.length}个 = 总共${combined.length}个`);
          return combined;
        });
      }

      // 检查是否还有更多数据
      setHasMore(pageNum * ITEMS_PER_PAGE < total);
      setError(null);
    } catch (err) {
      setError('获取媒体资源失败');
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 无限滚动的最后一个元素引用回调
  const lastMediaElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchMedia(nextPage, false);
          return nextPage;
        });
      }
    }, {
      rootMargin: '100px' // 提前100px开始加载
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

      {media.length === 0 && !loading ? (
        <div className="loading">暂无媒体资源</div>
      ) : (
        <>
          <div className="gallery-grid">
            {media.map((item, index) => (
              <div
                key={item._id}
                className="media-card"
                ref={index === media.length - 1 ? lastMediaElementRef : null}
              >
                <div className="media-image-container">
                  <img
                    src={item.hd_url}
                    alt={item.title || item.code}
                    className="media-image"
                    onLoad={(e) => {
                      e.target.classList.add('loaded');
                    }}
                    onError={(e) => {
                      // 如果高清图片加载失败，尝试原始图片
                      if (e.target.src !== item.origin_url) {
                        e.target.src = item.origin_url;
                      } else {
                        e.target.src = 'https://via.placeholder.com/300x200?text=图片加载失败';
                      }
                    }}
                  />
                </div>
                <div className="media-content">
                  <h3 className="media-title">{item.title || item.code}</h3>
                  {item.description && (
                    <p className="media-description">{item.description}</p>
                  )}
                  <p className="media-code">代码: {item.code}</p>
                </div>
              </div>
            ))}
          </div>

          {loadingMore && (
            <div className="loading">加载更多...</div>
          )}

          {!hasMore && media.length > 0 && (
            <div className="loading">已加载全部内容</div>
          )}
        </>
      )}

      {/* 回到顶部按钮 */}
      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

export default App;