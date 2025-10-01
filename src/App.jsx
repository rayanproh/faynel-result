import React, { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import HomeSection from './components/HomeSection'
import SpacetimeVisualization from './components/SpacetimeGrid'
import InteractiveControls from './components/InteractiveControls'
import ExplanationSection from './components/ExplanationSection'
import FactsSection from './components/FactsSection'
import { WelcomePopup } from './components/WelcomePopup'
import TutorSection from './components/TutorSection'
import VideoExplanation from './components/VideoExplanation'
import Presentation from './components/Presentation'
import AI from './components/AI'
import EmbeddedGame from './components/EmbeddedGame'
import { useTranslation } from 'react-i18next'
import { ThemeProvider } from './providers/theme-provider'

function App() {
  const { t, i18n } = useTranslation();
  const [currentSection, setCurrentSection] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('section') || 'home';
  });
  const [massStrength, setMassStrength] = useState(2.0)
  const [timeSpeed, setTimeSpeed] = useState(1.0)
  const [planetCount, setPlanetCount] = useState(2)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showFallingDemo, setShowFallingDemo] = useState(false)
  const [visualizationType, setVisualizationType] = useState('planet') // 'planet' or 'blackhole'
  const [showWelcomePopup, setShowWelcomePopup] = useState(true)
  const [gridResolution, setGridResolution] = useState(150)
  const [gridFrequency, setGridFrequency] = useState(20.0)
  const [waveAmplitude, setWaveAmplitude] = useState(0.1)
  const [colorScheme, setColorScheme] = useState('default')
  const [showGrid, setShowGrid] = useState(true)
  const [starCount, setStarCount] = useState(6500)
  const [bloomIntensity, setBloomIntensity] = useState(0.8)
  const [chromaticAberration, setChromaticAberration] = useState(0.0004)
  const [additionalMasses, setAdditionalMasses] = useState([])

  useEffect(() => {
    const url = new URL(window.location);
    if (currentSection && currentSection !== 'home') {
      url.searchParams.set('section', currentSection);
    } else {
      url.searchParams.delete('section');
    }
    window.history.pushState({}, '', url);
  }, [currentSection]);

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleSectionChange = (section) => {
    console.log('Changing section to:', section);
    setCurrentSection(section)
  }

  const handleMassChange = (value) => {
    setMassStrength(value)
  }

  const handleTimeSpeedChange = (value) => {
    setTimeSpeed(value)
  }

  const handleAddPlanet = () => {
    if (planetCount < 5) {
      setPlanetCount(planetCount + 1)
    }
  }

  const handleRemovePlanet = () => {
    if (planetCount > 1) {
      setPlanetCount(planetCount - 1)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleResetScene = () => {
    setMassStrength(2.0)
    setTimeSpeed(1.0)
    setPlanetCount(2)
    setIsPlaying(true)
    setVisualizationType('planet')
    setGridResolution(150)
    setGridFrequency(20.0)
    setWaveAmplitude(0.1)
    setColorScheme('default')
    setShowGrid(true)
    setStarCount(6500)
    setBloomIntensity(0.8)
    setChromaticAberration(0.0004)
    setAdditionalMasses([])
  }

  const handleVisualizationChange = (type) => {
    setVisualizationType(type)
  }

  const handleGridResolutionChange = (value) => {
    setGridResolution(value)
  }

  const handleGridFrequencyChange = (value) => {
    setGridFrequency(value)
  }

  const handleWaveAmplitudeChange = (value) => {
    setWaveAmplitude(value)
  }

  const handleColorSchemeChange = (scheme) => {
    setColorScheme(scheme)
  }

  const handleShowGridChange = (show) => {
    setShowGrid(show)
  }

  const handleStarCountChange = (value) => {
    setStarCount(value)
  }

  const handleBloomIntensityChange = (value) => {
    setBloomIntensity(value)
  }

  const handleChromaticAberrationChange = (value) => {
    setChromaticAberration(value)
  }

  const handleAddAdditionalMass = () => {
    if (additionalMasses.length < 2) {
      setAdditionalMasses([...additionalMasses, { x: Math.random() * 10 - 5, z: Math.random() * 10 - 5, strength: 1.0 }])
    }
  }

  const handleRemoveAdditionalMass = (index) => {
    setAdditionalMasses(additionalMasses.filter((_, i) => i !== index))
  }

  const handleUpdateAdditionalMass = (index, updates) => {
    setAdditionalMasses(additionalMasses.map((mass, i) => i === index ? { ...mass, ...updates } : mass))
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <HomeSection 
            onSectionChange={handleSectionChange}
          />
        )
      
      case 'simulation':
        return (
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {t('simulation_title')}
              </h2>
              <p className="text-blue-200">
                {t('simulation_subtitle')}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <SpacetimeVisualization
                  showFallingDemo={showFallingDemo}
                  onFallingDemoComplete={() => setShowFallingDemo(false)}
                  massStrength={massStrength}
                  showOrbits={true}
                  timeSpeed={timeSpeed}
                  planetCount={planetCount}
                  isPlaying={isPlaying}
                  visualizationType={visualizationType}
                  gridResolution={gridResolution}
                  gridFrequency={gridFrequency}
                  waveAmplitude={waveAmplitude}
                  colorScheme={colorScheme}
                  showGrid={showGrid}
                  starCount={starCount}
                  bloomIntensity={bloomIntensity}
                  chromaticAberration={chromaticAberration}
                  additionalMasses={additionalMasses}
                />
              </div>
              
              <div className="lg:col-span-1">
                <InteractiveControls
                  onMassChange={handleMassChange}
                  onTimeSpeedChange={handleTimeSpeedChange}
                  onAddPlanet={handleAddPlanet}
                  onRemovePlanet={handleRemovePlanet}
                  onResetScene={handleResetScene}
                  onPlayPause={handlePlayPause}
                  onStartFallingDemo={() => {
                    setShowFallingDemo(true)
                    playSound('falling-object.mp3')
                  }}
                  massStrength={massStrength}
                  timeSpeed={timeSpeed}
                  planetCount={planetCount}
                  isPlaying={isPlaying}
                  visualizationType={visualizationType}
                  onVisualizationChange={handleVisualizationChange}
                  gridResolution={gridResolution}
                  onGridResolutionChange={handleGridResolutionChange}
                  gridFrequency={gridFrequency}
                  onGridFrequencyChange={handleGridFrequencyChange}
                  waveAmplitude={waveAmplitude}
                  onWaveAmplitudeChange={handleWaveAmplitudeChange}
                  colorScheme={colorScheme}
                  onColorSchemeChange={handleColorSchemeChange}
                  showGrid={showGrid}
                  onShowGridChange={handleShowGridChange}
                  starCount={starCount}
                  onStarCountChange={handleStarCountChange}
                  bloomIntensity={bloomIntensity}
                  onBloomIntensityChange={handleBloomIntensityChange}
                  chromaticAberration={chromaticAberration}
                  onChromaticAberrationChange={handleChromaticAberrationChange}
                  additionalMasses={additionalMasses}
                  onAddAdditionalMass={handleAddAdditionalMass}
                  onRemoveAdditionalMass={handleRemoveAdditionalMass}
                  onUpdateAdditionalMass={handleUpdateAdditionalMass}
                />
              </div>
            </div>
          </div>
        )
      
      case 'explanation':
        return <ExplanationSection />
      
      case 'facts':
        return <FactsSection />

      case 'tutor':
        return <TutorSection />
      
      case 'video':
        return <VideoExplanation />
      
      case 'presentation':
        return <Presentation />

      case 'ai':
        return <AI />

      case 'game':
        return <EmbeddedGame onClose={() => setCurrentSection('home')} />

      default:
        return (
          <HomeSection 
            onSectionChange={handleSectionChange}
          />
        )
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        handleSectionChange('ai');
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        if (currentSection === 'ai') {
          handleSectionChange('home');
        }
      }
      if (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'x') {
        event.preventDefault();
        handleSectionChange('game');
      }
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'x') {
        event.preventDefault();
        if (currentSection === 'game') {
          handleSectionChange('home');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark">
      {currentSection !== 'ai' && currentSection !== 'game' && <Header
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />}

      <main className={currentSection === 'ai' || currentSection === 'game' ? '' : 'pb-8'}>
        {renderCurrentSection()}
      </main>

      {currentSection !== 'ai' && currentSection !== 'game' && <WelcomePopup isOpen={showWelcomePopup} onClose={() => setShowWelcomePopup(false)} />}

      {/* Footer */}
      {currentSection !== 'ai' && currentSection !== 'game' && <footer className="bg-slate-900/50 border-t border-slate-700 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            {t('footer_text')}
          </p>
          <p className="text-slate-500 text-xs mt-2">
            {t('footer_copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>}
      </div>
    </ThemeProvider>
  )
}

export default App