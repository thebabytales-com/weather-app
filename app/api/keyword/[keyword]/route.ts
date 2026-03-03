import { NextRequest, NextResponse } from 'next/server'

// 模拟关键词搜索数据
const mockKeywordData = {
  searchVolume: Math.floor(Math.random() * 50000) + 5000,
  competition: Math.floor(Math.random() * 100),
  trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
  relatedKeywords: [
    'for men',
    '2024',
    'best',
    'reviews'
  ],
  cpc: (Math.random() * 2 + 0.5).toFixed(2),
  opportunityScore: Math.floor(Math.random() * 30) + 70
}

export async function GET(
  request: NextRequest,
  { params }: { params: { keyword: string } }
) {
  const keyword = decodeURIComponent(params.keyword)
  
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const data = {
    keyword: keyword,
    ...mockKeywordData,
    relatedKeywords: mockKeywordData.relatedKeywords.map(kw => `${keyword} ${kw}`),
    timestamp: new Date().toISOString()
  }
  
  return NextResponse.json({
    success: true,
    data: data
  })
}