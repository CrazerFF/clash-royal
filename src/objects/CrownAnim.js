this.crownAnim = Spine.from({
      skeleton: 'crown_anim_json',
      atlas: 'crown_anim_atlas',
    })
    this.crownAnim.state.timeScale = 0.5;
    this.crownAnim.state.setAnimation(0, 'animation', false)
    this.crownAnim.state.setAnimation(0, 'crown', true) 
    this.crownAnim.x = 200
    this.crownAnim.y = 700
    this.crownAnim.visible=true
    this.crownAnim.alpha = 1
    this.crownAnim.scale.set(1);
    this.addChild(this.crownAnim);
    this.crownAnim.zIndex=9999
    this.objects.push(this.crownAnim)