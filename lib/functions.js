console.log("Registering functions...")
time = performance.now();

const k = 200;
function sigmoid(z) {
  return 1 / (1 + Math.exp(-z/k));
}
/**
 * Static class for more advanced generation of random numbers. Based off C#"s Random class.
 */
class Random {
  constructor() {
    if (this instanceof StaticClass) {
      throw Error("A static class cannot be instantiated.");
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
  */
  static choice(array) {
    let index = Math.floor(Math.random()*array.length);
    return {"object": array[index], "index": index};
  }
}

function clearSprites() {
  for(let i = allSprites.length; i--;) {
    allSprites[i].remove();
  }
}

function increase_speed_and_score() {
  if(increment_score && !cease_game_loop) {
    obstacle_speed += OBSTACLE_INCREASE_SPEED_RATE;
    score += Math.pow(SCORE_EXPONENT,obstacle_speed) * SCORE_MULTIPLIER;
  }
}

function mobile() {
  if(localStorage.getItem("controloverride") == "mobile") {
    return true;
  } else if(localStorage.getItem("controloverride") == "web") {
    return false;
  } else {
    return ("ontouchstart" in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
  }
}

var vis = (function(){
  var stateKey, eventKey, keys = {
    hidden: "visibilitychange",
    webkitHidden: "webkitvisibilitychange",
    mozHidden: "mozvisibilitychange",
    msHidden: "msvisibilitychange"
  };
  for (stateKey in keys) {
    if (stateKey in document) {
      eventKey = keys[stateKey];
      break;
    }
  }
  return function(c) {
    if (c) document.addEventListener(eventKey, c);
    return !document[stateKey];
  }
})();

function resetScene() {
  cvs.style("display", "block");
  document.getElementsByClassName("showwhengameover").forEach((item, index) => {
    item.style.setProperty("display", "none");
  });
  document.getElementsByClassName("hidewhengameover").forEach((item, index) => {
    item.classList.contains("mobileonly") && !mobile() ? item.style.setProperty("display", "none") : item.style.setProperty("display", "block");
  });
  document.getElementById("gameedgesfancy").style.setProperty("overflow-y", "hidden", "important");
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
  blackout = 0;

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
    honey_sprites[i].setCollider("circle", 0, 15, 320);
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
      if(image.index <= 2) {
        clang_obstacles.push(i);
      }
      // Give the obstacle a random rotation
      obstacles_sprites[i].rotation = Random.range(0, 360);
    } else {
      let anim = Random.choice(obstacles_animations);
      if(anim.index in ANIMATION_ROTATION_INDECES && Random.range(0, 1) == 1) {
        obstacles_sprites[i].mirrorX(-1);
      }
      obstacles_sprites[i].addAnimation("main", anim.object);
      obstacles_sprites[i].changeAnimation("main");
      obstacles_sprites[i].animation.play();
      if(anim.index <= 1) {
        splat_obstacles.push(i);
      }
    }

    // Make them smaller
    obstacles_sprites[i].scale = global_sprite_scale;

    // Resize the collider to match the sprite better
    obstacles_sprites[i].setCollider("circle", 0, 0, 250);
  }

  // Draw the player last, so it renders on top of everything
  main_character = createSprite(windowWidth/2, windowHeight/4);
  main_character.addImage(main_character_image);
  main_character.scale = global_sprite_scale;
  main_character.setCollider("rectangle", 0, 0, main_character.width * 0.5, main_character.height * 0.2);

  speed_and_score = setInterval(() => {
    increase_speed_and_score();
  }, 100);

  if(Random.range(1, 24) == 1) {
    lets_go_sound.play();
  }

  // If the sfxvolume, or musicvolume localStorage key is not set, set musicvolume to 0.4, and sfxvolume to 0.6
  if(!localStorage.getItem("sfxvolume")) {
    localStorage.setItem("sfxvolume", 0.6);
  }
  if(!localStorage.getItem("musicvolume")) {
    localStorage.setItem("musicvolume", 0.4);
  }

  // Set the volume of the sounds to the localStorage value, either musicvolume, or sfxvolume depending on the sound
  soundtracks.forEach(s => {
    s.setVolume(parseFloat(localStorage.getItem("musicvolume")));
  });
  ouch_sound.setVolume(parseFloat(localStorage.getItem("sfxvolume")));
  airplanescrap_hit_sound.setVolume(parseFloat(localStorage.getItem("sfxvolume")));
  splat_sound.setVolume(parseFloat(localStorage.getItem("sfxvolume")));
  lets_go_sound.setVolume(parseFloat(localStorage.getItem("sfxvolume")));
  honey_sounds.forEach(s => {
    s.setVolume(parseFloat(localStorage.getItem("sfxvolume")));
  });
}

// Override the default arrow key behavior
document.addEventListener("keydown", function(event) {
  switch(event.key) {
    case "ArrowUp":
      event.preventDefault();
      break;
    case "ArrowDown":
      event.preventDefault();
      break;
    case "ArrowLeft":
      event.preventDefault();
      break;
    case "ArrowRight":
      event.preventDefault();
      break;
  }
});

function addObstacle() {
  let newIndex = obstacles_sprites.push(createSprite(Random.range(0, windowWidth), windowHeight + Random.range(0, windowHeight - 1))) - 1;
  if(Random.range(0, 3) != 0) {
    let image = Random.choice(obstacles_images)
    obstacles_sprites[newIndex].addImage(image.object);
    if(image.index in STATIC_ROTATION_INDECES) {
      obstacles_sprites[i].rotation = Random.range(0, 360);
      obstacles_sprites[i].rotationSpeed = Random.range(-1, 1);
    }
  } else {
    let anim = Random.choice(obstacles_animations);
    if(anim.index in ANIMATION_ROTATION_INDECES && Random.range(0, 1) == 1) {
      obstacles_sprites[newIndex].mirrorX(-1);
    }
    obstacles_sprites[newIndex].addAnimation("main", anim.object);
    obstacles_sprites[newIndex].changeAnimation("main");
    obstacles_sprites[newIndex].animation.play();
  }
  obstacles_sprites[newIndex].scale = global_sprite_scale;
  obstacles_sprites[newIndex].setCollider("circle", 0, 0, 20);
}

console.log(`Registered functions in ${performance.now()-time} milliseconds`);