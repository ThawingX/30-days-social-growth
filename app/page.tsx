'use client'

import { useState, useEffect } from 'react'
import { Globe, Twitter, Instagram, Linkedin, Github, ExternalLink, Calendar, Target, TrendingUp, Users, Clock, RefreshCw, Zap } from 'lucide-react'

interface Post {
  title: string
  url: string
  type: string
}

interface DayData {
  date: string
  followerGrowth: number
  posts: Post[]
}

interface DailyDataType {
  lastUpdated: string
  updateSchedule: string
  totalStats: {
    totalFollowerGrowth: number
    totalPosts: number
  }
  dailyData: { [key: string]: DayData }
}

const Calendar2024September = ({ dailyData, onDayClick, activeTab }: { dailyData: { [key: string]: DayData }, onDayClick: (day: number) => void, activeTab: string }) => {
  const daysInMonth = 30
  const firstDayOfWeek = 0 // September 1, 2024 is a Sunday
  const today = new Date().getDate()
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const isCurrentMonth = currentMonth === 8 && currentYear === 2024 // September is month 8
  
  // 计算进度背景颜色
  const getProgressBackground = (day: number) => {
    if (!isCurrentMonth || day > today) return ''
    const progress = (day / daysInMonth) * 100
    return `linear-gradient(to right, rgba(71, 146, 230, 0.3) ${progress}%, transparent ${progress}%)`
  }

  const days = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 md:h-32"></div>)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === today
    const isPast = isCurrentMonth && day < today
    const dayData = dailyData && dailyData[day.toString()]
    const hasData = dayData && dayData.followerGrowth !== undefined
    
    days.push(
      <div
        key={day}
        onClick={() => onDayClick(day)}
        className={`h-24 md:h-32 border-2 border-black p-2 cursor-pointer transition-all duration-150 hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
          isToday
            ? 'bg-accent text-white shadow-brutal'
            : isPast && hasData
            ? 'bg-green-100 shadow-brutal'
            : isPast
            ? 'bg-gray-200 text-gray-600 shadow-brutal'
            : 'bg-white shadow-brutal hover:bg-yellow-100'
        }`}
        style={{
          background: getProgressBackground(day) || undefined
        }}
      >
        <div className="h-full flex flex-col justify-between">
          <div className="font-bold text-lg">{day}</div>
          {hasData && (
            <div className="text-xs space-y-1">
              <div className="font-semibold text-accent">
                +{dayData.followerGrowth} 粉丝
              </div>
              {dayData.posts.length > 0 && (
                <div className="space-y-1">
                  {dayData.posts.slice(0, 2).map((post, idx) => (
                    <div key={idx} className="text-xs truncate font-medium">
                      {post.title}
                    </div>
                  ))}
                  {dayData.posts.length > 2 && (
                    <div className="text-xs text-gray-600">
                      +{dayData.posts.length - 2} 更多
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-7 gap-3 md:gap-4">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="h-12 bg-black text-white flex items-center justify-center font-bold text-base md:text-lg">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  )
}

export default function Home() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')
  const [dailyDataState, setDailyDataState] = useState<DailyDataType | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'dylan' | 'yanxu' | 'official'>('dylan')

  // 实时计算总粉丝增长和发布内容数
  const calculateTotalStats = (dailyData: { [key: string]: DayData }) => {
    let totalFollowerGrowth = 0
    let totalPosts = 0
    
    Object.values(dailyData).forEach(dayData => {
      totalFollowerGrowth += dayData.followerGrowth
      totalPosts += dayData.posts.length
    })
    
    return { totalFollowerGrowth, totalPosts }
  }

  useEffect(() => {
    // Load data based on active tab
    const dataFiles = {
      dylan: '/data/dylan-data.json',
      yanxu: '/data/yanxu-data.json',
      official: '/data/official-data.json'
    }
    
    fetch(dataFiles[activeTab])
      .then(response => response.json())
      .then(data => setDailyDataState(data))
      .catch(error => console.error('Error loading daily data:', error))
  }, [activeTab])

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
    setShowModal(true)
  }

  const formatLastUpdated = (dateString: string) => {
    // 获取昨天晚上8点的时间
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(20, 0, 0, 0) // 设置为晚上8点
    
    return yesterday.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Shanghai'
    })
  }

  const content = {
    zh: {
      title: '30天社媒增长实验',
      subtitle: '从0到2000粉丝的公开挑战',
      description: '这是一个完全公开透明的30天社交媒体增长实验。我们将展示如何在30天内从0起号达到2000粉丝，证明冷启动不是运气，而是有方法可循。',
      experiment: {
        phase1: 'Day 1-10: 探索期',
        phase1Desc: '尝试不同类型内容，寻找最佳方向',
        phase2: 'Day 11-20: 优化期', 
        phase2Desc: '根据数据调整选题、频率和互动方式',
        phase3: 'Day 21-30: 冲刺期',
        phase3Desc: '加大互动 + 矩阵联动 + X-Pilot助力'
      },
      socialLinks: '社交媒体',
      productLinks: '产品链接',
      currentProgress: '当前进度',
      followerGrowth: '粉丝增长',
      posts: '发布内容'
    },
    en: {
      title: '30-Day Social Growth Experiment',
      subtitle: 'Public Challenge: 0 to 2000 Followers',
      description: 'This is a completely open and transparent 30-day social media growth experiment. We will demonstrate how to grow from 0 to 2000 followers in 30 days, proving that cold start is not about luck, but about methodology.',
      experiment: {
        phase1: 'Day 1-10: Exploration Phase',
        phase1Desc: 'Try different content types to find the best direction',
        phase2: 'Day 11-20: Optimization Phase',
        phase2Desc: 'Adjust topics, frequency and engagement based on data',
        phase3: 'Day 21-30: Sprint Phase', 
        phase3Desc: 'Increase engagement + Matrix synergy + X-Pilot boost'
      },
      socialLinks: 'Social Media',
      productLinks: 'Product Links',
      currentProgress: 'Current Progress',
      followerGrowth: 'Follower Growth',
      posts: 'Posts'
    }
  }

  const t = content[language]
  
  // 获取实时计算的统计数据
  const realTimeStats = dailyDataState?.dailyData 
    ? calculateTotalStats(dailyDataState.dailyData) 
    : { totalFollowerGrowth: 0, totalPosts: 0 }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent border-2 border-black flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                {t.title}
              </h1>
            </div>
            <button
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="btn-brutal flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'zh' ? 'EN' : '中文'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">
            {t.subtitle}
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed">
              {t.description}
            </p>
          </div>
        </section>

        {/* Update Info */}
        {dailyDataState && (
          <section className="bg-yellow-100 border-2 border-black p-4 card-brutal">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-accent" />
                <span className="font-semibold">
                  {language === 'zh' ? '每天晚上8点(UTC+8)更新数据' : 'Data updated daily at 8 PM (UTC+8)'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-accent" />
                <span className="text-sm">
                  {language === 'zh' ? '上次更新: ' : 'Last Updated: '}
                  {formatLastUpdated(dailyDataState.lastUpdated)}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Progress Cards */}
        <section className="grid grid-cols-1 gap-6">
          <div className="card-brutal p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 font-medium">
                {language === 'zh' ? '所有账号合计数据 (Dylan + Yanxu + 官号)' : 'Combined Data from All Accounts (Dylan + Yanxu + Official)'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <Users className="w-8 h-8 mx-auto mb-4 text-accent" />
                <h3 className="text-2xl font-bold mb-2">
                  {realTimeStats.totalFollowerGrowth}
                </h3>
                <p className="font-semibold uppercase tracking-wide">{t.followerGrowth}</p>
              </div>
              <div>
                <Calendar className="w-8 h-8 mx-auto mb-4 text-accent" />
                <h3 className="text-2xl font-bold mb-2">
                  {realTimeStats.totalPosts}
                </h3>
                <p className="font-semibold uppercase tracking-wide">{t.posts}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Experiment Phases */}
        <section className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-tight">
            实验阶段 / Experiment Phases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-brutal-accent p-6 text-white">
              <h3 className="text-xl font-bold mb-3 uppercase">{t.experiment.phase1}</h3>
              <p className="leading-relaxed">{t.experiment.phase1Desc}</p>
            </div>
            <div className="card-brutal p-6">
              <h3 className="text-xl font-bold mb-3 uppercase">{t.experiment.phase2}</h3>
              <p className="leading-relaxed">{t.experiment.phase2Desc}</p>
            </div>
            <div className="card-brutal p-6">
              <h3 className="text-xl font-bold mb-3 uppercase">{t.experiment.phase3}</h3>
              <p className="leading-relaxed">{t.experiment.phase3Desc}</p>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-tight">
            2024年9月 / September 2024
          </h2>
          
          {/* Tab Navigation */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('dylan')}
              className={`px-6 py-3 font-bold uppercase tracking-wide border-2 border-black transition-all duration-150 ${
                activeTab === 'dylan'
                  ? 'bg-accent text-white shadow-brutal'
                  : 'bg-white hover:bg-yellow-100 shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
              }`}
            >
              Dylan (产品视角)
            </button>
            <button
              onClick={() => setActiveTab('yanxu')}
              className={`px-6 py-3 font-bold uppercase tracking-wide border-2 border-black transition-all duration-150 ${
                activeTab === 'yanxu'
                  ? 'bg-accent text-white shadow-brutal'
                  : 'bg-white hover:bg-yellow-100 shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
              }`}
            >
              Yanxu (技术视角)
            </button>
            <button
              onClick={() => setActiveTab('official')}
              className={`px-6 py-3 font-bold uppercase tracking-wide border-2 border-black transition-all duration-150 ${
                activeTab === 'official'
                  ? 'bg-accent text-white shadow-brutal'
                  : 'bg-white hover:bg-yellow-100 shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
              }`}
            >
              官号
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'dylan' && (
              <div className="bg-blue-50 border-2 border-black p-6 card-brutal">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-accent">
                      {language === 'zh' ? 'Dylan - 产品视角' : 'Dylan - Product Perspective'}
                    </h3>
                    <p className="text-gray-700">
                      {language === 'zh' 
                        ? '专注于产品策略、用户增长和市场洞察的内容分享' 
                        : 'Focused on product strategy, user growth, and market insights'}
                    </p>
                  </div>
                  <div className="text-right flex space-x-8">
                    <div>
                      <div className="text-2xl font-bold text-accent">{realTimeStats.totalFollowerGrowth}</div>
                      <div className="text-sm text-gray-600">粉丝增长</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{realTimeStats.totalPosts}</div>
                      <div className="text-sm text-gray-600">发布内容</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'yanxu' && (
              <div className="bg-green-50 border-2 border-black p-6 card-brutal">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-accent">Yanxu - 技术视角</h3>
                    <p className="text-gray-700">分享技术实现、开发经验和工程思维</p>
                  </div>
                  <div className="text-right flex space-x-8">
                    <div>
                      <div className="text-2xl font-bold text-accent">{realTimeStats.totalFollowerGrowth}</div>
                      <div className="text-sm text-gray-600">粉丝增长</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{realTimeStats.totalPosts}</div>
                      <div className="text-sm text-gray-600">发布内容</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'official' && (
              <div className="bg-purple-50 border-2 border-black p-6 card-brutal">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-accent">官号</h3>
                    <p className="text-gray-700">官方账号的统一发声和品牌建设</p>
                  </div>
                  <div className="text-right flex space-x-8">
                    <div>
                      <div className="text-2xl font-bold text-accent">{realTimeStats.totalFollowerGrowth}</div>
                      <div className="text-sm text-gray-600">粉丝增长</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{realTimeStats.totalPosts}</div>
                      <div className="text-sm text-gray-600">发布内容</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Calendar2024September 
            dailyData={dailyDataState?.dailyData || {}}
            onDayClick={handleDayClick}
            activeTab={activeTab}
          />
        </section>

        {/* Links Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Dylan Social Media */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight border-b-2 border-black pb-2">
              Dylan 社交媒体
            </h2>
            <div className="space-y-4">
              <a href="https://x.com/xDylanLong" target="_blank" rel="noopener noreferrer" className="btn-brutal w-full flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Twitter className="w-5 h-5" />
                  <span>X Platform</span>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/x-dylan-long/" target="_blank" rel="noopener noreferrer" className="btn-brutal w-full flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="https://www.xiaohongshu.com/user/profile/5df3742d000000000100212a?xsec_token=ABB-hUzSWHi3qP2vaQuPCG1o0NwHNZLahv-gntfdcqxO8=&xsec_source=pc_note" target="_blank" rel="noopener noreferrer" className="btn-brutal w-full flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span>小红书</span>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Yanxu Social Media */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight border-b-2 border-black pb-2">
              Yanxu 社交媒体
            </h2>
            <div className="space-y-4">
              <div className="btn-brutal w-full flex items-center justify-center opacity-50">
                <span className="text-gray-500">即将添加...</span>
              </div>
            </div>
          </div>

          {/* SnapSnap */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight border-b-2 border-black pb-2">
              SnapSnap
            </h2>
            <div className="space-y-4">
              <a href="https://x-pilot-landing.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-brutal-accent w-full flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="/x-pilot-logo.jpg" alt="X-Pilot" className="w-5 h-5 object-contain" />
                  <div className="flex flex-col">
                    <span>X-Pilot</span>
                    <span className="text-xs opacity-80">自动化社交媒体增长 · 冷启动助手</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="https://discord.gg/CSkT2BdNKy" target="_blank" rel="noopener noreferrer" className="btn-brutal w-full flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span>Discord 社群</span>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Modal for Day Details */}
      {showModal && selectedDay && dailyDataState?.dailyData[selectedDay.toString()] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full card-brutal">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {language === 'zh' ? `9月${selectedDay}日` : `September ${selectedDay}`}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-2xl font-bold hover:text-accent"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">
                  {language === 'zh' ? '粉丝增长:' : 'Follower Growth:'} 
                  <span className="text-accent ml-2">
                    +{dailyDataState.dailyData[selectedDay.toString()].followerGrowth}
                  </span>
                </p>
              </div>
              
              {dailyDataState.dailyData[selectedDay.toString()].posts.length > 0 && (
                <div>
                  <p className="font-semibold mb-2">
                    {language === 'zh' ? '发布内容:' : 'Posts:'}
                  </p>
                  <div className="space-y-2">
                    {dailyDataState.dailyData[selectedDay.toString()].posts.map((post, index) => (
                      <a
                        key={index}
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 border-2 border-black hover:bg-accent hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-black text-white px-2 py-1 uppercase">
                            {post.type}
                          </span>
                          <span className="font-medium">{post.title}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t-4 border-black bg-black text-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-lg font-bold uppercase tracking-wide">
            {language === 'zh' ? '让我们一起见证这个增长实验' : "Let's witness this growth experiment together"}
          </p>
          <p className="mt-2 opacity-80">
            {language === 'zh' ? '每一天都是新的开始' : 'Every day is a new beginning'}
          </p>
        </div>
      </footer>
    </div>
  )
}