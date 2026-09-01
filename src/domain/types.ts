export type ActionType = 'none' | 'text' | 'url' | 'coupon' | 'reward';

export interface RichMenuAction {
  id: string;
  type: ActionType;
  value: string;
}

export interface Area {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RichMenuTemplate {
  id: string;
  label: string;
  size: 'large' | 'compact';
  aspectRatio: number;
  areas: Area[];
}

export interface RichMenuDraft {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  templateId: string;
  imageDataUrl: string;
  imageName: string;
  actions: Record<string, RichMenuAction>;
  chatBarTextMode: 'menu' | 'custom';
  chatBarText: string;
  initialDisplay: 'show' | 'hide';
  showFrame: boolean;
}
