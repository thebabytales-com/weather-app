"use client"

import { useState } from 'react'

// 类型定义
interface KeywordData {
  keyword: string
  searchVolume: number
  competition: number
  trend: 'up' | 'down' | 'stable'
  relatedKeywords: string[]
}

interface ProductAnalysis {
  keyword: string
  score: number
  opportunity: 'high' | 'medium' | 'low'
  risk: string
  recommendation: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'calculator' | 'ai'>('search')
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<KeywordData | null>(null)
  
  // 利润计算器状态
  const [productCost, setProductCost] = useState(0)
  const [shippingCost, setShippingCost] = useState(0)
  const [platformFee, setPlatformFee] = useState(0)
  const [otherCost, setOtherCost] = useState(0)
  const [sellingPrice, setSellingPrice] = useState(0)
  
  // AI 推荐状态
  const [aiResult, setAiResult] = useState<ProductAnalysis | null>(null)

  // 关键词搜索（真实 API）
  const handleSearch = async () => {
    if (!keyword.trim()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/keyword/${encodeURIComponent(keyword)}`)
      const result = await response.json()
      
      if (result.success) {
        setSearchResult(result.data)
      } else {
        alert('搜索失败，请重试')
      }
    } catch (error) {
      console.error('搜索失败:', error)
      alert('搜索失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 计算利润
  const calculateProfit = () => {
    const totalCost = productCost + shippingCost + platformFee + otherCost
    const profit = sellingPrice - totalCost
    const profitMargin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0
    
    return {
      totalCost,
      profit,
      profitMargin
    }
  }

  // AI 推荐（真实 API）
  const handleAIAnalysis = async () => {
    if (!keyword.trim()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setAiResult(result.data)
      } else {
        alert('AI 分析失败，请重试')
      }
    } catch (error) {
      console.error('AI 分析失败:', error)
      alert('AI 分析失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const profit = calculateProfit()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h1 className="text-xl font-bold text-gray-900">PickAI</h1>
            <span className="text-sm text-gray-500">智能选品助手</span>
          </div>
          <div className="flex gap-4">
            <button className="text-sm text-gray-600 hover:text-gray-900">登录</button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition">
              立即订阅
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'search'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔍 关键词分析
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'calculator'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🧮 利润计算器
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'ai'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            ✨ AI 智能推荐
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">关键词热度分析</h2>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="输入关键词，例如：wireless earbuds"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {isLoading ? '分析中...' : '分析'}
              </button>
            </div>

            {searchResult && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">月搜索量</div>
                  <div className="text-2xl font-bold text-primary">{searchResult.searchVolume.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">竞争程度</div>
                  <div className="text-2xl font-bold text-green-600">{searchResult.competition}/100</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">趋势</div>
                  <div className={`text-2xl font-bold ${
                    searchResult.trend === 'up' ? 'text-green-600' : 
                    searchResult.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {searchResult.trend === 'up' ? '📈 上升' : 
                     searchResult.trend === 'down' ? '📉 下降' : '➡️ 稳定'}
                  </div>
                </div>
              </div>
            )}

            {searchResult && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">相关关键词</h3>
                <div className="flex flex-wrap gap-2">
                  {searchResult.relatedKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">利润计算器</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商品成本 ($)</label>
                  <input
                    type="number"
                    value={productCost || ''}
                    onChange={(e) => setProductCost(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">物流费用 ($)</label>
                  <input
                    type="number"
                    value={shippingCost || ''}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">平台费用 ($)</label>
                  <input
                    type="number"
                    value={platformFee || ''}
                    onChange={(e) => setPlatformFee(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">其他费用 ($)</label>
                  <input
                    type="number"
                    value={otherCost || ''}
                    onChange={(e) => setOtherCost(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">售价 ($)</label>
                  <input
                    type="number"
                    value={sellingPrice || ''}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">总成本</span>
                    <span className="font-medium">${profit.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">利润</span>
                    <span className={`font-medium ${profit.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${profit.profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-medium">利润率</span>
                    <span className={`text-xl font-bold ${profit.profitMargin >= 20 ? 'text-green-600' : profit.profitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {profit.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  {profit.profitMargin >= 30 && '✅ 利润率优秀，建议入场'}
                  {profit.profitMargin >= 20 && profit.profitMargin < 30 && '✅ 利润率良好，可以考虑'}
                  {profit.profitMargin >= 10 && profit.profitMargin < 20 && '⚠️ 利润率一般，需优化成本'}
                  {profit.profitMargin < 10 && profit.profitMargin > 0 && '❌ 利润率过低，不建议'}
                  {profit.profitMargin <= 0 && '❌ 亏损，不建议'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">✨ AI 智能选品推荐</h2>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="输入想分析的产品关键词"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleAIAnalysis()}
              />
              <button
                onClick={handleAIAnalysis}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
              >
                {isLoading ? 'AI 分析中...' : 'AI 分析'}
              </button>
            </div>

            {aiResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <div className="text-sm text-gray-500">AI 评分</div>
                    <div className="text-3xl font-bold text-primary">{aiResult.score}/100</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    aiResult.opportunity === 'high' ? 'bg-green-100 text-green-700' :
                    aiResult.opportunity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {aiResult.opportunity === 'high' ? '🔥 高机会' : 
                     aiResult.opportunity === 'medium' ? '📊 中等机会' : '❄️ 低机会'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium mb-2">⚠️ 风险提示</div>
                  <p className="text-gray-600">{aiResult.risk}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="font-medium mb-2">💡 AI 建议</div>
                  <p className="text-gray-700">{aiResult.recommendation}</p>
                </div>
              </div>
            )}

            {!aiResult && !isLoading && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-4">🤖</div>
                <p>输入关键词，让 AI 为你分析选品机会</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © 2026 PickAI - 智能选品助手
        </div>
      </footer>
    </main>
  )
}