// Types for KRISHNA.EXE interactive character system

export type KrishnaState =
  | "idle"
  | "walk_left"
  | "walk_right"
  | "typing"
  | "thinking"
  | "terminal"
  | "success"
  | "error"
  | "happy"
  | "confused"
  | "chai"
  | "reading"
  | "sleeping";

export type EmoteState = Exclude<KrishnaState, "idle" | "walk_left" | "walk_right">;

export interface AnimationDefinition {
  state: KrishnaState;
  frames: string[];
  frameInterval: number; // in milliseconds per frame
  aspectRatio: "2:3" | "1:1";
  gifUrl?: string;
  description: string;
}

export type PriorityLevel = 0 | 1 | 2 | 3 | 4;

export interface KrishnaPosition {
  x: number; // distance in px from left, or relative
  y: number; // distance in px from bottom
  facing: "left" | "right";
}

export interface KrishnaContextValue {
  currentState: KrishnaState;
  ambientState: KrishnaState;
  temporaryEmote: KrishnaState | null;
  bubbleText: string | null;
  position: KrishnaPosition;
  isSleeping: boolean;
  requestEmote: (emote: KrishnaState, durationMs?: number, speechText?: string) => void;
  setAmbientState: (state: KrishnaState) => void;
  walkTo: (targetX: number) => void;
  wakeUp: () => void;
  startPatrol: (delayMs?: number) => void;
}
