const print = console.log;
print("Loading constants...")
let time = performance.now();

// Feel free to mess around with these
let global_sprite_scale = .1; // No idea what this does but it doesn"t work rn and I"m scared to delete it

let PLAYER_SPEED = 1.2; // Speed of the player"s left and right movements

let STARTING_OBSTACLE_SPEED = .2;
const OBSTACLE_INCREASE_SPEED_RATE = .002; // Pixels per tenth of second
const MAX_OBSTACLE_SPEED = .6; // Cap the obstacle speed at this value
let MAX_OBSTACLES = 50;
let OBSTACLES_ON_SCREEN = 32; // How many obstacle sprites to start with

const SCORE_MULTIPLIER = 0.04;
const SCORE_EXPONENT = 12; // Exponentially increase points you get based on speed
const SCORE_TEXT = "Score: {score}";

const BLACKOUT_EXPONENT = 160;

let BACKGROUND_IMAGES_ON_SCREEN = navigator.maxTouchPoints == 1 ? 16 : 8; // Max number of background images on screen at once, it"s not-mobile : mobile
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

// No touchie below here

print(`Loaded constants in ${performance.now()-time} milliseconds`);
print("Loading variables...")
time = performance.now();

let cvs;

var main_character;
let main_character_size;
let main_character_image;

let obstacles_images = [];
let obstacles_animations = [];
let obstacles_sprites = [];
let clang_obstacles = [];
let splat_obstacles = [];
let obstacle_speed = STARTING_OBSTACLE_SPEED;

let airplanescrap_hit_sound;
let splat_sound;
let ouch_sound;
let lets_go_sound;

let speed_and_score;

let score = 0;

let honey_images = [];
let honey_sprites = [];
let honey_sounds = [];

let background_images = [];
let background_sprites = [];

let soundtracks = [];
let current_soundtrack = 0;

let game_over = false;
let play_again_button;

let mobile_move_value = document.getElementById("mobilemovementslider");

let rampartone_font;

let clamped_millis = 0;

let normalizedSpeed = 0;

let firstFrame = true;

let cease_game_loop = false;
let increment_score = true;

let blackout = 0;
let vignette_shader;
let post_pass;

print(`Loaded variables in ${performance.now()-time} milliseconds`)