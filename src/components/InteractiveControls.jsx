import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Zap,
  Orbit,
  GitCommitHorizontal
} from 'lucide-react';

export default function InteractiveControls({
  onMassChange,
  onTimeSpeedChange,
  onAddPlanet,
  onRemovePlanet,
  onResetScene,
  massStrength = 2.0,
  timeSpeed = 1.0,
  planetCount = 2,
  isPlaying = true,
  onPlayPause,
  onStartFallingDemo,
  visualizationType,
  onVisualizationChange,
  gridResolution = 150,
  onGridResolutionChange,
  gridFrequency = 20.0,
  onGridFrequencyChange,
  waveAmplitude = 0.1,
  onWaveAmplitudeChange,
  colorScheme = 'default',
  onColorSchemeChange,
  showGrid = true,
  onShowGridChange,
  starCount = 6500,
  onStarCountChange,
  bloomIntensity = 0.8,
  onBloomIntensityChange,
  chromaticAberration = 0.0004,
  onChromaticAberrationChange,
  additionalMasses = [],
  onAddAdditionalMass,
  onRemoveAdditionalMass,
  onUpdateAdditionalMass
}) {
  const [localMass, setLocalMass] = useState(massStrength);
  const [localTimeSpeed, setLocalTimeSpeed] = useState(timeSpeed);
  const [localGridResolution, setLocalGridResolution] = useState(gridResolution);
  const [localGridFrequency, setLocalGridFrequency] = useState(gridFrequency);
  const [localWaveAmplitude, setLocalWaveAmplitude] = useState(waveAmplitude);
  const [localStarCount, setLocalStarCount] = useState(starCount);
  const [localBloomIntensity, setLocalBloomIntensity] = useState(bloomIntensity);
  const [localChromaticAberration, setLocalChromaticAberration] = useState(chromaticAberration);

  // Sync local state with external props changes (e.g., when Reset is pressed)
  useEffect(() => {
    setLocalMass(massStrength);
  }, [massStrength]);

  useEffect(() => {
    setLocalTimeSpeed(timeSpeed);
  }, [timeSpeed]);

  useEffect(() => {
    setLocalGridResolution(gridResolution);
  }, [gridResolution]);

  useEffect(() => {
    setLocalGridFrequency(gridFrequency);
  }, [gridFrequency]);

  useEffect(() => {
    setLocalWaveAmplitude(waveAmplitude);
  }, [waveAmplitude]);

  useEffect(() => {
    setLocalStarCount(starCount);
  }, [starCount]);

  useEffect(() => {
    setLocalBloomIntensity(bloomIntensity);
  }, [bloomIntensity]);

  useEffect(() => {
    setLocalChromaticAberration(chromaticAberration);
  }, [chromaticAberration]);

  const [localShowGrid, setLocalShowGrid] = useState(showGrid);

  useEffect(() => {
    setLocalShowGrid(showGrid);
  }, [showGrid]);

  const handleMassChange = (value) => {
    const next = value[0];
    setLocalMass(next);
    onMassChange(next);
  };

  const handleTimeSpeedChange = (value) => {
    const next = value[0];
    setLocalTimeSpeed(next);
    onTimeSpeedChange(next);
  };

  const handleGridResolutionChange = (value) => {
    const next = value[0];
    setLocalGridResolution(next);
    onGridResolutionChange?.(next);
  };

  const handleGridFrequencyChange = (value) => {
    const next = value[0];
    setLocalGridFrequency(next);
    onGridFrequencyChange?.(next);
  };

  const handleWaveAmplitudeChange = (value) => {
    const next = value[0];
    setLocalWaveAmplitude(next);
    onWaveAmplitudeChange?.(next);
  };

  const handleShowGridChange = (checked) => {
    setLocalShowGrid(checked);
    onShowGridChange?.(checked);
  };

  const handleStarCountChange = (value) => {
    const next = value[0];
    setLocalStarCount(next);
    onStarCountChange?.(next);
  };

  const handleBloomIntensityChange = (value) => {
    const next = value[0];
    setLocalBloomIntensity(next);
    onBloomIntensityChange?.(next);
  };

  const handleChromaticAberrationChange = (value) => {
    const next = value[0];
    setLocalChromaticAberration(next);
    onChromaticAberrationChange?.(next);
  };

  const massSliderMax = visualizationType === 'blackhole' ? 12.0 : 6.0;

  return (
    <div className="space-y-4">
      {/* Visualization Type Control */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-lg flex items-center gap-2">
            نوع التصور / Visualization Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => onVisualizationChange('planet')}
            variant={visualizationType === 'planet' ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start"
          >
            <Orbit className="w-4 h-4 mr-2" />
            النظام الكوكبي / Planet System
          </Button>
          <Button
            onClick={() => onVisualizationChange('blackhole')}
            variant={visualizationType === 'blackhole' ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start"
          >
            <GitCommitHorizontal className="w-4 h-4 mr-2" />
            الثقب الأسود / Black Hole
          </Button>
        </CardContent>
      </Card>

      {/* Mass Control */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            قوة الكتلة / Mass Strength
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>ضعيف / Weak</span>
              <Badge variant="outline" className="text-primary border-yellow-400">
                {localMass.toFixed(1)}
              </Badge>
              <span>قوي / Strong</span>
            </div>
            <Slider
              value={[localMass]}
              onValueChange={handleMassChange}
              max={massSliderMax}
              min={0.4}
              step={0.1}
              className="w-full"
            />
          </div>
          <p className="text-xs text-slate-400">
            اسحب لتغيير قوة الجاذبية ومشاهدة تأثيرها على انحناء الزمكان.
          </p>
        </CardContent>
      </Card>

      {/* Time Control */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-lg flex items-center gap-2">
            {isPlaying ? <Pause className="w-5 h-5 text-green-400" /> : <Play className="w-5 h-5 text-blue-400" />}
            سرعة الزمن / Time Speed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={onPlayPause} variant={isPlaying ? 'destructive' : 'default'} size="sm" className="flex-1">
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  إيقاف / Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  تشغيل / Play
                </>
              )}
            </Button>
            <Button onClick={onResetScene} variant="outline" size="sm" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              إعادة تعيين / Reset
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>بطيء / Slow</span>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {localTimeSpeed.toFixed(1)}x
              </Badge>
              <span>سريع / Fast</span>
            </div>
            <Slider
              value={[localTimeSpeed]}
              onValueChange={handleTimeSpeedChange}
              max={3.0}
              min={0.1}
              step={0.1}
              className="w-full"
              disabled={!isPlaying}
            />
          </div>
        </CardContent>
      </Card>

      {/* Planet Control */}
      {visualizationType === 'planet' && (
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-lg">الكواكب / Planets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">عدد الكواكب / Planet Count:</span>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {planetCount}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onAddPlanet}
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={planetCount >= 5}
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة / Add
              </Button>
              <Button
                onClick={onRemovePlanet}
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={planetCount <= 1}
              >
                <Minus className="w-4 h-4 mr-2" />
                إزالة / Remove
              </Button>
            </div>

            <p className="text-xs text-slate-400">
              أضف أو أزل كواكب لمشاهدة تأثيرها على المدارات.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grid Controls */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-lg">إعدادات الشبكة / Grid Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Grid Resolution */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>دقة الشبكة / Grid Resolution</span>
              <Badge variant="outline" className="text-green-400 border-green-400">
                {localGridResolution}
              </Badge>
            </div>
            <Slider
              value={[localGridResolution]}
              onValueChange={handleGridResolutionChange}
              max={300}
              min={50}
              step={25}
              className="w-full"
            />
          </div>

          {/* Grid Frequency */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>كثافة الخطوط / Grid Density</span>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {localGridFrequency.toFixed(1)}
              </Badge>
            </div>
            <Slider
              value={[localGridFrequency]}
              onValueChange={handleGridFrequencyChange}
              max={50}
              min={5}
              step={1}
              className="w-full"
            />
          </div>

          {/* Show Grid Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">إظهار الشبكة / Show Grid</span>
            <Switch
              checked={localShowGrid}
              onCheckedChange={handleShowGridChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Animation Effects */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-lg">تأثيرات الحركة / Animation Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wave Amplitude */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>شدة الموجات / Wave Amplitude</span>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {localWaveAmplitude.toFixed(2)}
              </Badge>
            </div>
            <Slider
              value={[localWaveAmplitude]}
              onValueChange={handleWaveAmplitudeChange}
              max={0.5}
              min={0}
              step={0.01}
              className="w-full"
            />
          </div>

          {/* Color Scheme */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">مخطط الألوان / Color Scheme</div>
            <Select value={colorScheme} onValueChange={onColorSchemeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر مخطط الألوان / Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">افتراضي / Default</SelectItem>
                <SelectItem value="cool">بارد / Cool</SelectItem>
                <SelectItem value="warm">دافئ / Warm</SelectItem>
                <SelectItem value="neon">نيون / Neon</SelectItem>
                <SelectItem value="cosmic">كوني / Cosmic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Environment & Effects */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-lg">البيئة والتأثيرات / Environment & Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Star Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>عدد النجوم / Star Count</span>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                {localStarCount}
              </Badge>
            </div>
            <Slider
              value={[localStarCount]}
              onValueChange={handleStarCountChange}
              max={15000}
              min={500}
              step={500}
              className="w-full"
            />
          </div>

          {/* Bloom Intensity */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>شدة التوهج / Bloom Intensity</span>
              <Badge variant="outline" className="text-pink-400 border-pink-400">
                {localBloomIntensity.toFixed(2)}
              </Badge>
            </div>
            <Slider
              value={[localBloomIntensity]}
              onValueChange={handleBloomIntensityChange}
              max={2.0}
              min={0.0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Chromatic Aberration */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>الإزاحة اللونية / Chromatic Aberration</span>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {localChromaticAberration.toFixed(4)}
              </Badge>
            </div>
            <Slider
              value={[localChromaticAberration]}
              onValueChange={handleChromaticAberrationChange}
              max={0.002}
              min={0.0}
              step={0.0001}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Masses */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-lg">الأجسام الإضافية / Additional Masses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onAddAdditionalMass}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={additionalMasses.length >= 2}
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة جسم إضافي / Add Mass
          </Button>

          {additionalMasses.map((mass, index) => (
            <div key={index} className="space-y-3 p-3 border border-border rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">جسم إضافي {index + 1} / Mass {index + 1}</span>
                <Button
                  onClick={() => onRemoveAdditionalMass(index)}
                  variant="destructive"
                  size="sm"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>الموضع X / X Position</span>
                  <Badge variant="outline" className="text-orange-400 border-orange-400">
                    {mass.x.toFixed(1)}
                  </Badge>
                </div>
                <Slider
                  value={[mass.x]}
                  onValueChange={(value) => onUpdateAdditionalMass(index, { x: value[0] })}
                  max={10}
                  min={-10}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>الموضع Z / Z Position</span>
                  <Badge variant="outline" className="text-orange-400 border-orange-400">
                    {mass.z.toFixed(1)}
                  </Badge>
                </div>
                <Slider
                  value={[mass.z]}
                  onValueChange={(value) => onUpdateAdditionalMass(index, { z: value[0] })}
                  max={10}
                  min={-10}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>قوة الجاذبية / Gravitational Strength</span>
                  <Badge variant="outline" className="text-red-400 border-red-400">
                    {mass.strength.toFixed(1)}
                  </Badge>
                </div>
                <Slider
                  value={[mass.strength]}
                  onValueChange={(value) => onUpdateAdditionalMass(index, { strength: value[0] })}
                  max={5.0}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          ))}

          <p className="text-xs text-slate-400">
            أضف أجسام إضافية لمشاهدة تأثيرها المشترك على انحناء الزمكان.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-lg">إعدادات سريعة / Quick Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => {
              onVisualizationChange('planet');
              handleMassChange([1.0]);
              handleTimeSpeedChange([1.0]);
            }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            الأرض العادية / Normal Earth
          </Button>
          <Button
            onClick={() => {
              onVisualizationChange('planet');
              handleMassChange([4.0]);
              handleTimeSpeedChange([0.6]);
            }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            نجم عملاق / Giant Star
          </Button>
          <Button
            onClick={() => {
              onVisualizationChange('blackhole');
              handleMassChange([8.0]);
              handleTimeSpeedChange([1.0]);
            }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            ثقب أسود / Black Hole
          </Button>
          <Button
            onClick={onStartFallingDemo}
            variant="outline"
            size="sm"
            className="w-full"
          >
            تجربة السقوط / Falling Demo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}