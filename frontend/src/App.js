import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';

const API_URL = '/api/artworks';

// 主应用组件
const App = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  // 使用 useEffect Hook 在组件加载时获取数据
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArtworks(data);
      } catch (e) {
        console.error("Failed to fetch artworks:", e);
        setError("无法加载艺术作品，请检查后端服务。");
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
    setLastUpdated(new Date().toLocaleString());
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <CircularProgress />
        <Typography className="ml-4" variant="h6">
          正在加载艺术作品...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        <Alert severity="error" className="w-full max-w-md text-center">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
        {/* 项目信息展示区 - 根据你提供的 HTML 修改 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Hello from My Tech Portfolio Demo!</h1>
          <p className="text-gray-600 text-lg mb-6">
            This website demonstrates cloud-native automation using Docker, Kubernetes on Azure, and CI/CD with GitHub Actions.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: <span id="last-updated">{lastUpdated}</span>
          </p>
        </div>
        
        {/* 艺术作品展示区 */}
        <div className="data-container border-t pt-8 mt-8">
          <h2 className="text-3xl font-semibold text-blue-500 mb-6">精选艺术作品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <Card 
                key={artwork.id} 
                className="artwork-card transition-transform duration-200 hover:scale-105 shadow-md hover:shadow-xl"
              >
                <CardContent className="flex flex-col h-full">
                  <h3 className="text-xl font-bold text-indigo-800 mb-2">{artwork.title}</h3>
                  <p className="artwork-artist text-gray-500 italic mb-1">作者: {artwork.artist}</p>
                  <p className="artwork-price text-green-600 text-2xl font-extrabold mb-4">¥{artwork.price.toFixed(2)}</p>
                  <p className="text-gray-700 flex-grow">{artwork.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
