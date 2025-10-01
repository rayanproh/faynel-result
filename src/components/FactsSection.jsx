import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Lightbulb, 
  Clock, 
  Satellite, 
  Zap, 
  Globe, 
  Star, 
  Rocket,
  Brain,
  Award,
  MapPin,
  Camera,
  Telescope,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react'

const factIcons = {
  gps: Satellite,
  time: Clock,
  einstein: Brain,
  blackhole: Star,
  waves: Zap,
  universe: Globe,
  eclipse: Camera,
  lensing: Telescope
}

const factColors = {
  gps: { bg: 'from-blue-500 to-cyan-500', border: 'border-blue-500/50', accent: 'text-blue-400' },
  time: { bg: 'from-purple-500 to-pink-500', border: 'border-purple-500/50', accent: 'text-purple-400' },
  einstein: { bg: 'from-amber-500 to-orange-500', border: 'border-amber-500/50', accent: 'text-amber-400' },
  blackhole: { bg: 'from-violet-500 to-purple-500', border: 'border-violet-500/50', accent: 'text-violet-400' },
  waves: { bg: 'from-cyan-500 to-teal-500', border: 'border-cyan-500/50', accent: 'text-cyan-400' },
  universe: { bg: 'from-indigo-500 to-blue-500', border: 'border-indigo-500/50', accent: 'text-indigo-400' },
  eclipse: { bg: 'from-rose-500 to-pink-500', border: 'border-rose-500/50', accent: 'text-rose-400' },
  lensing: { bg: 'from-emerald-500 to-green-500', border: 'border-emerald-500/50', accent: 'text-emerald-400' }
}

export default function FactsSection() {
  const { t, i18n } = useTranslation();
  const [selectedFact, setSelectedFact] = useState(0)

  const facts = t('facts.facts', { returnObjects: true });
  const applications = t('facts.applications.items', { returnObjects: true });
  const selectedFactData = Array.isArray(facts) ? facts[selectedFact] : {};
  const Icon = factIcons[selectedFactData.id] || Lightbulb;
  const colors = factColors[selectedFactData.id] || factColors.gps;

  return (
    <div className={`max-w-7xl mx-auto p-4 md:p-6 space-y-8 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
      
      {/* Enhanced Header */}
      <div className="text-center space-y-4 py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full backdrop-blur-sm mb-2">
          <Sparkles className="w-4 h-4 text-blue-300" />
          <span className="text-blue-200 text-sm font-medium">Discover Amazing Facts</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          {t('facts.title')}
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">{t('facts.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Enhanced Facts List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">
              {t('facts.list_title')}
            </h3>
          </div>
          
          {Array.isArray(facts) && facts.map((fact, index) => {
            const FactIcon = factIcons[fact.id] || Lightbulb;
            const factColor = factColors[fact.id] || factColors.gps;
            const isSelected = selectedFact === index
            
            return (
              <Card
                key={fact.id}
                className={`cursor-pointer transition-all duration-300 bg-slate-800/50 backdrop-blur-sm border-2 group ${
                  isSelected 
                    ? `${factColor.border} shadow-xl scale-105 bg-slate-700/50` 
                    : 'border-slate-700 hover:border-slate-600 hover:bg-slate-700/50 hover:scale-102'
                }`}
                onClick={() => setSelectedFact(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${factColor.bg} rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                      <FactIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">{fact.title}</h4>
                      {isSelected && (
                        <Badge className={`${factColor.accent} bg-transparent border ${factColor.border}`}>
                          {t('facts.selected')}
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className={`w-5 h-5 ${factColor.accent} transition-transform ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Enhanced Selected Fact Detail */}
        <div className="lg:col-span-2">
          <Card className={`bg-slate-800/70 backdrop-blur-sm border-2 ${colors.border} h-full relative overflow-hidden`}>
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-5`}></div>
            
            <CardHeader className="relative">
              <CardTitle className="text-white flex items-center gap-3 text-2xl">
                <div className={`w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{selectedFactData.title}</div>
                  <div className={`text-sm ${colors.accent} font-normal mt-1`}>Featured Fact #{selectedFact + 1}</div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 relative">
              <p className="text-slate-200 text-lg leading-relaxed">
                {selectedFactData.description}
              </p>
              
              {/* Enhanced Did You Know Box */}
              <div className={`bg-gradient-to-r ${colors.bg} bg-opacity-10 rounded-xl p-5 border-2 ${colors.border} backdrop-blur-sm relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.bg} opacity-10 rounded-full blur-2xl`}></div>
                <div className="flex items-start gap-3 relative">
                  <div className={`p-2 bg-gradient-to-br ${colors.bg} rounded-lg shrink-0`}>
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className={`${colors.accent} font-bold text-lg block mb-2`}>
                      {t('facts.did_you_know')}
                    </span>
                    <p className="text-white leading-relaxed">{selectedFactData.detail}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Interactive Elements */}
              {selectedFactData.id === 'gps' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-semibold">GPS Accuracy Comparison</span>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-red-500/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">
                        {t('facts.gps_accuracy_without')}
                      </span>
                      <Badge className="bg-red-500/20 text-red-300 border border-red-500/50 text-base px-3 py-1">
                        {t('facts.gps_error')}
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">
                        {t('facts.gps_accuracy_with')}
                      </span>
                      <Badge className="bg-green-500/20 text-green-300 border border-green-500/50 text-base px-3 py-1">
                        {t('facts.gps_accurate')}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {selectedFactData.id === 'time' && (
                <div className="bg-slate-900/50 rounded-lg p-6 border border-purple-500/50 backdrop-blur-sm">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-2">
                      <Clock className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <p className="text-purple-300 text-base font-medium">
                      {t('facts.time_difference')}
                    </p>
                  </div>
                </div>
              )}

              {selectedFactData.id === 'blackhole' && (
                <div className="bg-slate-900/50 rounded-lg p-6 border border-violet-500/50 backdrop-blur-sm text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full mb-3">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-violet-300 text-sm">Black holes demonstrate extreme spacetime curvature</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Applications Section */}
      <Card className="bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 border-2 border-indigo-500/50 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-3 text-2xl">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Rocket className="w-7 h-7 text-indigo-400" />
            </div>
            {t('facts.applications.title')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.isArray(applications) && applications.map((app, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-indigo-500/30 hover:bg-white/10 hover:border-indigo-400/50 transition-all duration-300 group cursor-pointer transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:rotate-6 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2 text-base">{app.name}</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{app.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fun Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: 'Fascinating Facts', value: facts.length, color: 'from-amber-500 to-orange-500' },
          { icon: Rocket, label: 'Real Applications', value: applications.length, color: 'from-blue-500 to-cyan-500' },
          { icon: Star, label: 'Mind-Blowing', value: '100%', color: 'from-purple-500 to-pink-500' },
          { icon: Zap, label: 'Speed of Light', value: '299,792 km/s', color: 'from-green-500 to-emerald-500' }
        ].map((stat, index) => (
          <Card key={index} className="bg-slate-800/70 border-slate-700 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardContent className="p-4 text-center space-y-2">
              <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-xs">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}