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
// Radio buttons for control overrides
let auto_control_radio = document.getElementById('Automatic');
let mobile_control_radio = document.getElementById('Mobile');
let web_control_radio = document.getElementById('Web');
// If the user has previously set a control override, use that, otherwise use the default (automatic)
if(localStorage.getItem("controloverride") == null) {
  auto_control_radio.checked = true;
  localStorage.setItem("controloverride", "auto");
} else if(localStorage.getItem("controloverride") == "mobile") {
  mobile_control_radio.checked = true;
  localStorage.setItem("controloverride", "mobile");
} else if(localStorage.getItem("controloverride") == "web") {
  web_control_radio.checked = true;
  localStorage.setItem("controloverride", "web");
}
// When a control override radio button is clicked, update the corresponding variable and save it
auto_control_radio.onclick = function() {
  localStorage.setItem("controloverride", "auto");
}
mobile_control_radio.onclick = function() {
  localStorage.setItem("controloverride", "mobile");
}
web_control_radio.onclick = function() {
  localStorage.setItem("controloverride", "web");
}
// Radio buttons to enable/disable developer mode
let developer_mode_radio_on = document.getElementById('enabledevmode');
let developer_mode_radio_off = document.getElementById('disabledevmode');
// If the user has previously set a developer mode, use that, otherwise use the default (off)
if(localStorage.getItem("developermode") == null) {
  developer_mode_radio_off.checked = true;
  localStorage.setItem("developermode", "off");
} else if(localStorage.getItem("developermode") == "on") {
  developer_mode_radio_on.checked = true;
  localStorage.setItem("developermode", "on");
} else if(localStorage.getItem("developermode") == "off") {
  developer_mode_radio_off.checked = true;
  localStorage.setItem("developermode", "off");
}
// When a developer mode radio button is clicked, update the corresponding variable and save it
developer_mode_radio_on.onclick = function() {
  localStorage.setItem("developermode", "on");
}
developer_mode_radio_off.onclick = function() {
  localStorage.setItem("developermode", "off");
}