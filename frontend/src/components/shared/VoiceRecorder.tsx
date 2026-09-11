import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  Trash2,
  Volume2,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Types for Web Speech API
interface IWindowSpeechRecognition extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  onAudioReady: (audio: { blob: Blob; dataUrl: string; duration: number; name: string } | null) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscript, onAudioReady, disabled = false }: VoiceRecorderProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('hi') ? 'hi-IN' : 'en-IN';

  // Dictation (Speech to Text) States
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Audio Recording (MediaRecorder) States
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ----------------------------------------------------
  // 1. Live Speech Dictation (Speech-to-Text)
  // ----------------------------------------------------
  const toggleDictation = useCallback(() => {
    if (disabled || isRecordingAudio) return;

    if (isDictating) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsDictating(false);
      return;
    }

    const win = window as unknown as IWindowSpeechRecognition;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        currentLang.startsWith('hi')
          ? 'आपके ब्राउज़र में आवाज़ पहचान (Speech Recognition) समर्थित नहीं है। कृपया आवाज़ नोट रिकॉर्ड करें।'
          : 'Speech recognition is not supported in your browser. Please use the Audio Recording feature.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = currentLang;

      recognition.onstart = () => {
        setIsDictating(true);
        toast.info(
          currentLang.startsWith('hi')
            ? 'माइक चालू है — कृपया अपनी समस्या स्पष्ट बोलें...'
            : 'Microphone listening — please describe your issue clearly...'
        );
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript + ' ';
          }
        }
        if (finalTranscript.trim()) {
          onTranscript(finalTranscript.trim());
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('SpeechRecognition error:', err);
        if (err.error !== 'no-speech') {
          toast.error(
            currentLang.startsWith('hi')
              ? 'आवाज़ पहचान में रुकावट आई। कृपया पुनः प्रयास करें।'
              : 'Voice recognition issue. Please check microphone access.'
          );
        }
        setIsDictating(false);
      };

      recognition.onend = () => {
        setIsDictating(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setIsDictating(false);
    }
  }, [disabled, isRecordingAudio, isDictating, currentLang, onTranscript]);

  // ----------------------------------------------------
  // 2. Audio Note Recording (MediaRecorder API)
  // ----------------------------------------------------
  const startAudioRecording = async () => {
    if (disabled || isDictating) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Also convert to data URL for persistence and attachment
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          onAudioReady({
            blob: audioBlob,
            dataUrl,
            duration: recordingSeconds,
            name: `Grievance_Voice_Note_${Date.now()}.webm`,
          });
        };
        reader.readAsDataURL(audioBlob);

        // Stop all media tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start(250); // collect 250ms chunks
      setIsRecordingAudio(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 120) {
            // Auto-stop at 2 minutes
            stopAudioRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied or unavailable:', err);
      toast.error(
        currentLang.startsWith('hi')
          ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।'
          : 'Microphone access denied. Please grant microphone permissions in browser settings.'
      );
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecordingAudio(false);
    setAudioDuration(recordingSeconds);
    toast.success(
      currentLang.startsWith('hi')
        ? 'आवाज़ संदेश सफलतापूर्वक रिकॉर्ड हो गया!'
        : 'Voice note recorded successfully!'
    );
  };

  const deleteAudioRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioDuration(0);
    setRecordingSeconds(0);
    setIsPlayingAudio(false);
    onAudioReady(null);
    toast.info(
      currentLang.startsWith('hi') ? 'आवाज़ रिकॉर्डिंग हटा दी गई।' : 'Voice recording discarded.'
    );
  };

  const togglePlayback = () => {
    if (!audioElementRef.current) return;
    if (isPlayingAudio) {
      audioElementRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioElementRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {/* Action Row: Dictate & Record Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-dashed border-border/70">
        <div className="flex items-center gap-2">
          {/* 1. Speech Dictation Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleDictation}
            disabled={disabled || isRecordingAudio}
            className={cn(
              'h-8 px-3 rounded-lg text-xs font-bold gap-1.5 transition-all cursor-pointer border',
              isDictating
                ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 animate-pulse'
                : 'border-border/80 hover:bg-secondary text-foreground'
            )}
            title={
              isDictating
                ? t('voice.stopDictation', 'बोलना बंद करें (Stop Dictation)')
                : t('voice.startDictation', 'बोलकर लिखें (Dictate via Voice)')
            }
          >
            {isDictating ? (
              <>
                <MicOff className="h-3.5 w-3.5 text-rose-600 animate-bounce" />
                <span>{t('voice.listening', 'सुन रहा है... (Listening)')}</span>
              </>
            ) : (
              <>
                <Mic className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('voice.dictateText', 'बोलकर लिखें')}</span>
              </>
            )}
          </Button>

          {/* 2. Voice Note Audio Clip Recording Button */}
          {!audioUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
              disabled={disabled || isDictating}
              className={cn(
                'h-8 px-3 rounded-lg text-xs font-bold gap-1.5 transition-all cursor-pointer border',
                isRecordingAudio
                  ? 'bg-red-600 text-white hover:bg-red-700 border-red-600 shadow-md'
                  : 'border-border/80 hover:bg-secondary text-foreground'
              )}
            >
              {isRecordingAudio ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>
                    {t('voice.stopRecord', 'रोकें')} ({formatSeconds(recordingSeconds)})
                  </span>
                </>
              ) : (
                <>
                  <Radio className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{t('voice.recordClip', 'आवाज संदेश रिकॉर्ड करें')}</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Live Audio Visualizer / Status Indicator */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
          {isDictating && (
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              {t('voice.speakNow', 'स्पष्ट बोलें (Hindi/English)')}
            </span>
          )}

          {isRecordingAudio && (
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />
              <span>{formatSeconds(recordingSeconds)} / 02:00</span>
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-1 bg-rose-600 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                <span className="w-1 bg-rose-600 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-2" />
                <span className="w-1 bg-rose-600 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3.5" />
                <span className="w-1 bg-rose-600 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-1.5" />
              </div>
            </div>
          )}

          {!isDictating && !isRecordingAudio && !audioUrl && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10.5px]">
              <Volume2 className="h-3 w-3 text-muted-foreground" />
              {t('voice.accessibleHelp', 'आवाज से दर्ज करें (ग्रामीण व बोलचाल सुविधा)')}
            </span>
          )}
        </div>
      </div>

      {/* 3. Recorded Audio Note Preview Player */}
      {audioUrl && (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between gap-3 animate-fade-in">
          <audio
            ref={audioElementRef}
            src={audioUrl}
            onEnded={() => setIsPlayingAudio(false)}
            className="hidden"
          />

          <div className="flex items-center gap-2.5 min-w-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={togglePlayback}
              className="h-8 w-8 p-0 rounded-full bg-card hover:bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 shrink-0 cursor-pointer shadow-2xs"
            >
              {isPlayingAudio ? (
                <Pause className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
              )}
            </Button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground truncate">
                  {t('voice.attachedVoiceNote', 'संलग्न आवाज संदेश (Voice Grievance)')}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="h-3 w-3" />
                  {formatSeconds(audioDuration)}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono block">
                {t('voice.attachedNoteDesc', 'अधिकारी एवं AI सत्यापन हेतु ऑडियो प्रमाण संलग्न है')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={deleteAudioRecording}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
              title={t('voice.discardAudio', 'हटाएँ')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
