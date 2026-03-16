import { Spine } from '@esotericsoftware/spine-pixi-v8';

export const manifest = {
  bundles: [
    {
      name: 'game',
      assets: [
        {
          alias: 'bg',
          src: ['assets/sprites/bg.webp',
            'assets/sprites/bg@2x.webp',
            'assets/sprites/bg@3x.webp'
          ]
        },
        {
          alias: 'bg2',
          src: 'assets/sprites/bg2.webp',
        },
        {
          alias: 'giant_run_json',
          src: 'assets/sprites/giant_run.json',
        },
        {
          alias: 'giant_attack_json',
          src: 'assets/sprites/giant_attack.json',
        },
        {
          alias: 'giant_deploy_json',
          src: 'assets/sprites/giant_deploy.json',
        },
         {
          alias: 'archer_run_json',
          src: 'assets/sprites/archer_run.json',
        },
        {
          alias: 'archer_attack_json',
          src: 'assets/sprites/archer_attack.json',
        },
        {
          alias: 'archer_deploy_json',
          src: 'assets/sprites/archer_deploy.json',
        },
        {
          alias: 'megaknight_run_json',
          src: 'assets/sprites/megaknight_run.json',
        },
        {
          alias: 'megaknight_attack_json',
          src: 'assets/sprites/megaknight_attack.json',
        },
        {
          alias: 'otherAll_json',
          src: 'assets/sprites/otherAll.json',
        },
        {
          alias: 'redking_json',
          src: 'assets/sprites/redking.json',
        },
        {
          alias: 'blueking_json',
          src: 'assets/sprites/blueking.json',
        },
        {
          alias: 'arrow_json',
          src: 'assets/sprites/arrow.json',
        },
        {
          alias: 'smoke_json',
          src: 'assets/sprites/smoke.json',
        },

        {
          alias: 'stones_json',
          src: 'assets/sprites/stones.json',
        },

        {
          alias: 'pit',
          src: 'assets/sprites/pit.png',
        },

        { alias: 'tower_smoke_json', src: 'assets/sprites/tower_smoke.json' },
        { alias: 'tower_smoke_atlas', src: 'assets/sprites/tower_smoke.atlas' },

        { alias: 'death_fx', src: 'assets/sprites/death_fx.json' },
        { alias: 'death_fx_atlas', src: 'assets/sprites/death_fx.atlas' },

        { alias: 'crown_anim_json', src: 'assets/sprites/crown_anim.json' },
        { alias: 'crown_anim_atlas', src: 'assets/sprites/crown_anim.atlas' },


      ],
    },
  ],
};
