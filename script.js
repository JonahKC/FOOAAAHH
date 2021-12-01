function draw() {
  if(game_over) {
    if(firstFrame) {
      cease_game_loop = false;
      updateSprites(false);
      clear(); // Invisible canvas
      cvs.style("display", "none");
      score = Math.floor(score); // Round the score to an integer
      if(localStorage.getItem("highscore") == null || score > localStorage.getItem("highscore")) {
        localStorage.setItem("highscore", score);
      }
      submitScore(localStorage.getItem("username"), score).then(() => {
        updateLeaderboard();
      })
      clearInterval(speed_and_score);
      mobile_move_value.value = 0;
      document.getElementsByClassName("showwhengameover").forEach((item, index) => {
        item.style.setProperty("display", "block");
      });
      document.getElementsByClassName("hidewhengameover").forEach((item, index) => {
        item.style.setProperty("display", "none");
      });
      document.getElementById("gameedgesfancy").style.setProperty("overflow-y", "auto", "important");
      document.getElementsByClassName("show-score").forEach((item, index) => {
        item.innerText = "Score: " + score;
      });
      document.getElementsByClassName("show-highscore").forEach((item, index) => {
        item.innerText = "Personal Best: " + localStorage.getItem("highscore");
      });
    }
    firstFrame = false;
  } else {
    if(cease_game_loop) {
      // Completely freeze every sprite in the scene, even stopping p5.play's built-in physics
      for(let i = 0; i < allSprites.length; i++) {
        allSprites[i].velocity.x = 0;
        allSprites[i].velocity.y = 0;
        allSprites[i].position.x = allSprites[i].position.x;
        allSprites[i].position.y = allSprites[i].position.y;
      }
      return;
    }

    clamped_millis += deltaTime
    // Update the background
    background(GAME_BACKGROUND_COLOR);

    for(let i = 0; i < background_images.length; i++) {
      background_sprites[i].position.y -= BACKGROUND_SPEED * obstacle_speed * deltaTime;
      background_sprites[i].size = windowHeight;

      // If the background sprite is off the screen, reset it to the top
      if(background_sprites[i].position.y < -windowHeight) {
        background_sprites[i].position.y = windowHeight + Random.range(10, 60);
        background_sprites[i].position.x = Random.range(0, windowWidth);
      }
    }

    // Update the obstacles
    for(let i = 0; i < obstacles_sprites.length; i++) {
      obstacles_sprites[i].position.y -= obstacle_speed * deltaTime;
      obstacles_sprites[i].size = windowHeight;

      // If the obstacle is off the screen, reset it to the top
      if(obstacles_sprites[i].position.y < -windowHeight) {
        obstacles_sprites[i].position.y = windowHeight + Random.range(10, 120);
        obstacles_sprites[i].position.x = Random.range(0, windowWidth);
      }
    }

    // Update the honey
    for(let i = 0; i < honey_sprites.length; i++) {
      honey_sprites[i].position.y -= obstacle_speed * deltaTime;
      honey_sprites[i].size = windowHeight;

      // If the honey is off the screen, reset it to the top
      if(honey_sprites[i].position.y < -windowHeight) {
        honey_sprites[i].position.y = windowHeight + Random.range(0, windowHeight);
        honey_sprites[i].position.x = Random.range(0, windowWidth);
      }
    }

    // Stop main_character sprite from getting out of the canvas
    if(main_character.position.x < 20) {
      main_character.position.x = 20;
    } else if(main_character.position.x > windowWidth -  20) {
      main_character.position.x = windowWidth - 20;
    }

    // Lower FPS should not result in lower speed, so we multiply be deltaTime to make sure the speed is constant
    normalizedSpeed = (PLAYER_SPEED*deltaTime)*(windowWidth*0.0003)+6; // Thank you Mr. Nelson, for dimensional analysis. Scales the player speed based on screen size, and adjusts it so it"s the same regardless of latency.

    if(mobile() && (mobile_move_value.value >= 5 || mobile_move_value.value <= -5)) {
      main_character.mirrorX(Math.sign(mobile_move_value.value))
      main_character.setSpeed(normalizedSpeed*mobile_move_value.value/70, 0);
    }

    // Move the background images up slower than the obstacles, for parallax effect
    for(let i = 0; i < background_sprites.length; i++) {
      background_sprites[i].position.y -= BACKGROUND_SPEED * obstacle_speed * deltaTime * (windowWidth * 1/1080); // Bigger clouds move more slowly
      if(background_sprites[i].position.y < -(background_sprites[i].height + 5)) {
        background_sprites[i].position.y = windowHeight + Random.range(0, background_sprites[i].height); // Move the background image to a random location below the screen, so they"re not all in a straight line
        background_sprites[i].position.x = Random.range(0, windowWidth);
        background_sprites[i].scale =  Random.range(global_sprite_scale, BACKGROUND_IMAGES_SIZE_VARIATION);
      }
    }

    // Honey movement (same as obstacle movement below, only without the adding new obstacles feature)
    for(let i = 0; i < honey_sprites.length; i++) {
      honey_sprites[i].position.y -= obstacle_speed * deltaTime * (windowWidth * 1/1080);
      if(honey_sprites[i].position.y < -(honey_sprites[i].height + 5)) {
        honey_sprites[i].position.y = windowHeight + Random.range(0, windowHeight - 1);
        honey_sprites[i].position.x = Random.range(0, windowWidth);
      }
    }

    // Move the obstacles up the screen, and move them back to the bottom when they get to the top
    for(let i = 0; i < obstacles_sprites.length; i++) {
      obstacles_sprites[i].position.y -= obstacle_speed * deltaTime * (windowWidth * 1/1080);
      if(obstacles_sprites[i].position.y < -(obstacles_sprites[i].height + 5)) {
        obstacles_sprites[i].position.y = windowHeight + Random.range(obstacles_sprites[i].height + 1, windowHeight - 1);
        obstacles_sprites[i].position.x = Random.range(0, windowWidth);
        if(localStorage.getItem("nosedive") == "true") {
          obstacles_sprites[i].rotation = Random.range(0, 360);
        }
      }
    }

    for(let i = 0; i < obstacles_sprites.length; i++) {
      // Check if the main_character sprite is touching an obstacle
      if(main_character.overlap(obstacles_sprites[i])) {
        if(clang_obstacles.indexOf(i) == -1) {
          splat_sound.play();
        } else {
          airplanescrap_hit_sound.play();
        }
        setTimeout(() => {ouch_sound.play()}, 250);
        game_over = true;
        break;
      }
    }

    for(let i = 0; i < honey_sprites.length; i++) {
      // Check if the main_character sprite is touching honey
      if(main_character.overlap(honey_sprites[i])) {
        Random.choice(honey_sounds).object.play();
        honey_sprites[i].position.y = windowHeight + Random.range(windowHeight, windowHeight * 2 - 1);
        honey_sprites[i].position.x = Random.range(0, windowWidth);
        // Slow the game down
        obstacle_speed *= HONEY_SLOW_AMOUNT;
        score += 5;
        addObstacle();
      }
    }

    // If player is not actively moving in a direction, slow down player
    if(mobile()) {
      if(mobile_move_value.value <= 10 && mobile_move_value.value >= -10) {
        main_character.velocity.x *= .6;
      }
    } else {
      if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && !keyIsDown(65) && !keyIsDown(68)) {
        main_character.velocity.x *= .8;
      }
    }

    background(GAME_BACKGROUND_COLOR);
    drawSprites();

    // Render score
    text(SCORE_TEXT.replace("{score}", Math.floor(score).toString()), windowWidth/2, (windowWidth/30) + 20);

    if(obstacle_speed > .8) { // Score is ~45 when obstacle speed is .8, if you"re accelerating the whole time
      blackout = min(blackout + .05 * deltaTime, 255); // Fade out the screen, clamped to 255 for alpha (100% opaque)
    }

    if(obstacle_speed < .8) {
      blackout = max(blackout - .05 * deltaTime, 0); // Fade in the screen, clamped to 0 for alpha (0% opaque)
    }

    // Draw a black rectangle over the top of the canvas, which transparency matching obstacle_speed
    fill(0, blackout);
    rect(0, 0, windowWidth, windowHeight);
    if(blackout == 255) { // Blackout is a failsafe, so even if you find an exploit to avoid obstacles you"ll still die without honey
      game_over = true;
    }

    firstFrame = true;
  }
}

function keyPressed() {
if(keyCode === 80 || keyCode === 27 && !game_over) { // Press P to pause
    cease_game_loop = !cease_game_loop; // Toggle pause
    if(cease_game_loop) { // Stop player from teleporting whilst paused
      soundtracks[current_soundtrack].pause();
      increment_score = false;
      // Completely freeze every sprite in the scene, even stopping p5.play's built-in physics
      for(let i = 0; i < allSprites.length; i++) {
        allSprites[i].velocity.x = 0;
        allSprites[i].velocity.y = 0;
        allSprites[i].position.x = allSprites[i].position.x;
        allSprites[i].position.y = allSprites[i].position.y;
      }
    } else {
      soundtracks[current_soundtrack].isPaused() && soundtracks[current_soundtrack].play();
      increment_score = true;
    }
  }
  if(cease_game_loop) {
    return;
  }
  if(mobile()) {
    return;
  }
  // Move main_character sprite based on keypress
  if(keyCode === RIGHT_ARROW || keyCode === 68 ) {
    main_character.setSpeed(normalizedSpeed, 0);
    // Flip character to face right
    main_character.mirrorX(1);
  } else if(keyCode === LEFT_ARROW || keyCode === 65) {
    main_character.setSpeed(normalizedSpeed, 180);
    // Flip character to face left
    main_character.mirrorX(-1);
  }
}