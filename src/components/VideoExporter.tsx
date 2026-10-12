import React, { useState, useRef } from 'react';
import { Download, Film, CheckCircle2, Loader2, Sparkles, X, AlertCircle } from 'lucide-react';
import { FILM_SCENES, SCENE_COMMENTS, TOTAL_DURATION } from '../data/filmData';

interface VideoExporterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoExporter: React.FC<VideoExporterProps> = ({ isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const abortControllerRef = useRef(false);

  if (!isOpen) return null;

  const handleStartRender = async () => {
    setIsExporting(true);
    setProgress(0);
    setDownloadUrl(null);
    abortControllerRef.current = false;
    setStatusMessage('1920×1080 캔버스 렌더러 초기화 및 시네마틱 씬 이미지 로딩 중...');

    try {
      // Create offscreen canvas for 1920x1080 FHD rendering
      const width = 1920;
      const height = 1080;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context unavailable');
      }

      // Preload scene images
      setStatusMessage('시네마틱 원본 프레임 에셋 준비 중...');
      const loadedImages: { [key: number]: HTMLImageElement | null } = {};

      for (const scene of FILM_SCENES) {
        if (scene.image) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = scene.image;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // continue on error fallback
          });
          loadedImages[scene.id] = img;
        } else {
          loadedImages[scene.id] = null;
        }
      }

      // Check MediaRecorder support
      if (typeof MediaRecorder === 'undefined') {
        throw new Error('MediaRecorder is not supported in this browser.');
      }

      const stream = canvas.captureStream(30); // 30 fps
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
        videoBitsPerSecond: 8000000 // 8 Mbps high quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.start();

      // Render loop across 60 seconds (sampled at 100ms for smooth synthesis)
      const totalSteps = 600; // 60 seconds * 10 samples per sec
      const stepDuration = TOTAL_DURATION / totalSteps;

      for (let step = 0; step < totalSteps; step++) {
        if (abortControllerRef.current) {
          mediaRecorder.stop();
          setIsExporting(false);
          return;
        }

        const t = step * stepDuration;
        const currentProgress = Math.round((step / totalSteps) * 100);
        setProgress(currentProgress);
        setStatusMessage(`1920×1080 비디오 렌더링 중... [${t.toFixed(1)}s / 60.0s] (${currentProgress}%)`);

        // Draw frame at time `t`
        drawFrame(ctx, width, height, t, loadedImages);

        // Small yield so UI updates smoothly
        await new Promise((r) => setTimeout(r, 10));
      }

      setStatusMessage('비디오 인코딩 마무리 및 WebM 파일 생성 중...');
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setIsExporting(false);
        setProgress(100);
        setStatusMessage('렌더링 완료! 아래 버튼을 눌러 공모전 출품용 비디오를 다운로드하세요.');
      };

      mediaRecorder.stop();
    } catch (err) {
      console.error(err);
      setIsExporting(false);
      setStatusMessage('렌더링 중 오류가 발생했습니다. 브라우저 지원 여부를 확인해주세요.');
    }
  };

  // Helper function to draw frame at time `t`
  const drawFrame = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    images: { [key: number]: HTMLImageElement | null }
  ) => {
    // Determine active scene
    const scene = FILM_SCENES.find(
      s => t >= s.startTime && (t < s.endTime || (s.id === 6 && t <= s.endTime))
    ) || FILM_SCENES[0];

    // Background fill
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    const img = images[scene.id];
    if (img && scene.id !== 6) {
      ctx.save();

      // Camera motion interpolation
      let scale = 1.0;
      let panX = 0;
      let panY = 0;

      if (t < 7) {
        scale = 1.0 + (t / 7) * 0.1;
      } else if (t < 17) {
        scale = 1.08 + Math.sin(t * 8) * 0.01;
      } else if (t < 27) {
        scale = 1.02 + ((t - 17) / 10) * 0.08;
      } else if (t < 37) {
        scale = 1.0 + Math.sin(((t - 27) / 10) * Math.PI) * 0.04;
      } else if (t < 50) {
        scale = 1.06 - ((t - 37) / 13) * 0.04;
        panX = (1 - (t - 37) / 13) * 20;
      }

      // Draw image centered with scale
      const drawW = w * scale;
      const drawH = h * scale;
      const dx = (w - drawW) / 2 + panX;
      const dy = (h - drawH) / 2 + panY;

      ctx.drawImage(img, dx, dy, drawW, drawH);

      // Color grade tint
      if (t < 27) {
        // Cold blue filter
        ctx.fillStyle = 'rgba(0, 30, 60, 0.15)';
        ctx.fillRect(0, 0, w, h);
      } else if (t >= 37 && t < 50) {
        // Warm golden sunlight filter
        ctx.fillStyle = 'rgba(255, 200, 100, 0.12)';
        ctx.fillRect(0, 0, w, h);
      }

      ctx.restore();
    }

    // Vignette
    const gradient = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.85);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Text & Subtitles rendering on canvas
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Scene 1 Notification
    if (t >= 2.0 && t < 7.0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.roundRect(w / 2 - 380, h / 2 - 60, 760, 120, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '500 24px "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#22d3ee';
      ctx.fillText('SNS 실시간 댓글 알림', w / 2, h / 2 - 24);

      ctx.font = '600 32px "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('「넌 아무도 필요로 하지 않는 사람이야.」', w / 2, h / 2 + 24);
    }

    // Scene 2 Hurtful Comments
    if (t >= 7.0 && t < 17.0) {
      const comments = SCENE_COMMENTS.slice(1).filter(c => t >= c.timeAppear);
      comments.forEach((c) => {
        ctx.fillStyle = 'rgba(20, 20, 25, 0.85)';
        // positions approximate
        let cx = w * 0.5;
        let cy = h * 0.5;
        if (c.id === 'c2') { cx = w * 0.7; cy = h * 0.28; }
        if (c.id === 'c3') { cx = w * 0.3; cy = h * 0.48; }
        if (c.id === 'c4') { cx = w * 0.68; cy = h * 0.68; }
        if (c.id === 'c5') { cx = w * 0.45; cy = h * 0.34; }
        if (c.id === 'c6') { cx = w * 0.35; cy = h * 0.75; }

        ctx.fillRect(cx - 240, cy - 35, 480, 70);
        ctx.strokeStyle = c.severity === 'critical' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(113, 113, 122, 0.5)';
        ctx.strokeRect(cx - 240, cy - 35, 480, 70);

        ctx.font = '500 26px "Noto Sans KR", sans-serif';
        ctx.fillStyle = '#f4f4f5';
        ctx.fillText(c.text, cx, cy);
      });
    }

    // Scene 3 Solemn Text
    if (t >= 19.0 && t < 26.8) {
      ctx.font = '300 42px "Noto Serif KR", serif';
      ctx.fillStyle = '#f4f4f5';
      ctx.fillText('누군가에게는 가벼운 댓글이지만,', w / 2, h / 2 - 30);
      ctx.font = '400 44px "Noto Serif KR", serif';
      ctx.fillStyle = '#e4e4e7';
      ctx.fillText('누군가에게는 오래 남는 상처가 됩니다.', w / 2, h / 2 + 35);
    }

    // Scene 4 Hope Text
    if (t >= 30.5 && t < 36.8) {
      ctx.font = '400 48px "Noto Serif KR", serif';
      ctx.fillStyle = '#fef3c7';
      ctx.fillText('화면 너머에도 사람이 있습니다.', w / 2, h / 2 + 180);
    }

    // Scene 6 Title & Slogan
    if (t >= 50.8 && t < 58.8) {
      ctx.font = '700 80px "Noto Serif KR", serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('말은 남는다.', w / 2, h / 2 - 40);

      if (t >= 53.0) {
        ctx.font = '300 36px "Noto Serif KR", serif';
        ctx.fillStyle = '#d4d4d8';
        ctx.fillText('상처 대신 따뜻함을 남기세요.', w / 2, h / 2 + 50);
      }
    }

    // Safe Area watermark
    ctx.textAlign = 'right';
    ctx.font = '400 18px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(`1920×1080 FHD | ${t.toFixed(1)}s`, w - 40, h - 35);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-zinc-200">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-kr text-lg font-bold text-white">공모전 출품작 비디오 내보내기</h3>
              <p className="text-xs text-zinc-400">1920×1080 Full HD · 60초 풀 시퀀스 렌더링</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span>작품명:</span>
              <span className="font-semibold text-zinc-200">「말은 남는다」 (Words Remain)</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>렌더링 해상도:</span>
              <span className="font-mono text-zinc-200">1920 × 1080 (16:9)</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>비디오 형식:</span>
              <span className="font-mono text-zinc-200">WebM (VP9 / High Bitrate)</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>총 러닝타임:</span>
              <span className="font-mono text-amber-400">60.0 초 (전체 6개 장면)</span>
            </div>
          </div>

          {/* Progress or status */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">인코딩 진행률</span>
                <span className="text-cyan-400 font-semibold">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>{statusMessage}</span>
              </p>
            </div>
          )}

          {downloadUrl && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-sm">비디오 렌더링 완료!</p>
                <p className="text-zinc-300 mt-0.5">
                  1920×1080 해상도의 완성본 비디오가 준비되었습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
          >
            닫기
          </button>

          {!downloadUrl ? (
            <button
              onClick={handleStartRender}
              disabled={isExporting}
              className="py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium transition-colors flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>렌더링 중 ({progress}%)</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  <span>1080p 비디오 렌더링 시작</span>
                </>
              )}
            </button>
          ) : (
            <a
              href={downloadUrl}
              download="말은_남는다_디지털미디어공모전_출품작.webm"
              className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>완성 비디오 파일 다운로드 (.webm)</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
