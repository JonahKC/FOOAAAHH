// Feel free to mess around with these
let global_sprite_scale = .1;

let PLAYER_SPEED = 1.2; // Speed of the player's left and right movements

let STARTING_OBSTACLE_SPEED = .2;
const OBSTACLE_INCREASE_SPEED_RATE = .0006;
const MAX_OBSTACLE_SPEED = .4; // Cap the obstacle speed at this value
let MAX_OBSTACLES = 50;
let OBSTACLES_ON_SCREEN = 32; // How many obstacle sprites to start with

const SCORE_TEXT = "Score: {score}";

let BACKGROUND_IMAGES_ON_SCREEN = 18; // Max number of background images on screen at once
const BACKGROUND_SPEED = .6; // Speed of background objects, multiplied by obstacle speed at runtime
const BACKGROUND_IMAGES_SIZE_VARIATION = .1; // Random size from global_sprite_scale, to this value.

let HONEY_ON_SCREEN = 1;
let HONEY_SLOW_AMOUNT = .3; // 0.8 would be 80% of the original speed

const GAME_BACKGROUND_COLOR = "#4bc8fa";
const GAME_OVER_BACKGROUND_COLOR = "#b21b35";

const GAME_OVER_TITLE_TEXT = "You died (oof)";

const PLAY_AGAIN_BUTTON_COLOR = "#96e1ff";
const PLAY_AGAIN_BUTTON_HOVER_COLOR = "#96e1ff";
const PLAY_AGAIN_BUTTON_PRESS_COLOR = "#96e1ff";
const PLAY_AGAIN_BUTTON_TEXT_COLOR = "#000";
const PLAY_AGAIN_BUTTON_BORDER_RADIUS = 3;
const PLAY_AGAIN_BUTTON_BORDER_SIZE = 2; // In pixels, the border around the button. Set to 0 to disable.
const PLAY_AGAIN_BUTTON_BORDER_COLOR = "#4b77fa";
const PLAY_AGAIN_BUTTON_SIZE = [250, 75]; // Width, Height in pixels

const ANIMATION_ROTATION_INDECES = [0, 1, 2, 3];
const STATIC_ROTATION_INDECES = [];

// No touchie variables
let cvs;

var main_character;
let main_character_size;
let main_character_image;

let obstacles_images = [];
let obstacles_animations = [];
let obstacles_sprites = [];
let obstacle_speed = STARTING_OBSTACLE_SPEED;

let score = 0;

let honey_images = [];
let honey_sprites = [];

let background_images = [];
let background_sprites = [];

let game_over = false;
let play_again_button;

let rampartone_font;

let cease_game_loop = false;

let clamped_millis = 0;

// When user unfocuses window, stop the draw loop temporarily
window.addEventListener('blur', () => {
  cease_game_loop = true;
});
window.addEventListener('focus', () => {
  cease_game_loop = false;
});

/**
 * Static class for more advanced generation of random numbers. Based off C#'s Random class.
 */
class Random {
  constructor() {
    if (this instanceof StaticClass) {
      throw Error('A static class cannot be instantiated.');
    }
  }
  /**
   * Returns a random integer between min and max, inclusive.
   * @param {number} min The minimum value.
   * @param {number} max The maximum value.
   * @returns {number}
  */
  static range(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
  * Selects a random element from an array, similar to Python's random.choice().
  4*/
  static choice(array) {
    let index = Math.floor(Math.random()*array.length);
    return {'object': array[index], 'index': index};
  }
}

function clearSprites() {
  for(let i = allSprites.length; i--;) {
    allSprites[i].remove();
  }
}

function resetScene() {
  cvs.style('display', 'block');
  document.getElementsByClassName('showwhengameover').forEach((item, index) => {
    item.style.setProperty("display", "none");
  })
  document.getElementById('gameedgesfancy').style.setProperty("overflow", "hidden", "important");
  clearSprites();
  background(GAME_BACKGROUND_COLOR);
  
  background_sprites = [];
  honey_sprites = [];
  obstacles_sprites = [];

  game_over = false;
  global_sprite_scale = windowWidth*(0.3/10000)+0.06;
  obstacle_speed = STARTING_OBSTACLE_SPEED;
  score = 0;
  clamped_millis = 0;

  background(GAME_BACKGROUND_COLOR);

  // Draw the background images (clouds, etc.)
  for(let i = 0; i < BACKGROUND_IMAGES_ON_SCREEN; i++) {
    background_sprites.push(createSprite(Random.range(0, windowWidth), windowHeight + Random.range(0, windowHeight - 1)));
    background_sprites[i].addImage(Random.choice(background_images).object);
    background_sprites[i].scale = Random.range(global_sprite_scale, BACKGROUND_IMAGES_SIZE_VARIATION);
  }

  // Draw the honey images
  for(let i = 0; i < HONEY_ON_SCREEN; i++) {
    honey_sprites.push(createSprite(Random.range(0, windowWidth), windowHeight + Random.range(0, windowHeight - 1)));
    honey_sprites[i].addImage(Random.choice(honey_images).object);
    honey_sprites[i].scale = global_sprite_scale;
    honey_sprites[i].setCollider('circle', 0, 15, 320);
  }

  // Create the obstacles (airplane bits, birds, etc.)
  for(let i = 0; i < Math.round(OBSTACLES_ON_SCREEN * obstacle_speed); i++) {
    obstacles_sprites.push(createSprite(Random.range(0, windowWidth), windowHeight + Random.range(0, windowHeight - 1)));
    // Load an animated one every 3rd obstacle
    if(i % 3 != 0) {
      let image = Random.choice(obstacles_images)
      obstacles_sprites[i].addImage(image.object); // i % obstacles_images.length is to make sure the the sprite getting drawn is always within the array
      if(image.index in STATIC_ROTATION_INDECES && Random.range(0, 1) == 1) {
        obstacles_sprites[i].mirrorX(-1);
      }
    } else {
      let anim = Random.choice(obstacles_animations);
      if(anim.index in ANIMATION_ROTATION_INDECES && Random.range(0, 1) == 1) {
        obstacles_sprites[i].mirrorX(-1);
      }
      obstacles_sprites[i].addAnimation("main", anim.object);
      obstacles_sprites[i].changeAnimation("main");
      obstacles_sprites[i].animation.play();
    }

    // Make them smaller
    obstacles_sprites[i].scale = global_sprite_scale;

    // Resize the collider to match the sprite better
    obstacles_sprites[i].setCollider('circle', 0, 0, 250);
  }

  // Draw the player last, so it renders on top of everything
  main_character = createSprite(windowWidth/2, windowHeight/4);
  main_character.addImage(main_character_image);
  main_character.scale = global_sprite_scale;
  main_character.setCollider('rectangle', 0, 0, main_character.width * 0.5, main_character.height * 0.2);
}

// Override the default arrow key behavior
document.addEventListener('keydown', function(event) {
  switch(event.key) {
    case 'ArrowUp':
      event.preventDefault();
      break;
    case 'ArrowDown':
      event.preventDefault();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      break;
    case 'ArrowRight':
      event.preventDefault();
      break;
  }
});

function addObstacle() {
  let newIndex = obstacles_sprites.push(createSprite(Random.range(0, windowWidth), windowHeight + Random.range(0, windowHeight - 1))) - 1;
  if(Random.range(0, 3) != 0) {
    obstacles_sprites[newIndex].addImage(Random.choice(obstacles_images).object);
    if(newIndex % obstacles_images.length in STATIC_ROTATION_INDECES) {
      obstacles_sprites[i].rotation = Random.range(0, 360);
      obstacles_sprites[i].rotationSpeed = Random.range(-1, 1);
    }
  } else {
    if(newIndex % obstacles_images.length in ANIMATION_ROTATION_INDECES && Random.range(0, 1) == 1) {
      obstacles_sprites[newIndex].mirrorX(-1);
    }
    obstacles_sprites[newIndex].addAnimation("main", Random.choice(obstacles_animations).object);
    obstacles_sprites[newIndex].changeAnimation("main");
    obstacles_sprites[newIndex].animation.play();
  }
  obstacles_sprites[newIndex].scale = global_sprite_scale;
  obstacles_sprites[newIndex].setCollider('circle', 0, 0, 20);
}

// P5.js Functions
function preload() {
  // Load the Rampart One font
  rampartone_font = loadFont('./RampartOne-Regular.ttf');

  // Load all of the images used in the game
  main_character_image = loadImage("pictures/man.png");
  background_images = [loadImage("pictures/cloud.png"), loadImage("pictures/cloud1.png"), loadImage("pictures/cloud2.png"), loadImage("pictures/cloud3.png"), loadImage("pictures/cloud4.png")];
  obstacles_images = [loadImage("pictures/airplanescrap.png"), loadImage("pictures/airplanescrap1.png"), loadImage("pictures/airplanescrap2.png")];
  obstacles_animations = [loadAnimation("pictures/bird.png", "pictures/bird1.png"), loadAnimation("pictures/bird2.png", "pictures/bird3.png")];
  honey_images = [loadImage("pictures/honey.png"), loadImage("pictures/honey1.png")];

  // Lower the framerate of every animated obstacle
  for(let i = 0; i < obstacles_animations.length; i++) {
    obstacles_animations[i].frameDelay = 20;
  }
}

function setup() {
  cvs = createCanvas(windowWidth, windowHeight);

  // Fullscreen canvas woo
  cvs.style('width', '100%');
  cvs.style('height', '100%');

  // Set the maxFPS to 60
  frameRate(60);

  resetScene();
}

function draw() {
  if(cease_game_loop || document.visibilityState != "visible" || document.hidden) { // Stop game loop from running when paused, tabbed out, etc.
    return;
  }
  if(game_over) {
    updateSprites(false);
    clear(); // Invisible canvas
    cvs.style('display', 'none');
    score = Math.floor(score); // Round the score to an integer
    if(localStorage.getItem("highscore") == null || score > localStorage.getItem("highscore")) {
      localStorage.setItem("highscore", score);

    }
    document.getElementsByClassName('showwhengameover').forEach((item, index) => {
      item.style.setProperty("display", "block");
    })
    document.getElementById('gameedgesfancy').style.setProperty("overflow", "unset", "important");
    document.getElementsByClassName('show-score').forEach((item, index) => {
      item.innerText = "Score: " + score;
    })
    document.getElementsByClassName('show-highscore').forEach((item, index) => {
      item.innerText = "Personal Best: " + localStorage.getItem("highscore");
    })
  } else {
    clamped_millis += deltaTime

    // Set the score based on the current distance
    score += (obstacle_speed*deltaTime)/250;

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

    // Slowly increase the speed of the obstacles
    obstacle_speed += Math.max(OBSTACLE_INCREASE_SPEED_RATE,0) * Math.max((1 - deltaTime/60), 0);

    // Stop main_character sprite from getting out of the canvas
    if(main_character.position.x < 20) {
      main_character.position.x = 20;
    } else if(main_character.position.x > windowWidth -  20) {
      main_character.position.x = windowWidth - 20;
    }

    // Lower FPS should not result in lower speed, so we multiply be deltaTime to make sure the speed is constant
    normalizedSpeed = (PLAYER_SPEED*deltaTime)*(windowWidth*0.0003)+6; // Thank you Mr. Nelson, for dimensional analysis. Scales the player speed based on screen size, and adjusts it so it's the same regardless of latency.

    // Move the background images up slower than the obstacles, for parallax effect
    for(let i = 0; i < background_sprites.length; i++) {
      background_sprites[i].position.y -= BACKGROUND_SPEED * obstacle_speed * deltaTime * (windowWidth * 1/1080); // Bigger clouds move more slowly
      if(background_sprites[i].position.y < -(background_sprites[i].height + 5)) {
        background_sprites[i].position.y = windowHeight + Random.range(0, background_sprites[i].height); // Move the background image to a random location below the screen, so they're not all in a straight line
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
        //if(Math.floor(score) % 10 == 0 && score != 0 && obstacles_sprites.length < MAX_OBSTACLES) {
        //  addObstacle();
        //}
      }
    }

    for(let i = 0; i < obstacles_sprites.length; i++) {
      // Check if the main_character sprite is touching an obstacle
      if(main_character.overlap(obstacles_sprites[i])) {
        game_over = true;
      }
    }

    for(let i = 0; i < honey_sprites.length; i++) {
      // Check if the main_character sprite is touching honey
      if(main_character.overlap(honey_sprites[i])) {
        honey_sprites[i].position.y = windowHeight + Random.range(windowHeight, windowHeight * 2 - 1);
        honey_sprites[i].position.x = Random.range(0, windowWidth);
        // Slow the game down
        obstacle_speed *= HONEY_SLOW_AMOUNT;
        score += 5;
        addObstacle();
      }
    }

    // If player is not actively moving in a direction, slow down player
    if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && !keyIsDown(65) && !keyIsDown(68)) {
      main_character.velocity.x *= .8;
    }

    background(GAME_BACKGROUND_COLOR);
    drawSprites();

    // Render score
    textFont(rampartone_font, windowWidth/30);
    textAlign(CENTER);
    text(SCORE_TEXT.replace('{score}', Math.floor(score).toString()), windowWidth/2, (windowWidth/30) + 20);
  }
}

function keyPressed() {
  if (keyCode === 80) { // Press P to pause
    cease_game_loop = !cease_game_loop; // Toggle pause
    if(cease_game_loop) { // Stop player from teleporting whilst paused
      main_character.velocity.x = 0;
    }
  }
  if(cease_game_loop) {
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

function settings(){
	alert("Do we want settings?")
}