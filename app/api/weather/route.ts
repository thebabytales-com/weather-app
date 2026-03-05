import { NextRequest, NextResponse } from 'next/server';

// Open-Meteo API - 免费，无需 API key
const OPEN_METEO_API = 'https://api.open-meteo.com/v1';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  try {
    let latitude = lat;
    let longitude = lon;

    // 如果提供了城市名，先地理编码
    if (city && !lat) {
      const geoResponse = await fetch(
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`
      );
      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        return NextResponse.json(
          { error: '未找到该城市' },
          { status: 404 }
        );
      }

      latitude = geoData.results[0].latitude.toString();
      longitude = geoData.results[0].longitude.toString();
    }

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: '请提供城市名或经纬度' },
        { status: 400 }
      );
    }

    // 获取天气数据
    const weatherResponse = await fetch(
      `${OPEN_METEO_API}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
    );
    
    const weatherData = await weatherResponse.json();

    // 获取城市名（如果是通过坐标查询）
    let cityName = city;
    if (!cityName && lat) {
      const reverseGeoResponse = await fetch(
        `${GEOCODING_API}?latitude=${lat}&longitude=${lon}&count=1&language=zh&format=json`
      );
      const reverseGeoData = await reverseGeoResponse.json();
      if (reverseGeoData.results && reverseGeoData.results.length > 0) {
        cityName = reverseGeoData.results[0].name;
      }
    }

    return NextResponse.json({
      current: weatherData.current,
      daily: weatherData.daily,
      location: {
        name: cityName,
        latitude,
        longitude
      }
    });

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: '获取天气数据失败' },
      { status: 500 }
    );
  }
}
