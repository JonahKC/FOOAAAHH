const fooaaahh_options_en_US = {
  "PLAYER_SPEED": "Player Movement Speed",
  "STARTING_OBSTACLE_SPEED": "Starting Speed for Obstacles",
  "MAX_OBSTACLES": "Max Ingame Obstacles",
  "OBSTACLES_ON_SCREEN": "# of Obstacles to Start With",
  "BACKGROUND_IMAGES_ON_SCREEN": "# of Clouds to Start With",
  "HONEY_ON_SCREEN": "# of Honey Globs",
  "HONEY_SLOW_AMOUNT": "Honey Speed Multiplier"
}
function translate(variable, language="en_US") {
  switch(language) {
    case "en_US":
      return fooaaahh_options_en_US[Object.keys(variable)[0]]
  }
}