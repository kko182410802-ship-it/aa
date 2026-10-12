/**
 * Types for the short film 「말은 남는다」 (Words Remain)
 */

export interface SceneInfo {
  id: number;
  numberStr: string;
  title: string;
  subtitle: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  image: string;
  tone: string;
  cameraMovement: string;
  lightingDescription: string;
  soundCue: string;
  narrativeText?: string;
  mainDialogue?: string;
  directorNotes: string;
}

export interface FloatingComment {
  id: string;
  text: string;
  author: string;
  handle: string;
  timeAppear: number; // seconds
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  severity: 'high' | 'critical';
}

export type AspectRatioMode = '16:9' | '2.39:1';
