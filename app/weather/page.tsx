'use client';

import { useState, useEffect } from 'react';

// 天气代码映射
const weatherCodes: Record<number, { text: string; icon: string }> = {
  0: { text: '晴朗', icon: '☀️' },
  1: { text: '多云', icon: '🌤️' },
  2: { text: '阴天', icon: '☁️' },
  3: { text: '阴', icon: '☁️' },
  45: { text: '雾', icon: '🌫️' },
  48: { text: '雾凇', icon: '🌫️' },
  51: { text: '毛毛雨', icon: '🌧️' },
  53: { text: '毛毛雨', icon: '🌧️' },
  55: { text: '毛毛雨', icon: '🌧️' },
  61: { text: '小雨', icon: '🌧️' },
  63: { text: '中雨', icon: '🌧️' },
  65: { text: '大雨', icon: '🌧️' },
  71: { text: '小雪', icon: '🌨️' },
  73: { text: '中雪', icon: '🌨️' },
  75: { text: '大雪', icon: '🌨️' },
  80: { text: '阵雨', icon: '🌦️' },
  81: { text: '中阵雨', icon: '🌦️' },
  82: { text: '大阵雨', icon: '🌦️' },
  95: { text: '雷雨', icon: '⛈️' },
  96: { text: '雷阵雨', icon: '⛈️' },
  99: { text: '雷阵雨', icon: '⛈️' },
};

function getWeatherInfo(code: number) {
  return weatherCodes[code] || { text: '未知', icon: '❓' };
}

export default function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{ lat: string; lon: string } | null>(null);

  // 获取当前位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString();
          const lon = position.coords.longitude.toString();
          setLocation({ lat, lon });
          fetchWeather(lat, lon);
        },
        (err) => {
          console.log('无法获取位置，请手动输入城市');
          setError('无法获取您的位置，请搜索城市');
        }
      );
    }
  }, []);

  const fetchWeather = async (lat?: string, lon?: string, cityName?: string) => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (cityName) params.set('city', cityName);
      if (lat) params.set('lat', lat);
      if (lon) params.set('lon', lon);

      const res = await fetch(`/api/weather?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '获取天气失败');
      }

      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取天气失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(undefined, undefined, city.trim());
    }
  };

  const currentWeather = weather?.current ? getWeatherInfo(weather.current.weather_code) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      <div className="max-w-md mx-auto">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          🌤️ 天气 H5
        </h1>

        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="搜索城市..."
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 text-gray-800"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50 transition-colors"
            >
              {loading ? '加载中...' : '搜索'}
            </button>
          </div>
        </form>

        {/* 错误信息 */}
        {error && (
          <div className="bg-red-500/20 border border-red-300 text-white px-4 py-3 rounded-lg mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* 天气卡片 */}
        {weather && !loading && (
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-white">
            {/* 城市名 */}
            <h2 className="text-2xl font-bold text-center mb-4">
              {weather.location.name || '当前位置'}
            </h2>

            {/* 当前天气 */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">{currentWeather?.icon}</div>
              <div className="text-5xl font-bold mb-2">
                {Math.round(weather.current.temperature_2m)}°C
              </div>
              <div className="text-lg opacity-90">{currentWeather?.text}</div>
            </div>

            {/* 详细信息 */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm opacity-80">体感温度</div>
                <div className="text-lg font-semibold">
                  {Math.round(weather.current.apparent_temperature)}°C
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm opacity-80">湿度</div>
                <div className="text-lg font-semibold">
                  {weather.current.relative_humidity_2m}%
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm opacity-80">风速</div>
                <div className="text-lg font-semibold">
                  {weather.current.wind_speed_10m} km/h
                </div>
              </div>
            </div>

            {/* 天气预报 */}
            {weather.daily && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">未来天气</h3>
                <div className="space-y-2">
                  {weather.daily.time.slice(0, 3).map((date: string, index: number) => {
                    const maxTemp = Math.round(weather.daily.temperature_2m_max[index]);
                    const minTemp = Math.round(weather.daily.temperature_2m_min[index]);
                    const weatherInfo = getWeatherInfo(weather.daily.weather_code[index]);
                    const day = new Date(date).toLocaleDateString('zh-CN', { weekday: 'short' });
                    
                    return (
                      <div key={date} className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                        <span className="font-medium">{day}</span>
                        <span className="text-xl">{weatherInfo.icon}</span>
                        <span>{weatherInfo.text}</span>
                        <span className="font-semibold">
                          {maxTemp}° / {minTemp}°
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="text-center text-white text-lg mt-8">
            正在获取天气数据...
          </div>
        )}

        {/* 底部 */}
        <div className="text-center text-white/70 text-sm mt-8">
          天气数据由 Open-Meteo 提供
        </div>
      </div>
    </div>
  );
}
