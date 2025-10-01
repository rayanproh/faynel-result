import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import FallingSimulation from './FallingSimulation'
import VideoExplanation from './VideoExplanation'
import { 
  BookOpen, 
  Video, 
  Atom, 
  Telescope, 
  Timer, 
  Zap, 
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Earth,
  Star,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Rocket
} from 'lucide-react'

const iconMap = {
  BookOpen,
  Timer,
  Zap,
  Star,
  Telescope
}

export default function ExplanationSection() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("basics")
  const [currentConcept, setCurrentConcept] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  const concepts = useMemo(() => 
    t('explanation_section.concepts', { returnObjects: true }) || [], 
    [t]
  )

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || concepts.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentConcept((prev) => (prev + 1) % concepts.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [isAutoPlay, concepts.length])

  const nextConcept = useCallback(() => {
    setCurrentConcept((prev) => (prev + 1) % concepts.length)
  }, [concepts.length])

  const prevConcept = useCallback(() => {
    setCurrentConcept((prev) => (prev - 1 + concepts.length) % concepts.length)
  }, [concepts.length])

  if (!concepts || concepts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading concepts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">Interactive Learning Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {t('explanation')}
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              {t('explanation_section.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Modern Tab Navigation */}
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-2xl">
              <TabsTrigger 
                value="basics" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 rounded-xl px-6 py-3 transition-all"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Concepts
              </TabsTrigger>
              <TabsTrigger 
                value="simulation" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 rounded-xl px-6 py-3 transition-all"
              >
                <Play className="h-4 w-4 mr-2" />
                Simulation
              </TabsTrigger>
              <TabsTrigger 
                value="video" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 rounded-xl px-6 py-3 transition-all"
              >
                <Video className="h-4 w-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger 
                value="applications" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 rounded-xl px-6 py-3 transition-all"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Applications
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="basics" className="space-y-12">
            {/* Main Concept Display */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentConcept}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      
                      <CardHeader className="pb-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {currentConcept + 1} of {concepts.length}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => setIsAutoPlay(!isAutoPlay)}
                              variant="ghost"
                              size="sm"
                              className="text-white/60 hover:text-white hover:bg-white/10"
                            >
                              {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <CardTitle className="text-3xl font-bold flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10">
                            {React.createElement(
                              iconMap[concepts[currentConcept]?.icon] || BookOpen, 
                              { className: "h-6 w-6 text-blue-400" }
                            )}
                          </div>
                          {concepts[currentConcept]?.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-8">
                        <p className="text-lg text-white/80 leading-relaxed">
                          {concepts[currentConcept]?.content}
                        </p>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/5">
                          <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                            <Lightbulb className="h-5 w-5 text-yellow-400" />
                            Key Insights
                          </h3>
                          <div className="space-y-4">
                            {concepts[currentConcept]?.keyPoints?.map((point, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-4 group"
                              >
                                <div className="mt-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full group-hover:scale-125 transition-transform"></div>
                                <p className="text-white/80 leading-relaxed">{point}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Sidebar Navigation */}
              <div className="space-y-6">
                {/* Progress */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Progress</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Concepts</span>
                        <span>{currentConcept + 1}/{concepts.length}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${((currentConcept + 1) / concepts.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Navigation</h3>
                    <div className="flex gap-2 mb-4">
                      <Button 
                        onClick={prevConcept}
                        variant="ghost" 
                        size="sm"
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/10"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button 
                        onClick={nextConcept}
                        variant="ghost" 
                        size="sm"
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/10"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    
                    {/* Concept dots */}
                    <div className="grid grid-cols-4 gap-2">
                      {concepts.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentConcept(idx)}
                          className={`aspect-square rounded-lg border transition-all ${
                            currentConcept === idx
                              ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/25'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-xs font-medium">{idx + 1}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Overview */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">All Concepts</h3>
                    <div className="space-y-2">
                      {concepts.slice(0, 5).map((concept, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentConcept(idx)}
                          className={`w-full text-left p-3 rounded-xl transition-all ${
                            currentConcept === idx
                              ? 'bg-blue-500/20 border border-blue-500/30'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {React.createElement(iconMap[concept.icon] || BookOpen, { 
                              className: "h-4 w-4 text-blue-400" 
                            })}
                            <span className="text-sm font-medium line-clamp-1">{concept.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="simulation">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-8"
            >
              <FallingSimulation />
            </motion.div>
          </TabsContent>

          <TabsContent value="video">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-8"
            >
              <VideoExplanation />
            </motion.div>
          </TabsContent>

          <TabsContent value="applications">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* GPS Card */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-3 bg-blue-500/20 rounded-2xl">
                      <Earth className="h-6 w-6 text-blue-400" />
                    </div>
                    {t('explanation_section.applications.gps_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/70">
                    {t('explanation_section.applications.gps_content')}
                  </p>
                  <Button variant="ghost" className="text-blue-400 hover:bg-blue-500/10 p-0">
                    Learn more <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Astronomy Card */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-3 bg-purple-500/20 rounded-2xl">
                      <Telescope className="h-6 w-6 text-purple-400" />
                    </div>
                    {t('explanation_section.applications.astro_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/70">
                    {t('explanation_section.applications.astro_content')}
                  </p>
                  <Button variant="ghost" className="text-purple-400 hover:bg-purple-500/10 p-0">
                    Learn more <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Nuclear Card */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-3 bg-green-500/20 rounded-2xl">
                      <Atom className="h-6 w-6 text-green-400" />
                    </div>
                    {t('explanation_section.applications.nuclear_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/70">
                    {t('explanation_section.applications.nuclear_content')}
                  </p>
                  <Button variant="ghost" className="text-green-400 hover:bg-green-500/10 p-0">
                    Learn more <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Future Card */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-3 bg-yellow-500/20 rounded-2xl">
                      <Rocket className="h-6 w-6 text-yellow-400" />
                    </div>
                    {t('explanation_section.applications.future_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/70">
                    {t('explanation_section.applications.future_content')}
                  </p>
                  <Button variant="ghost" className="text-yellow-400 hover:bg-yellow-500/10 p-0">
                    Learn more <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}