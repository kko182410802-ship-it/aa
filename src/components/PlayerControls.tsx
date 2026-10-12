import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Subtitles,
  Film,
  Camera,
  FastForward,
  Rewind
} from 'lucide-react';
import { FILM_SCENES, TOTAL_DURATION } from '../data/filmData';
import { AspectRatioMode } from '../types/film';
import { soundtrack } from '../services/soundtrackEngine';

interface PlayerControlsProps {
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  aspectRatio: AspectRatioMode;
  showDirectorHud: boolean;
  subtitlesEnabled: boolean;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onRestart: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleAspectRatio: () => void;
  onToggleDirectorHud: () => void;
  onToggleSubtitles: () => void;
  onToggleFullscreen: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentTime,
  isPlaying,
  volume,
  isMuted,
  aspectRatio,
  showDirectorHud,
  subtitlesEnabled,
  isFullscreen,
  onTogglePlay,
  onSeek,
  onRestart,
  onVolumeChange,
  onToggleMute,
  onToggleAspectRatio,
  onToggleDirectorHud,
  onToggleSubtitles,
  onToggleFullscreen
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isHoveringBar, setIsHoveringBar] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percentage * TOTAL_DURATION);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percentage = mouseX / rect.width;
    setHoverPosition(mouseX);
    setHoverTime(percentage * TOTAL_DURATION);
  };

  return (
    <div className="w-full bg-zinc-950/90 border-t border-zinc-800/80 px-4 py-3 text-zinc-300">
      {/* Progress Bar & Scene Chapter Markers */}
      <div
        ref={progressBarRef}
        onClick={handleSeekClick}
        onMouseEnter={() => setIsHoveringBar(true)}
        onMouseLeave={() => setIsHoveringBar(false)}
        onMouseMove={handleMouseMove}
        className="group relative w-full h-3 cursor-pointer flex items-center mb-3"
      >
        {/* Track background */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden transition-all group-hover:h-2 relative">
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-amber-500 rounded-full"
            style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
          />
        </div>

        {/* Scene Chapter Notch Markers */}
        {FILM_SCENES.map((scene) => {
          const leftPercent = (scene.startTime / TOTAL_DURATION) * 100;
          return (
            <div
              key={scene.id}
              className="absolute top-0 bottom-0 w-0.5 bg-zinc-600/80 hover:bg-amber-400 z-10 transition-colors"
              style={{ left: `${leftPercent}%` }}
              title={`${scene.numberStr}: ${scene.title} (${scene.startTime}s)`}
            />
          );
        })}

        {/* Scrubber thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md border border-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `calc(${(currentTime / TOTAL_DURATION) * 100}% - 7px)` }}
        />

        {/* Hover preview tooltip */}
        {isHoveringBar && hoverTime !== null && (
          <div
            className="absolute -top-9 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-[11px] font-mono text-zinc-200 pointer-events-none shadow-lg -translate-x-1/2 z-30"
            style={{ left: `${hoverPosition}px` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {/* Control Buttons & Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="p-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm focus:outline-none"
            title={isPlaying ? '일시정지 (스페이스바)' : '재생 (스페이스바)'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={onRestart}
            className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="처음부터 재생"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSeek(Math.max(0, currentTime - 5))}
            className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="5초 뒤로"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSeek(Math.min(TOTAL_DURATION, currentTime + 5))}
            className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="5초 앞으로"
          >
            <FastForward className="w-4 h-4" />
          </button>

          {/* Time display */}
          <div className="text-xs font-mono text-zinc-400 ml-2">
            <span className="text-zinc-100 font-semibold">{formatTime(currentTime)}</span>
            <span className="text-zinc-600 mx-1">/</span>
            <span>{formatTime(TOTAL_DURATION)}</span>
          </div>
        </div>

        {/* Center: Quick Scene Jump Navigation */}
        <div className="hidden md:flex items-center gap-1 text-xs">
          {FILM_SCENES.map((scene) => {
            const isActive = currentTime >= scene.startTime && currentTime < scene.endTime;
            return (
              <button
                key={scene.id}
                onClick={() => onSeek(scene.startTime)}
                className={`px-2.5 py-1 rounded transition-colors font-sans-kr text-[11px] ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
                }`}
              >
                {scene.id}. {scene.title}
              </button>
            );
          })}
        </div>

        {/* Right: Audio, Subtitles, HUD, Aspect, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Volume slider */}
          <div className="flex items-center gap-1.5 group">
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onVolumeChange(val);
                if (isMuted && val > 0) onToggleMute();
              }}
              className="w-16 h-1 accent-amber-500 bg-zinc-700 rounded cursor-pointer"
            />
          </div>

          <div className="w-px h-4 bg-zinc-800 mx-1" />

          {/* Subtitles (CC) Toggle */}
          <button
            onClick={onToggleSubtitles}
            className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
              subtitlesEnabled
                ? 'bg-zinc-800 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="자막 켜기/끄기"
          >
            <Subtitles className="w-4 h-4" />
          </button>

          {/* Director HUD Toggle */}
          <button
            onClick={onToggleDirectorHud}
            className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
              showDirectorHud
                ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="연출/촬영 가이드 HUD 오버레이"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Aspect Ratio Toggle (16:9 / 2.39:1) */}
          <button
            onClick={onToggleAspectRatio}
            className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-[11px] font-mono transition-colors"
            title="화면비 변경 (16:9 ↔ 2.39:1 CinemaScope)"
          >
            {aspectRatio}
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="전체화면"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
