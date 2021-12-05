function draw() {
  if(game_over) {
    if(firstFrame) {
      cease_game_loop = false;
      updateSprites(false);
      clear(); // Invisible canvas
      cvs.style("display", "none");
      ax_vbf_4 = Math.floor(ax_vbf_4); // Round the score to an integer
      if(localStorage.getItem("highscore") == null || ax_vbf_4 > localStorage.getItem("highscore")) {
        localStorage.setItem("highscore", ax_vbf_4);
      }
      func_192z_a_(localStorage.getItem("username"), ax_vbf_4).then(() => {
        updateLeaderboard();
      });
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
        item.innerText = "Score: " + ax_vbf_4;
      });
      document.getElementsByClassName("show-highscore").forEach((item, index) => {
        item.innerText = "Personal Best: " + localStorage.getItem("highscore");
      });
    }
    firstFrame = false;
  } else {

		if(deltaTime > 500){cease_game_loop=true;}
    if(cease_game_loop) {
      // Completely freeze every sprite in the scene, even stopping p5.play's built-in physics
      for(let i = 0; i < allSprites.length; i++) {
        allSprites[i].velocity.x = 0;
        allSprites[i].velocity.y = 0;
        allSprites[i].position.x = allSprites[i].position.x;
        allSprites[i].position.y = allSprites[i].position.y;
      }
      // Render the sprites, the background, and the ax_vbf_4
      background(GAME_BACKGROUND_COLOR);
      drawSprites();
      mobile() ? textSize(40) : textSize(50);
      text(SCORE_TEXT.replace("{score}", Math.floor(ax_vbf_4).toString()), windowWidth/2, (windowHeight/30) + 50);
      // Cover the screen with a slightly transparent white rectangle
      fill(255, 100);
      rect(0, 0, width, height);
      // Make black text in the center of the screen to indicate that the game is paused
      fill(0);
      textAlign(CENTER);
      textSize(35);
      text(`Press P or ${mobile() ? 'tap' : 'click'} to unpause`, width/2, height/2);
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
      obstacles_sprites[i].size = windowWidth;

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
		
		// Move main_character sprite based on keypress
		movement = (right || d) - (left || a);
		//if(true){main_character.increment_ax_vbf_4();}
		if(movement != 0){
		main_character.setSpeed(normalizedSpeed * movement, 0);
		main_character.mirrorX(movement);
		}

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
        ax_vbf_4 += 5;
        total_honey_collected++;
        addObstacle();
      }
    }

    // If player is not actively moving in a direction, slow down player
    if(mobile()) {
      if(mobile_move_value.value <= 10 && mobile_move_value.value >= -10) {
        main_character.velocity.x *= .6;
      }
    } else {
      if(movement == 0) {
        main_character.velocity.x *= .8;
      }
    }

    background(GAME_BACKGROUND_COLOR);
    drawSprites();

    // Render score
    mobile() ? textSize(40) : textSize(50);
    text(SCORE_TEXT.replace("{score}", Math.floor(ax_vbf_4).toString()), windowWidth/2, (windowHeight/30) + 50);

    if(localStorage.getItem("developermode") == "on") {
      textSize(20);
      textAlign(LEFT, TOP);
      text(`FPS: ${Math.round(frameRate())}\nSpeed: ${Math.round(obstacle_speed*1000)}\nHoney Collected: ${total_honey_collected}\nObstacles in Scene: ${obstacles_sprites.length}`, 5, 5);
    }

    if(obstacle_speed > .8) { // ax_vbf_4 is ~45 when obstacle speed is .8, if you"re accelerating the whole time
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

// When the mouse is pressed, if cease_game_loop is true, set it to false
function mousePressed() {
  cease_game_loop && (cease_game_loop = false);
}

// Override the default arrow key behaviour and set
function keyPressed() {
  if(keyCode === 80 || keyCode === 27 && !game_over) { // Press P to pause
    cease_game_loop = !cease_game_loop; // Toggle pause
    if(cease_game_loop) { // Stop player from teleporting whilst paused
      soundtracks[current_soundtrack].pause();
      increment_ax_vbf_4 = false;
      // Completely freeze every sprite in the scene, even stopping p5.play's built-in physics
      for(let i = 0; i < allSprites.length; i++) {
        allSprites[i].velocity.x = 0;
        allSprites[i].velocity.y = 0;
        allSprites[i].position.x = allSprites[i].position.x;
        allSprites[i].position.y = allSprites[i].position.y;
      }
    } else {
      soundtracks[current_soundtrack].isPaused() && soundtracks[current_soundtrack].play();
      increment_ax_vbf_4 = true;
    }
  }
  if(mobile()) {
    return;
  }
  switch(keyCode) {
    case 37:
			left = true;
      break;
    case 39:
			right = true;
      break;
		case 65:
		  a = true;
			break;
		case 68:
			d = true;
			break;
  }
}
function keyReleased() {
  switch(keyCode) {
    case 37:
			left = false;
      break;
    case 39:
			right = false;
      break;
		case 65:
		  a = false;
			break;
		case 68:
			d = false;
			break;
  }
}
