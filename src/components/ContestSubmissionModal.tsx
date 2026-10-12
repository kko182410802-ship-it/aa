import React, { useState } from 'react';
import { CONTEST_METADATA, FILM_SCENES } from '../data/filmData';
import { Award, FileText, CheckCircle2, Copy, Download, Share2, Sparkles, X } from 'lucide-react';

interface ContestSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTime: (time: number) => void;
}

export const ContestSubmissionModal: React.FC<ContestSubmissionModalProps> = ({
  isOpen,
  onClose,
  onJumpToTime
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'statement' | 'synopsis' | 'specs' | 'script'>('statement');

  if (!isOpen) return null;

  const handleCopySynopsis = () => {
    navigator.clipboard.writeText(
      `[디지털 미디어 공모전 출품작]\n제목: ${CONTEST_METADATA.title} (${CONTEST_METADATA.englishTitle})\n\n[기획 의도]\n${CONTEST_METADATA.directorsStatement}\n\n[시놉시스]\n${CONTEST_METADATA.synopsis}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800/80 flex items-start justify-between bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>{CONTEST_METADATA.category}</span>
                <span>·</span>
                <span>공식 출품 기획서</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-kr font-bold text-white mt-0.5">
                「말은 남는다」 (Words Remain)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 px-6 bg-zinc-900/20 text-xs font-medium">
          <button
            onClick={() => setActiveTab('statement')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'statement'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            기획 의도 & 주제 의식
          </button>
          <button
            onClick={() => setActiveTab('synopsis')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'synopsis'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            시놉시스 & 줄거리
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            제작 사양 & 기술 큐시트
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'script'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            대본 및 주요 자막
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm leading-relaxed text-zinc-300">
          {activeTab === 'statement' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <h4 className="font-serif-kr text-base font-bold text-amber-300 mb-2">
                  기획 의도 (Director's Statement)
                </h4>
                <p className="font-sans-kr whitespace-pre-line text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  {CONTEST_METADATA.directorsStatement}
                </p>
              </div>

              <div>
                <h4 className="font-serif-kr text-base font-bold text-zinc-100 mb-2">
                  핵심 사회적 메시지
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <p className="font-semibold text-red-300 mb-1">1. 비대면의 탈인간화(De-individuation) 경고</p>
                    <p className="text-zinc-400">
                      스마트폰 액정 너머의 대상이 나와 같은 호흡과 고통을 지닌 실제 인간임을 잊어버리는 현대 디지털 소통의 맹점을 조명합니다.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <p className="font-semibold text-emerald-300 mb-1">2. 언어의 잔류성과 온기의 선택</p>
                    <p className="text-zinc-400">
                      작성된 댓글은 1초 만에 지나가지만 상처는 영원히 남을 수 있습니다. 상처 대신 온기와 배려의 말을 남기자는 성찰을 촉구합니다.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-serif-kr text-base font-bold text-zinc-100 mb-2">
                  감정선의 3단계 변주 구조
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/60">
                    <span className="text-blue-400 font-mono block text-[10px]">Phase 1 (0~17s)</span>
                    <strong className="text-zinc-200 block mt-1">차디찬 침식</strong>
                    <span className="text-zinc-500 text-[11px]">차가운 블루 · 악플 폭주</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-400 font-mono block text-[10px]">Phase 2 (17~37s)</span>
                    <strong className="text-zinc-200 block mt-1">절대적 침묵 & 자각</strong>
                    <span className="text-zinc-500 text-[11px]">음악 중단 · 작은 불씨</span>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-900/60">
                    <span className="text-amber-400 font-mono block text-[10px]">Phase 3 (37~60s)</span>
                    <strong className="text-zinc-200 block mt-1">햇살과 온기</strong>
                    <span className="text-zinc-500 text-[11px]">골든 아워 · 피아노 선율</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'synopsis' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="font-serif-kr text-base font-bold text-zinc-100 mb-2">시놉시스 (Synopsis)</h4>
                <p className="font-serif-kr whitespace-pre-line text-zinc-300 leading-relaxed text-sm">
                  {CONTEST_METADATA.synopsis}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
                <h5 className="font-bold text-zinc-200 mb-2 font-serif-kr">인물 설정 및 배경</h5>
                <p className="text-zinc-400 leading-relaxed mb-2">
                  <strong>주인공:</strong> 20대 청년. 평범한 일상 속에서 SNS에 남겨진 무자비한 악성 댓글들에 의해 점차 자존감과 삶의 의욕을 잃고 홀로 방 안에 갇힌 상태.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  <strong>공간:</strong> 어둡고 닫힌 원룸. 스마트폰의 차가운 6500K 액정 불빛만이 유일한 조명이었으나, 후반부에는 활짝 갠 창밖의 맑은 아침 햇살이 비치며 치유의 공간으로 거듭남.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block">해상도</span>
                  <strong className="text-zinc-100 text-sm mt-0.5 block">{CONTEST_METADATA.format}</strong>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block">러닝타임</span>
                  <strong className="text-zinc-100 text-sm mt-0.5 block">{CONTEST_METADATA.duration}</strong>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block">프레임레이트</span>
                  <strong className="text-zinc-100 text-sm mt-0.5 block">{CONTEST_METADATA.frameRate}</strong>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block">화면비</span>
                  <strong className="text-zinc-100 text-sm mt-0.5 block">16:9 Widescreen (2.39:1 대응)</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h5 className="font-bold text-zinc-200 mb-2 font-serif-kr text-sm">제작 크레딧 (Production Credits)</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {CONTEST_METADATA.credits.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-black/40">
                      <span className="text-zinc-400">{c.role}</span>
                      <span className="text-zinc-200 font-medium">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-3 animate-in fade-in">
              <p className="text-xs text-zinc-400">
                영상 타임라인에 등장하는 핵심 내레이션 및 스크린 자막 전문입니다. 각 항목을 클릭하면 해당 장면으로 즉시 이동합니다.
              </p>
              <div className="space-y-2">
                {FILM_SCENES.map((scene) => (
                  <div
                    key={scene.id}
                    onClick={() => {
                      onJumpToTime(scene.startTime);
                      onClose();
                    }}
                    className="p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 cursor-pointer transition-colors flex items-start justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                        <span className="text-amber-400">{scene.numberStr}</span>
                        <span>·</span>
                        <span>{scene.startTime}초 ~ {scene.endTime}초</span>
                      </div>
                      <p className="text-sm font-serif-kr text-zinc-100 group-hover:text-amber-300 transition-colors">
                        {scene.mainDialogue || scene.narrativeText}
                      </p>
                    </div>
                    <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 font-mono shrink-0 ml-3">
                      재생 ➔
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            2026 디지털 미디어 공모전 출품 공식 포맷 준수
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySynopsis}
              className="py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사 완료' : '출품 기획서 복사'}</span>
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition-colors"
            >
              확인 및 닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
