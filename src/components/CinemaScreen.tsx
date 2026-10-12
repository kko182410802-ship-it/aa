import React, { useMemo } from 'react';
import { FILM_SCENES, SCENE_COMMENTS } from '../data/filmData';
import { AspectRatioMode } from '../types/film';

interface CinemaScreenProps {
  currentTime: number;
  isPlaying: boolean;
  aspectRatio: AspectRatioMode;
  showDirectorHud: boolean;
  subtitlesEnabled: boolean;
  onTogglePlay: () => void;
}

export const CinemaScreen: React.FC<CinemaScreenProps> = ({
  currentTime,
  isPlaying,
  aspectRatio,
  showDirectorHud,
  subtitlesEnabled,
  onTogglePlay
}) => {
  // Determine current active scene
  const activeScene = useMemo(() => {
    return FILM_SCENES.find(
      s => currentTime >= s.startTime && (currentTime < s.endTime || (s.id === 6 && currentTime <= s.endTime))
    ) || FILM_SCENES[0];
  }, [currentTime]);

  // Scene-specific camera scale and pan interpolations
  const cameraStyle = useMemo(() => {
    const t = currentTime;
    if (t < 7) {
      // Scene 1: Slow push-in on phone screen (0 -> 7s)
      const progress = t / 7;
      const scale = 1.0 + progress * 0.12;
      return {
        transform: `scale(${scale}) translateY(${progress * -1.5}%)`,
        transition: 'transform 0.1s linear'
      };
    } else if (t < 17) {
      // Scene 2: Tension, slightly unstable scale + handheld jitter (7 -> 17s)
      const progress = (t - 7) / 10;
      const baseScale = 1.1 + progress * 0.08;
      const jitterX = Math.sin(t * 14) * (0.4 + progress * 0.6);
      const jitterY = Math.cos(t * 12) * (0.3 + progress * 0.5);
      return {
        transform: `scale(${baseScale}) translate(${jitterX}px, ${jitterY}px)`,
        transition: 'transform 0.05s linear'
      };
    } else if (t < 27) {
      // Scene 3: Slow melancholic dolly-in towards lonely silhouette (17 -> 27s)
      const progress = (t - 17) / 10;
      const scale = 1.02 + progress * 0.09;
      return {
        transform: `scale(${scale}) translateX(${progress * -1}%)`,
        transition: 'transform 0.1s linear'
      };
    } else if (t < 37) {
      // Scene 4: Subtle gentle floating in darkness / breathing (27 -> 37s)
      const progress = (t - 27) / 10;
      const scale = 1.0 + Math.sin(progress * Math.PI) * 0.04;
      return {
        transform: `scale(${scale})`,
        transition: 'transform 0.1s linear'
      };
    } else if (t < 50) {
      // Scene 5: Serene gentle morning pan towards window and light (37 -> 50s)
      const progress = (t - 37) / 13;
      const scale = 1.06 - progress * 0.04;
      const panX = (1 - progress) * 1.5;
      return {
        transform: `scale(${scale}) translateX(${panX}%)`,
        transition: 'transform 0.1s linear'
      };
    } else {
      // Scene 6: Pure stillness
      return {
        transform: 'scale(1.0)',
        transition: 'transform 0.3s ease'
      };
    }
  }, [currentTime]);

  // Color grading filter style
  const colorGradingFilter = useMemo(() => {
    const t = currentTime;
    if (t < 7) {
      // Scene 1: Cold blue desaturated night
      return 'brightness(0.92) contrast(1.12) saturate(0.85) hue-rotate(-12deg)';
    } else if (t < 17) {
      // Scene 2: Higher contrast, harsher digital feel
      return 'brightness(0.88) contrast(1.22) saturate(0.9) hue-rotate(-8deg)';
    } else if (t < 27) {
      // Scene 3: Deep shadow, muted cold tone
      const fadeToBlack = t > 25 ? (27 - t) / 2 : 1;
      return `brightness(${0.85 * fadeToBlack}) contrast(1.15) saturate(0.7) hue-rotate(-15deg)`;
    } else if (t < 37) {
      // Scene 4: Deep darkness with warm point glow
      return 'brightness(1.0) contrast(1.1)';
    } else if (t < 50) {
      // Scene 5: Warm morning golden daylight (shift to warm amber/yellow)
      return 'brightness(1.05) contrast(1.06) saturate(1.12) sepia(0.12)';
    } else {
      // Scene 6: Neutral pure black
      return 'none';
    }
  }, [currentTime]);

  // Comments visible during Scene 2
  const visibleComments = useMemo(() => {
    if (currentTime < 7 || currentTime >= 17.5) return [];
    return SCENE_COMMENTS.slice(1).filter(c => currentTime >= c.timeAppear);
  }, [currentTime]);

  // Scene 1 special notification popup
  const showScene1Notification = currentTime >= 2.0 && currentTime < 7.0;

  // Scene 3 subtitle text (19.0s ~ 26.5s)
  const showScene3Text = currentTime >= 19.0 && currentTime < 26.8;

  // Scene 4 subtitle text (31.0s ~ 36.8s)
  const showScene4Text = currentTime >= 30.5 && currentTime < 36.8;

  // Scene 6 title card (50.5s ~ 59.5s)
  const showScene6Title = currentTime >= 50.8 && currentTime < 58.8;
  const showScene6Sub = currentTime >= 53.0 && currentTime < 58.8;

  // Fade in / fade out at start and end
  const globalFadeOpacity = useMemo(() => {
    if (currentTime < 1.0) return currentTime / 1.0;
    if (currentTime > 58.5) return Math.max(0, (60.0 - currentTime) / 1.5);
    return 1;
  }, [currentTime]);

  return (
    <div
      onClick={onTogglePlay}
      className={`relative w-full mx-auto overflow-hidden bg-black select-none cursor-pointer group shadow-2xl transition-all duration-500 ${
        aspectRatio === '2.39:1' ? 'aspect-[2.39/1]' : 'aspect-video'
      }`}
      style={{
        maxHeight: 'calc(100vh - 180px)',
      }}
    >
      {/* 2.39:1 CinemaScope letterbox bars if enabled */}
      {aspectRatio === '2.39:1' && (
        <>
          <div className="absolute top-0 left-0 right-0 h-4 bg-black z-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-black z-40 pointer-events-none" />
        </>
      )}

      {/* Main visual layer */}
      <div
        className="w-full h-full relative overflow-hidden"
        style={{
          opacity: globalFadeOpacity,
          filter: colorGradingFilter,
        }}
      >
        {/* Background Image by Scene */}
        {activeScene.image ? (
          <img
            src={activeScene.image}
            alt={activeScene.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover origin-center"
            style={cameraStyle}
          />
        ) : (
          <div className="w-full h-full bg-black" />
        )}

        {/* 35mm film grain overlay */}
        <div className="absolute inset-0 film-grain pointer-events-none mix-blend-overlay opacity-60 z-10" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 cinematic-vignette pointer-events-none z-10" />

        {/* Scene 1: Smartphone Screen Notification Overlay */}
        {showScene1Notification && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-all duration-700 animate-in fade-in">
            <div className="max-w-md w-11/12 sm:w-auto px-5 py-3.5 rounded-xl bg-black/75 backdrop-blur-md border border-cyan-500/30 text-white shadow-2xl transform -translate-y-4">
              <div className="flex items-center gap-2 mb-1.5 text-xs text-cyan-400 font-sans-kr tracking-wider">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>SNS 실시간 댓글 알림</span>
                <span className="text-zinc-500 text-[10px]">방금 전</span>
              </div>
              <p className="text-sm sm:text-base font-sans-kr font-medium text-zinc-100 tracking-tight leading-snug">
                「넌 아무도 필요로 하지 않는 사람이야.」
              </p>
            </div>
          </div>
        )}

        {/* Scene 2: Glitch and Multiplying Malicious Comments */}
        {currentTime >= 7 && currentTime < 17 && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {/* Chromatic aberration jitter overlay during peak */}
            {currentTime >= 11 && currentTime <= 16 && (
              <div className="absolute inset-0 bg-cyan-500/5 mix-blend-color-dodge animate-glitch pointer-events-none" />
            )}

            {visibleComments.map((comment, idx) => (
              <div
                key={comment.id}
                className="absolute transform transition-all duration-300 animate-in fade-in zoom-in-95"
                style={{
                  top: comment.position.top,
                  bottom: comment.position.bottom,
                  left: comment.position.left,
                  right: comment.position.right,
                  animationDelay: `${idx * 80}ms`
                }}
              >
                <div className={`px-4 py-2.5 rounded-lg border backdrop-blur-md text-white shadow-xl ${
                  comment.severity === 'critical'
                    ? 'bg-red-950/70 border-red-500/40 text-red-100'
                    : 'bg-zinc-900/80 border-zinc-700/60 text-zinc-200'
                }`}>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-0.5">
                    <span className="font-mono text-zinc-500">{comment.handle}</span>
                    <span>·</span>
                    <span className="text-red-400/80">악성 댓글</span>
                  </div>
                  <p className="text-sm font-sans-kr font-medium tracking-tight">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scene 3: Solemn Screen Text (19s ~ 26.5s) */}
        {showScene3Text && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 transition-all duration-1000 animate-in fade-in">
            <div className="max-w-2xl px-6 text-center">
              <p className="text-lg sm:text-2xl md:text-3xl font-serif-kr font-light text-zinc-100 tracking-wide leading-relaxed drop-shadow-md">
                누군가에게는 가벼운 댓글이지만,<br />
                <span className="text-zinc-300 font-normal">누군가에게는 오래 남는 상처가 됩니다.</span>
              </p>
            </div>
          </div>
        )}

        {/* Scene 4: Golden ember of light and text (30s ~ 37s) */}
        {showScene4Text && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 transition-all duration-1000 animate-in fade-in">
            <div className="max-w-xl px-6 text-center mt-28 sm:mt-36">
              <p className="text-lg sm:text-2xl md:text-3xl font-serif-kr font-normal text-amber-100/95 tracking-widest leading-relaxed drop-shadow-lg">
                화면 너머에도 사람이 있습니다.
              </p>
              <div className="mt-3 w-12 h-px bg-amber-300/40 mx-auto" />
            </div>
          </div>
        )}

        {/* Scene 5: Warm morning gentle sunbeam overlay */}
        {currentTime >= 37 && currentTime < 50 && (
          <div className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-tr from-amber-500/10 via-amber-200/5 to-transparent mix-blend-soft-light transition-opacity duration-1000" />
        )}

        {/* Scene 6 / Outro: Title Card and Slogan (50.5s ~ 59s) */}
        {currentTime >= 50 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black pointer-events-none z-30">
            {showScene6Title && (
              <div className="text-center transition-all duration-1000 animate-in fade-in">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-kr font-bold tracking-widest text-white mb-4 drop-shadow-2xl">
                  말은 남는다.
                </h1>
                {showScene6Sub && (
                  <p className="text-base sm:text-xl md:text-2xl font-serif-kr font-light tracking-wide text-zinc-300 transition-all duration-1000 animate-in fade-in delay-300">
                    상처 대신 따뜻함을 남기세요.
                  </p>
                )}
                <div className="mt-8 flex items-center justify-center gap-3 text-xs text-zinc-600 font-sans-kr tracking-wider uppercase">
                  <span>디지털 미디어 공모전 출품작</span>
                  <span>·</span>
                  <span>60 Sec Short Film</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subtitles Bar (Bottom 16:9 Safe Area) */}
      {subtitlesEnabled && activeScene.mainDialogue && (
        <div className="absolute bottom-8 sm:bottom-10 left-0 right-0 flex justify-center pointer-events-none z-35 px-4">
          <div className="bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded text-center max-w-xl">
            <p className="text-xs sm:text-sm font-sans-kr font-medium text-white/90 tracking-wide drop-shadow">
              {activeScene.mainDialogue.split('\n')[0]}
            </p>
          </div>
        </div>
      )}

      {/* Director's Camera & Scene HUD Overlay (Toggleable) */}
      {showDirectorHud && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-35 font-mono text-[11px] text-zinc-400">
          <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded border border-zinc-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-zinc-200 font-semibold">{activeScene.numberStr}</span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-300">{activeScene.title}</span>
            <span className="text-zinc-600">({activeScene.startTime}s - {activeScene.endTime}s)</span>
          </div>

          <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded border border-zinc-800 text-right">
            <span className="text-amber-400">1920×1080 FHD</span>
            <span className="text-zinc-600 ml-2">60FPS</span>
          </div>
        </div>
      )}

      {/* Play/Pause Center Indicator on hover when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px] z-40 transition-opacity">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md shadow-2xl transition-transform transform group-hover:scale-105">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Subtle Time Badge in top-right */}
      <div className="absolute top-3 right-3 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono text-zinc-400 border border-zinc-800">
          {currentTime.toFixed(1)}s / 60.0s
        </span>
      </div>
    </div>
  );
};
