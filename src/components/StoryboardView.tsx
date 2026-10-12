import React from 'react';
import { FILM_SCENES } from '../data/filmData';
import { Play, Clock, Video, Lightbulb, Music, MessageSquare } from 'lucide-react';

interface StoryboardViewProps {
  currentSceneId: number;
  onSelectScene: (startTime: number) => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  currentSceneId,
  onSelectScene
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-zinc-800">
        <div>
          <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">
            Production Storyboard & Scene Breakdown
          </span>
          <h2 className="text-xl sm:text-2xl font-serif-kr font-bold text-white mt-1">
            장면별 연출 의도 및 샷 구성
          </h2>
        </div>
        <p className="text-xs text-zinc-400 mt-2 sm:mt-0 font-sans-kr">
          총 6개 시퀀스 · 60초 러닝타임 · 1920×1080 16:9 규격
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FILM_SCENES.map((scene) => {
          const isCurrent = currentSceneId === scene.id;
          return (
            <div
              key={scene.id}
              className={`group flex flex-col rounded-xl overflow-hidden border transition-all duration-300 bg-zinc-900/60 backdrop-blur-sm ${
                isCurrent
                  ? 'border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                  : 'border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              {/* Thumbnail / Still Frame */}
              <div
                onClick={() => onSelectScene(scene.startTime)}
                className="relative aspect-video w-full bg-black cursor-pointer overflow-hidden"
              >
                {scene.image ? (
                  <img
                    src={scene.image}
                    alt={scene.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-4 text-center">
                    <p className="font-serif-kr text-base font-bold text-white">말은 남는다.</p>
                    <p className="font-serif-kr text-xs text-zinc-400 mt-1">상처 대신 따뜻함을 남기세요.</p>
                  </div>
                )}

                {/* Badge for Timecode */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-zinc-700/80 text-[11px] font-mono text-zinc-200 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{scene.startTime}s ~ {scene.endTime}s</span>
                </div>

                {/* Badge for Scene Number */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-500/90 text-black font-semibold text-[10px] uppercase tracking-wide">
                  {scene.numberStr}
                </div>

                {/* Hover Play Prompt */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-base font-serif-kr font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                      {scene.title}
                    </h3>
                    <span className="text-xs text-zinc-500 font-mono">{scene.subtitle}</span>
                  </div>

                  {/* Main Script or Dialogue */}
                  {scene.mainDialogue && (
                    <div className="my-2.5 p-2.5 rounded-lg bg-black/40 border border-zinc-800/80">
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-mono">
                        <MessageSquare className="w-3 h-3 text-cyan-400" />
                        <span>핵심 대사 / 자막 문구</span>
                      </div>
                      <p className="text-xs font-serif-kr text-zinc-200 whitespace-pre-line leading-relaxed">
                        {scene.mainDialogue}
                      </p>
                    </div>
                  )}

                  {/* Scene Specs details */}
                  <div className="space-y-1.5 mt-3 text-xs text-zinc-400">
                    <div className="flex items-start gap-2">
                      <Video className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        <strong className="text-zinc-300 font-medium">카메라 워크:</strong> {scene.cameraMovement}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        <strong className="text-zinc-300 font-medium">조명 & 색감:</strong> {scene.lightingDescription}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Music className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        <strong className="text-zinc-300 font-medium">사운드 큐:</strong> {scene.soundCue}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Director's Note */}
                <div className="mt-4 pt-3 border-t border-zinc-800/60">
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans-kr italic">
                    💡 <span className="text-zinc-300 not-italic font-medium">연출 노트:</span> {scene.directorNotes}
                  </p>

                  <button
                    onClick={() => onSelectScene(scene.startTime)}
                    className="mt-3 w-full py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>이 씬 재생하기 ({scene.startTime}초)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
