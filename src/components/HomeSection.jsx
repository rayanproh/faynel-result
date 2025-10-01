import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, 
  Brain, 
  Atom, 
  Lightbulb, 
  Play, 
  Star,
  Globe,
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react'

export default function HomeSection({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [activeCard, setActiveCard] = useState(null);

  const features = [
    {
      icon: Atom,
      title: t('home.features.0.title'),
      description: t('home.features.0.description'),
      action: t('home.features.0.action'),
      section: 'simulation',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Lightbulb,
      title: t('home.features.1.title'),
      description: t('home.features.1.description'),
      action: t('home.features.1.action'),
      section: 'explanation',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      icon: Star,
      title: t('home.features.2.title'),
      description: t('home.features.2.description'),
      action: t('home.features.2.action'),
      section: 'facts',
      gradient: 'from-purple-500 to-pink-600'
    }
  ]

  const quickStartSteps = t('home.quickStart.steps', { returnObjects: true });
  const aboutEinsteinFacts = t('home.aboutEinstein.facts', { returnObjects: true });

  return (
    <div className={`max-w-7xl mx-auto p-4 md:p-6 space-y-12 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
      
      {/* Hero Section */}
      <div className="text-center space-y-8 py-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-blue-200 text-sm font-medium">
                {t('home.hero.subtitle')}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight">
              {t('home.hero.title')}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.description')}
            </p>
          </div>
        </div>

        {/* Einstein Avatar */}
        <div className="flex justify-center pt-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50"></div>
            <div className="relative w-40 h-40 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Brain className="w-20 h-20 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          
          return (
            <Card 
              key={index} 
              className={`bg-slate-800/70 border-slate-700 backdrop-blur-sm transition-all duration-300 cursor-pointer group ${
                activeCard === index ? 'scale-105 shadow-2xl' : 'hover:scale-105 hover:shadow-xl'
              }`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              
              <CardHeader className="text-center relative">
                <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-white text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4 relative">
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
                <Button 
                  onClick={() => onSectionChange(feature.section)}
                  className={`w-full bg-gradient-to-r ${feature.gradient} hover:shadow-lg transition-all duration-300`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {feature.action}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3 text-2xl">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Rocket className="w-6 h-6 text-emerald-400" />
            </div>
            {t('home.quickStart.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.isArray(quickStartSteps) && quickStartSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <Badge variant="outline" className="text-emerald-400 border-emerald-400 shrink-0 w-8 h-8 flex items-center justify-center font-bold">
                  {index + 1}
                </Badge>
                <span className="text-slate-200 text-sm">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3 text-2xl">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-amber-400" />
              </div>
              {t('home.aboutEinstein.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-200 leading-relaxed text-base">
              {t('home.aboutEinstein.description')}
            </p>
            <div className="space-y-3">
              {Array.isArray(aboutEinsteinFacts) && aboutEinsteinFacts.map((fact, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-amber-100 text-sm leading-relaxed">{fact}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Preview */}
        <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              {t('home.interactivePreview.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-56 bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-900 rounded-xl overflow-hidden">
              {/* Grid visualization */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {Array.from({ length: 21 }, (_, i) => (
                    <g key={i}>
                      <line x1={i * 10} y1="0" x2={i * 10} y2="200" stroke="#60a5fa" strokeWidth="0.5" />
                      <line x1="0" y1={i * 10} x2="200" y2={i * 10} stroke="#60a5fa" strokeWidth="0.5" />
                    </g>
                  ))}
                </svg>
              </div>
              
              {/* Central mass */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full shadow-lg shadow-green-500/50"></div>
              </div>
              
              {/* Orbiting object */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 border-2 border-blue-400/50 rounded-full animate-spin" style={{animationDuration: '4s'}}>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full absolute -top-1.5 left-1/2 transform -translate-x-1/2 shadow-lg"></div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white text-sm bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg inline-block">
                  {t('home.interactivePreview.subtitle')}
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => onSectionChange('simulation')}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg transition-all duration-300"
            >
              <Atom className="w-4 h-4 mr-2" />
              {t('home.interactivePreview.action')}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => onSectionChange('game')}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg transition-all duration-300"
            >
              <Star className="w-4 h-4 mr-2" />
              Open Game (Test)
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}