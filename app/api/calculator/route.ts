import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const { productCost, shippingCost, platformFee, otherCost, sellingPrice } = body
  
  // 计算利润
  const totalCost = (productCost || 0) + (shippingCost || 0) + (platformFee || 0) + (otherCost || 0)
  const profit = (sellingPrice || 0) - totalCost
  const profitMargin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0
  
  // 评估结果
  let recommendation = ''
  let score = 0
  
  if (profitMargin >= 30) {
    recommendation = '✅ 利润率优秀，强烈建议入场'
    score = 90 + Math.floor(Math.random() * 10)
  } else if (profitMargin >= 20) {
    recommendation = '✅ 利润率良好，建议入场'
    score = 75 + Math.floor(Math.random() * 15)
  } else if (profitMargin >= 10) {
    recommendation = '⚠️ 利润率一般，建议优化成本后入场'
    score = 50 + Math.floor(Math.random() * 25)
  } else if (profitMargin > 0) {
    recommendation = '❌ 利润率过低，不建议入场'
    score = 20 + Math.floor(Math.random() * 30)
  } else {
    recommendation = '❌ 亏损，绝对不建议入场'
    score = Math.floor(Math.random() * 20)
  }
  
  return NextResponse.json({
    success: true,
    data: {
      totalCost: parseFloat(totalCost.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      profitMargin: parseFloat(profitMargin.toFixed(2)),
      recommendation,
      score,
      timestamp: new Date().toISOString()
    }
  })
}