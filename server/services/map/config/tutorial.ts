import { MapConfig } from './config';

export const TUTORIAL_CONFIG: MapConfig = {
  name: 'tutorial',
  width: 1024,
  height: 768,
  collisions: [
    {
      solid: true,
      shape: 'rectangle',
      position: [320, 500],
      radius: 100,
    },
    {
      solid: true,
      shape: 'polygon',
      position: [600, 320],
      points: [
        [-50, -50],
        [0, 150],
        [20, 100],
        [0, -80],
      ],
    },
    {
      solid: true,
      shape: 'rectangle',
      position: [0, 0],
      width: 1024,
      height: 32,
    },
    {
      solid: true,
      shape: 'rectangle',
      position: [0, 0],
      width: 32,
      height: 768,
    },
    {
      solid: true,
      shape: 'rectangle',
      position: [0, 768 - 32],
      width: 1024,
      height: 32,
    },
    {
      solid: true,
      shape: 'rectangle',
      position: [1024 - 32, 0],
      width: 32,
      height: 768,
    },
    {
      solid: false,
      transitionTo: 'other',
      shape: 'rectangle',
      position: [0, 120],
      width: 64,
      height: 120,
    },
  ],
};
