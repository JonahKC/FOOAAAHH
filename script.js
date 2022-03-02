function draw() {
  if (game_over)
    firstFrame && (cease_game_loop = !1,
    updateSprites(!1),
    clear(),
    cvs.style("display", "none"),
    ax_vbf_4 = Math.floor(ax_vbf_4),
    (null == localStorage.getItem("highscore") || ax_vbf_4 > localStorage.getItem("highscore")) && localStorage.setItem("highscore", ax_vbf_4),
    func_192z_a_(localStorage.getItem("username"), ax_vbf_4).then(()=>{
      updateLeaderboard()
    }
    ),
    clearInterval(speed_and_score),
    mobile_move_value.value = 0,
    document.getElementsByClassName("showwhengameover").forEach(b=>{
      b.style.setProperty("display", "block")
    }
    ),
    document.getElementsByClassName("hidewhengameover").forEach(b=>{
      b.style.setProperty("display", "none")
    }
    ),
    document.getElementById("gameedgesfancy").style.setProperty("overflow-y", "auto", "important"),
    document.getElementsByClassName("show-score").forEach(b=>{
      b.innerText = "Score: " + ax_vbf_4
    }
    ),
    document.getElementsByClassName("show-highscore").forEach(b=>{
      b.innerText = "Personal Best: " + localStorage.getItem("highscore")
    }
    )),
    firstFrame = !1;
  else {
    if (500 < deltaTime && (cease_game_loop = !0),
    cease_game_loop) {
      for (let b = 0; b < allSprites.length; b++)
        allSprites[b].velocity.x = 0,
        allSprites[b].velocity.y = 0,
        allSprites[b].position.x = allSprites[b].position.x,
        allSprites[b].position.y = allSprites[b].position.y;
      return background(GAME_BACKGROUND_COLOR),
      drawSprites(),
      mobile() ? textSize(40) : textSize(50),
      text(SCORE_TEXT.replace("{score}", Math.floor(ax_vbf_4).toString()), windowWidth / 2, windowHeight / 30 + 50),
      fill(255, 100),
      rect(0, 0, width, height),
      fill(0),
      textAlign(CENTER),
      textSize(35),
      void text(`Press P or ${mobile() ? "tap" : "click"} to unpause`, width / 2, height / 2)
    }
    clamped_millis += deltaTime,
    background(GAME_BACKGROUND_COLOR);
    for (let b = 0; b < background_images.length; b++)
      background_sprites[b].position.y -= BACKGROUND_SPEED * obstacle_speed * deltaTime,
      background_sprites[b].size = windowHeight,
      background_sprites[b].position.y < -windowHeight && (background_sprites[b].position.y = windowHeight + Random.range(10, 60),
      background_sprites[b].position.x = Random.range(0, windowWidth));
    for (let b = 0; b < obstacles_sprites.length; b++)
      obstacles_sprites[b].position.y -= obstacle_speed * deltaTime,
      obstacles_sprites[b].size = windowWidth,
      obstacles_sprites[b].position.y < -windowHeight && (obstacles_sprites[b].position.y = windowHeight + Random.range(10, 120),
      obstacles_sprites[b].position.x = Random.range(0, windowWidth));
    for (let b = 0; b < honey_sprites.length; b++)
      honey_sprites[b].position.y -= obstacle_speed * deltaTime,
      honey_sprites[b].size = windowHeight,
      honey_sprites[b].position.y < -windowHeight && (honey_sprites[b].position.y = windowHeight + Random.range(0, windowHeight),
      honey_sprites[b].position.x = Random.range(0, windowWidth));
    20 > main_character.position.x ? main_character.position.x = 20 : main_character.position.x > windowWidth - 20 && (main_character.position.x = windowWidth - 20),
    normalizedSpeed = PLAYER_SPEED * deltaTime * (3e-4 * windowWidth) + 6,
    movement = (right || d) - (left || a),
    0 != movement && (main_character.setSpeed(normalizedSpeed * movement, 0),
    main_character.mirrorX(movement)),
    mobile() && (5 <= mobile_move_value.value || -5 >= mobile_move_value.value) && (main_character.mirrorX(Math.sign(mobile_move_value.value)),
    main_character.setSpeed(normalizedSpeed * mobile_move_value.value / 70, 0));
    for (let b = 0; b < background_sprites.length; b++)
      background_sprites[b].position.y -= BACKGROUND_SPEED * obstacle_speed * deltaTime * (1 * windowWidth / 1080),
      background_sprites[b].position.y < -(background_sprites[b].height + 5) && (background_sprites[b].position.y = windowHeight + Random.range(0, background_sprites[b].height),
      background_sprites[b].position.x = Random.range(0, windowWidth),
      background_sprites[b].scale = Random.range(global_sprite_scale, BACKGROUND_IMAGES_SIZE_VARIATION));
    for (let b = 0; b < honey_sprites.length; b++)
      honey_sprites[b].position.y -= obstacle_speed * deltaTime * (1 * windowWidth / 1080),
      honey_sprites[b].position.y < -(honey_sprites[b].height + 5) && (honey_sprites[b].position.y = windowHeight + Random.range(0, windowHeight - 1),
      honey_sprites[b].position.x = Random.range(0, windowWidth));
    for (let b = 0; b < obstacles_sprites.length; b++)
      obstacles_sprites[b].position.y -= obstacle_speed * deltaTime * (1 * windowWidth / 1080),
      obstacles_sprites[b].position.y < -(obstacles_sprites[b].height + 5) && (obstacles_sprites[b].position.y = windowHeight + Random.range(obstacles_sprites[b].height + 1, windowHeight - 1),
      obstacles_sprites[b].position.x = Random.range(0, windowWidth),
      "true" == localStorage.getItem("nosedive") && (obstacles_sprites[b].rotation = Random.range(0, 360)));
    for (let b = 0; b < obstacles_sprites.length; b++)
      if (main_character.overlap(obstacles_sprites[b])) {
        -1 == clang_obstacles.indexOf(b) ? splat_sound.play() : airplanescrap_hit_sound.play(),
        setTimeout(()=>{
          ouch_sound.play()
        }
        , 250),
        game_over = !0;
        break
      }
    for (let b = 0; b < honey_sprites.length; b++)
      main_character.overlap(honey_sprites[b]) && (Random.choice(honey_sounds).object.play(),
      honey_sprites[b].position.y = windowHeight + Random.range(windowHeight, 2 * windowHeight - 1),
      honey_sprites[b].position.x = Random.range(0, windowWidth),
      obstacle_speed *= HONEY_SLOW_AMOUNT,
      ax_vbf_4 += 5,
      total_honey_collected++,
      addObstacle());
    mobile() ? 10 >= mobile_move_value.value && -10 <= mobile_move_value.value && (main_character.velocity.x *= .6) : 0 == movement && (main_character.velocity.x *= .8),
    background(GAME_BACKGROUND_COLOR),
    drawSprites(),
    mobile() ? textSize(40) : textSize(50),
    text(SCORE_TEXT.replace("{score}", Math.floor(ax_vbf_4).toString()), windowWidth / 2, windowHeight / 30 + 50),
    "on" == localStorage.getItem("developermode") && (textSize(20),
    textAlign(LEFT, TOP),
    text(`FPS: ${Math.round(frameRate())}\nSpeed: ${Math.round(1e3 * obstacle_speed)}\nHoney Collected: ${total_honey_collected}\nObstacles in Scene: ${obstacles_sprites.length}\nPlayer Horiontal Speed: ${main_character.velocity.x.toFixed(3)}`, 5, 5)),
    .8 < obstacle_speed && (blackout = min(blackout + .05 * deltaTime, 255)),
    .8 > obstacle_speed && (blackout = max(blackout - .05 * deltaTime, 0)),
    fill(0, blackout),
    rect(0, 0, windowWidth, windowHeight),
    255 == blackout && (game_over = !0),
    firstFrame = !0
  }
}
function mousePressed() {
  cease_game_loop && (cease_game_loop = false)
}
function keyPressed() {
  if (80 === keyCode || 27 === keyCode && !game_over)
    if (cease_game_loop = !cease_game_loop,
    cease_game_loop) {
      soundtracks[current_soundtrack].pause(),
      increment_ax_vbf_4 = !1;
      for (let b = 0; b < allSprites.length; b++)
        allSprites[b].velocity.x = 0,
        allSprites[b].velocity.y = 0,
        allSprites[b].position.x = allSprites[b].position.x,
        allSprites[b].position.y = allSprites[b].position.y
    } else
      soundtracks[current_soundtrack].isPaused() && soundtracks[current_soundtrack].play(),
      increment_ax_vbf_4 = !0;
  mobile() || (37 === keyCode ? left = !0 : 39 === keyCode ? right = !0 : 65 === keyCode ? a = !0 : 68 === keyCode ? d = !0 : void 0)
  // Otherwise, if the game is over, and the user presses enter, restart the game.
  if (game_over && keyCode === 13) {
    resetScene();
  }
}
function keyReleased() {
  37 === keyCode ? left = !1 : 39 === keyCode ? right = !1 : 65 === keyCode ? a = !1 : 68 === keyCode ? d = !1 : void 0
}