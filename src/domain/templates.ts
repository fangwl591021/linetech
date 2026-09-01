import type { RichMenuTemplate } from './types';

const area = (id: string, x: number, y: number, width: number, height: number) => ({ id, x, y, width, height });

export const templates: RichMenuTemplate[] = [
  {
    id: 'large-6', label: '大・6格', size: 'large', aspectRatio: 2500 / 1686,
    areas: [
      area('A', 0, 0, 1/3, 1/2), area('B', 1/3, 0, 1/3, 1/2), area('C', 2/3, 0, 1/3, 1/2),
      area('D', 0, 1/2, 1/3, 1/2), area('E', 1/3, 1/2, 1/3, 1/2), area('F', 2/3, 1/2, 1/3, 1/2)
    ]
  },
  {
    id: 'large-4', label: '大・4格', size: 'large', aspectRatio: 2500 / 1686,
    areas: [area('A',0,0,.5,.5),area('B',.5,0,.5,.5),area('C',0,.5,.5,.5),area('D',.5,.5,.5,.5)]
  },
  {
    id: 'large-4-top', label: '大・上1下3', size: 'large', aspectRatio: 2500 / 1686,
    areas: [area('A',0,0,1,.5),area('B',0,.5,1/3,.5),area('C',1/3,.5,1/3,.5),area('D',2/3,.5,1/3,.5)]
  },
  {
    id: 'large-3-side', label: '大・左大右2', size: 'large', aspectRatio: 2500 / 1686,
    areas: [area('A',0,0,2/3,1),area('B',2/3,0,1/3,.5),area('C',2/3,.5,1/3,.5)]
  },
  {
    id: 'large-2-horizontal', label: '大・上下2格', size: 'large', aspectRatio: 2500 / 1686,
    areas: [area('A',0,0,1,.5),area('B',0,.5,1,.5)]
  },
  {
    id: 'large-2-vertical', label: '大・左右2格', size: 'large', aspectRatio: 2500 / 1686,
    areas: [area('A',0,0,.5,1),area('B',.5,0,.5,1)]
  },
  {
    id: 'large-1', label: '大・1格', size: 'large', aspectRatio: 2500 / 1686,
    areas: [area('A',0,0,1,1)]
  },
  {
    id: 'compact-3', label: '小・3格', size: 'compact', aspectRatio: 2500 / 843,
    areas: [area('A',0,0,1/3,1),area('B',1/3,0,1/3,1),area('C',2/3,0,1/3,1)]
  },
  {
    id: 'compact-left', label: '小・左大右小', size: 'compact', aspectRatio: 2500 / 843,
    areas: [area('A',0,0,2/3,1),area('B',2/3,0,1/3,1)]
  },
  {
    id: 'compact-right', label: '小・左小右大', size: 'compact', aspectRatio: 2500 / 843,
    areas: [area('A',0,0,1/3,1),area('B',1/3,0,2/3,1)]
  },
  {
    id: 'compact-2', label: '小・2格', size: 'compact', aspectRatio: 2500 / 843,
    areas: [area('A',0,0,.5,1),area('B',.5,0,.5,1)]
  },
  {
    id: 'compact-1', label: '小・1格', size: 'compact', aspectRatio: 2500 / 843,
    areas: [area('A',0,0,1,1)]
  }
];

export const defaultTemplate = templates[0];
