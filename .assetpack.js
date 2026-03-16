import { mipmap } from '@assetpack/core/image';

export default {
  entry: './raw-assets/sprites',
  output: './public/assets/sprites',

  pipes: [
    mipmap({
      format: 'webp',
      template: '@%%x',
      resolutions: {
        "": 1,
        "@0.5x": 0.5,
        "@0.333x": 0.333
      }
    })
  ]
};
