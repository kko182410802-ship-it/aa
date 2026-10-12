import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Film,
  Award,
  Download,
  Share2,
  Sparkles,
  Info,
  Layers,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  MessageCircle,
  Eye,
  Sliders,
  Check
} from 'lucide-react';
import { CinemaScreen } from './components/CinemaScreen';
import { PlayerControls } from './components/PlayerControls';
import { StoryboardView } from './components/StoryboardView';
import { ContestSubmissionModal } from './components/ContestSubmissionModal';
import { VideoExporter } from './components/VideoExporter';
import { FILM_SCENES, TOTAL_DURATION, CONTEST_METADATA } from './data/filmData';
import { AspectRatioMode } from './types/film';
import { soundtrack } from './services/soundtrackEngine';

export default function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('16:9');
  const [showDirectorHud, setShowDirectorHud] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'storyboard' | 'analysis' | 'script'>('storyboard');

  // Modals
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Playback timer loop
  const updateLoop = useCallback((timestamp: number) => {
    if (lastTimestampRef.current !== null) {
      const delta = (timestamp - lastTimestampRef.current) / 1000;
      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          soundtrack.stopAll();
          return TOTAL_DURATION;
        }
        // Update audio soundtrack engine
        soundtrack.updateAtTime(next, true);
        return next;
      });
    }
    lastTimestampRef.current = timestamp;
    animationFrameRef.current = requestAnimationFrame(updateLoop);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      lastTimestampRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimestampRef.current = null;
      soundtrack.stopAll();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateLoop]);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek(Math.min(TOTAL_DURATION, currentTime + 5));
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'c' || e.key === 'C') {
        setSubtitlesEnabled((prev) => !prev);
      } else if (e.key === 'h' || e.key === 'H') {
        setShowDirectorHud((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime]);

  const togglePlay = () => {
    if (!isPlaying && currentTime >= TOTAL_DURATION) {
      // If at end, loop to start
      setCurrentTime(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const seek = (time: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_DURATION, time));
    setCurrentTime(clamped);
    soundtrack.updateAtTime(clamped, isPlaying);
  };

  const restart = () => {
    setCurrentTime(0);
    soundtrack.updateAtTime(0, isPlaying);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    soundtrack.setVolume(vol);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      soundtrack.setMute(next);
      return next;
    });
  };

  const toggleAspectRatio = () => {
    setAspectRatio((prev) => (prev === '16:9' ? '2.39:1' : '16:9'));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Find active scene
  const activeScene = FILM_SCENES.find(
    s => currentTime >= s.startTime && (currentTime < s.endTime || (s.id === 6 && currentTime <= s.endTime))
  ) || FILM_SCENES[0];

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-amber-600 selection:text-white ${
        theaterMode ? 'overflow-hidden' : ''
      }`}
    >
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand & Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-serif-kr font-bold tracking-wide text-white">
                  말은 남는다
                </h1>
                <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                  Words Remain
                </span>
                <span className="text-[10px] font-sans-kr px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  공모전 출품작
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans-kr hidden md:block">
                사이버 폭력 예방 및 언어의 영향력 주제 60초 시네마틱 단편 영상
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheaterMode(!theaterMode)}
              className={`p-2 rounded-lg text-xs font-medium transition-colors hidden sm:flex items-center gap-1.5 ${
                theaterMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
              }`}
              title="극장 모드 (배경 어둡게)"
            >
              {theaterMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{theaterMode ? '극장 모드 해제' : '극장 모드'}</span>
            </button>

            <button
              onClick={() => setIsDossierOpen(true)}
              className="py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>기획서 & 심사정보</span>
            </button>

            <button
              onClick={() => setIsExporterOpen(true)}
              className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">비디오 내보내기</span>
              <span className="sm:hidden">다운로드</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="링크 복사"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Cinematic Video Player Area */}
      <main className="flex-1 flex flex-col items-center justify-start max-w-7xl w-full mx-auto px-2 sm:px-6 py-4 sm:py-6">
        {/* The 16:9 Cinema Container */}
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/80 shadow-2xl relative">
          <CinemaScreen
            currentTime={currentTime}
            isPlaying={isPlaying}
            aspectRatio={aspectRatio}
            showDirectorHud={showDirectorHud}
            subtitlesEnabled={subtitlesEnabled}
            onTogglePlay={togglePlay}
          />

          <PlayerControls
            currentTime={currentTime}
            isPlaying={isPlaying}
            volume={volume}
            isMuted={isMuted}
            aspectRatio={aspectRatio}
            showDirectorHud={showDirectorHud}
            subtitlesEnabled={subtitlesEnabled}
            isFullscreen={isFullscreen}
            onTogglePlay={togglePlay}
            onSeek={seek}
            onRestart={restart}
            onVolumeChange={handleVolumeChange}
            onToggleMute={toggleMute}
            onToggleAspectRatio={toggleAspectRatio}
            onToggleDirectorHud={() => setShowDirectorHud(!showDirectorHud)}
            onToggleSubtitles={() => setSubtitlesEnabled(!subtitlesEnabled)}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>

        {/* Current Scene Information Banner */}
        <div className="w-full max-w-5xl mt-4 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {activeScene.numberStr}
            </span>
            <span className="font-serif-kr font-bold text-white text-sm">
              {activeScene.title}
            </span>
            <span className="text-zinc-500 hidden md:inline">|</span>
            <span className="text-zinc-400 hidden md:inline font-sans-kr">
              {activeScene.narrativeText}
            </span>
          </div>

          <div className="flex items-center gap-2 text-zinc-500 font-mono text-[11px] self-end sm:self-auto">
            <span>{activeScene.startTime}s - {activeScene.endTime}s</span>
            <span>·</span>
            <span className="text-zinc-400">{activeScene.tone}</span>
          </div>
        </div>

        {/* Lower Production Tabs & Analysis Panel (Hidden in theater mode if preferred) */}
        {!theaterMode && (
          <div className="w-full max-w-5xl mt-8 mb-12">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-6 text-xs sm:text-sm font-medium">
              <button
                onClick={() => setActiveTab('storyboard')}
                className={`py-2 px-3.5 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'storyboard'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>스토리보드 & 씬 구성 (6개 샷)</span>
              </button>

              <button
                onClick={() => setActiveTab('analysis')}
                className={`py-2 px-3.5 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'analysis'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>시청각 연출 & 사운드 디자인 분석</span>
              </button>

              <button
                onClick={() => setActiveTab('script')}
                className={`py-2 px-3.5 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'script'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>대본 전문 & 자막 타이밍</span>
              </button>
            </div>

            {/* Tab 1: Storyboard */}
            {activeTab === 'storyboard' && (
              <StoryboardView
                currentSceneId={activeScene.id}
                onSelectScene={(time) => seek(time)}
              />
            )}

            {/* Tab 2: Direction & Sound Design Analysis */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                {/* Visual Color Temperature Evolution */}
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <h3 className="font-serif-kr text-base font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span>조명 및 색온도 변화 설계 (Color Grading Transition)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4 font-sans-kr leading-relaxed">
                    본 영상은 이야기의 진행에 따라 차가운 액정의 6500K 청색광에서 시작하여, 절대적 암전(0 Lux)을 거쳐 따뜻한 3200K 아침 햇살(골든 아워)로 색온도가 극적으로 전이되도록 정교하게 설계되었습니다.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-blue-950/50 border border-blue-900 text-blue-200">
                      <span className="font-mono text-[10px] text-blue-400 block">00:00 ~ 00:17</span>
                      <strong className="block mt-1 font-semibold">6500K 쿨 블루 (Cool Cyan)</strong>
                      <p className="text-[11px] text-blue-300/80 mt-1">
                        어둠 속 스마트폰 액정의 시린 불빛, 정서적 고립과 디지털 상처의 차가움
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                      <span className="font-mono text-[10px] text-zinc-500 block">00:17 ~ 00:27</span>
                      <strong className="block mt-1 font-semibold">뮤트 섀도우 (Deep Shadows)</strong>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        비 내리는 창가의 쓸쓸한 실루엣과 바닥에 떨어진 폰의 희미한 잔광
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200">
                      <span className="font-mono text-[10px] text-amber-500 block">00:27 ~ 00:37</span>
                      <strong className="block mt-1 font-semibold">0 Lux 암전 ➔ 단 하나의 불씨</strong>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        화면 전체 블랙아웃 후 어둠 속에서 피어오르는 황금빛 온기의 점등
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-900 text-amber-200">
                      <span className="font-mono text-[10px] text-amber-400 block">00:37 ~ 00:60</span>
                      <strong className="block mt-1 font-semibold">3200K 골든 엠버 (Amber Sunlight)</strong>
                      <p className="text-[11px] text-amber-300/80 mt-1">
                        창가에 쏟아지는 아침 햇살과 베이지 톤, 영혼의 치유와 회복을 상징
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sound Design & Silence */}
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <h3 className="font-serif-kr text-base font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>사운드 디자인: 의도된 침묵(Silence)의 힘</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3 font-sans-kr leading-relaxed">
                    음악이 쉴 새 없이 채워지는 상업 영상과 달리, 본 작품의 가장 강력한 장치는 <strong>24초부터 31초까지 발생하는 완전한 무음(Absolute Silence)</strong>입니다.
                  </p>
                  <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 text-xs text-zinc-300 space-y-1.5 font-sans-kr">
                    <p>
                      • <strong>0~17초:</strong> 고독한 C단조 펠트 피아노와 알림음, 심장 박동음의 중첩으로 불안감 고조
                    </p>
                    <p>
                      • <strong>17~27초:</strong> 피아노 저음이 감쇄하며 24초에 모든 음악이 완전히 정지
                    </p>
                    <p>
                      • <strong>27~37초:</strong> 적막 속에서 32초경 은은한 크리스탈 배음이 떠오르며 인간 존재의 무게를 환기
                    </p>
                    <p>
                      • <strong>37~50초:</strong> 따뜻한 장조(F Major - C - Dm - Bb)의 서정적 어쿠스틱 피아노 선율과 스트링 패드가 감동적으로 재개
                    </p>
                  </div>
                </div>

                {/* Cyberbullying Prevention Statement */}
                <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
                  <h3 className="font-serif-kr text-base font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>기획 배경: 사이버 폭력의 심각성과 현실</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-400 mt-3">
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/60">
                      <span className="text-amber-400 font-bold block text-sm">31.6%</span>
                      <span className="text-zinc-300 font-medium block mt-0.5">사이버폭력 경험률</span>
                      <p className="text-[11px] text-zinc-500 mt-1">디지털 공간에서 언어폭력 및 악성 댓글에 노출된 현대인의 비율 (방송통신위원회 통계)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/60">
                      <span className="text-red-400 font-bold block text-sm">24시간 연속성</span>
                      <span className="text-zinc-300 font-medium block mt-0.5">물리적 공간을 넘는 침투</span>
                      <p className="text-[11px] text-zinc-500 mt-1">집이나 개인 침실까지 스마트폰을 통해 중단 없이 파고드는 사이버 괴롭힘의 잔혹성</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/60">
                      <span className="text-cyan-400 font-bold block text-sm">따뜻한 한마디</span>
                      <span className="text-zinc-300 font-medium block mt-0.5">언어의 회복탄력성</span>
                      <p className="text-[11px] text-zinc-500 mt-1">무심코 던진 독설 대신 건넨 작은 위로의 말이 한 사람의 생명을 살리는 기적이 됨</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Screenplay & Full Subtitles */}
            {activeTab === 'script' && (
              <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-6">
                <div>
                  <h3 className="font-serif-kr text-lg font-bold text-white">단편 영화 「말은 남는다」 대본 & 큐시트 전문</h3>
                  <p className="text-xs text-zinc-400 font-sans-kr mt-1">
                    타임라인별 나레이션 및 스크린 자막 타이밍 (총 러닝타임 60초)
                  </p>
                </div>

                <div className="space-y-4 font-serif-kr text-sm">
                  {FILM_SCENES.map((scene) => (
                    <div key={scene.id} className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                      <div className="flex items-center justify-between font-mono text-xs text-zinc-500 pb-2 mb-2 border-b border-zinc-800">
                        <span className="text-amber-400 font-bold">{scene.numberStr}: {scene.title}</span>
                        <span>{scene.startTime.toString().padStart(2, '0')}:00 ~ {scene.endTime.toString().padStart(2, '0')}:00 (길이: {scene.endTime - scene.startTime}초)</span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-zinc-400 font-sans-kr leading-relaxed">
                          <span className="text-zinc-300 font-semibold">[장면 묘사]</span> {scene.narrativeText}
                        </p>

                        {scene.mainDialogue && (
                          <div className="p-2.5 rounded bg-zinc-900 border border-zinc-700/60 text-zinc-100 font-medium">
                            <span className="text-[11px] text-cyan-400 font-mono block mb-0.5">[자막 / 대사]</span>
                            <p className="whitespace-pre-line text-sm text-zinc-100">{scene.mainDialogue}</p>
                          </div>
                        )}

                        <div className="text-[11px] text-zinc-500 font-sans-kr pt-1">
                          <strong>[촬영 지시]</strong> {scene.cameraMovement} · {scene.soundCue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500 font-sans-kr">
        <p className="font-serif-kr text-zinc-400">
          「말은 남는다」 · 디지털 미디어 공모전 출품작
        </p>
        <p className="text-[11px] text-zinc-600 mt-1">
          상처 대신 따뜻함을 남기세요. 화면 너머에도 사람이 있습니다.
        </p>
      </footer>

      {/* Modals */}
      <ContestSubmissionModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onJumpToTime={(t) => seek(t)}
      />

      <VideoExporter
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
      />
    </div>
  );
}
