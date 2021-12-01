// p5.sound volume is a multiple of the default volume
// All of the elements that will be live updated to reflect the volume
let music_volume_value_update = document.getElementsByClassName('updatemusicvalue');
let sfx_volume_value_update = document.getElementsByClassName('updatesfxvalue');
// The volume sliders
let musicvolumeslider = document.getElementById('musicvolumeslider');
let sfxvolumeslider = document.getElementById('sfxvolumeslider');
// If the user has previously set a volume, use that, otherwise use the default (1)
let musicvolume = localStorage.getItem("musicvolume") == null ? 0.4 : localStorage.getItem("musicvolume");
let sfxvolume = localStorage.getItem("sfxvolume") == null ? 0.6 : localStorage.getItem("sfxvolume");
// Set the volume sliders to the previously set volume
musicvolumeslider.value = musicvolume * 100;
sfxvolumeslider.value = sfxvolume * 100;
for (let i = 0; i < music_volume_value_update.length; i++) {
  music_volume_value_update[i].innerText = musicvolumeslider.value;
}
for (let i = 0; i < sfx_volume_value_update.length; i++) {
  sfx_volume_value_update[i].innerText = sfxvolumeslider.value;
}
// When a volume slider is changed, update the corresponding variable and save it
musicvolumeslider.oninput = function() {
  musicvolume = this.value / 100;
  localStorage.setItem("musicvolume", musicvolume);
  // Go through each element and update the value
  for (let i = 0; i < music_volume_value_update.length; i++) {
    music_volume_value_update[i].innerText = musicvolumeslider.value;
  }
}
sfxvolumeslider.oninput = function() {
  sfxvolume = this.value / 100;
  localStorage.setItem("sfxvolume", sfxvolume);
  for (let i = 0; i < sfx_volume_value_update.length; i++) {
    sfx_volume_value_update[i].innerText = sfxvolumeslider.value;
  }
}