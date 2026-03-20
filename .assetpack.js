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
        "@2x": 2,
        "@3x": 3
      }
    })
  ]
};
