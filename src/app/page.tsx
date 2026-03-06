'use client';
import { useState, useEffect } from 'react';

interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  humidity: string;
  wind: string;
  icon: string;
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('Beijing');

  // 获取天气数据
  const fetchWeather = async (location: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
      const data = await res.json();
      
      const current = data.current_condition[0];
      setWeather({
        location: data.nearest_area[0].areaName[0].value,
        temperature: `${current.temp_C}°C / ${current.temp_F}°F`,
        condition: current.weatherDesc[0].value,
        humidity: `${current.humidity}%`,
        wind: `${current.windspeedKmph} km/h`,
        icon: current.weatherIconUrl[0].value,
      });
    } catch (error) {
      console.error('获取天气失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索城市
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      setSearchCity(city.trim());
    }
  };

  // 自动定位
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (error) => {
          console.error('定位失败:', error);
          fetchWeather('Beijing');
        }
      );
    } else {
      fetchWeather('Beijing');
    }
  };

  useEffect(() => {
    fetchWeather(searchCity);
  }, [searchCity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold text-center mb-6">🌤️ 天气查询</h1>

        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="输入城市名称..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-all font-medium"
            >
              搜索
            </button>
          </div>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="w-full mt-2 px-4 py-2 bg-blue-500/50 hover:bg-blue-500/70 rounded-full transition-all text-sm"
          >
            📍 自动定位
          </button>
        </form>

        {/* 天气信息 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
            <p>正在获取天气数据...</p>
          </div>
        ) : weather ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">{weather.location}</h2>
            <div className="flex items-center justify-center mb-4">
              <img src={weather.icon} alt={weather.condition} className="w-24 h-24" />
            </div>
            <div className="text-5xl font-bold mb-2">{weather.temperature}</div>
            <p className="text-xl mb-6">{weather.condition}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm opacity-80 mb-1">湿度</p>
                <p className="text-xl font-semibold">{weather.humidity}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm opacity-80 mb-1">风速</p>
                <p className="text-xl font-semibold">{weather.wind}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-200">
            <p>获取天气失败，请重试</p>
          </div>
        )}

        {/* 底部 */}
        <div className="mt-8 text-center text-sm opacity-70">
          <p>数据来源: wttr.in</p>
        </div>
      </div>
    </div>
  );
}
