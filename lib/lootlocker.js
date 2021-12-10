const BASE_URL = "https://s7w04rp9.api.lootlocker.io";
const LOGIN_URL = BASE_URL + "/game/v2/session/guest";
const LEADERBORD_ID = "807";
const LEADERBOARD_SUBMIT_URL = BASE_URL + `/game/leaderboards/${LEADERBORD_ID}/submit`;
const LEADERBOARD_FETCH_URL = BASE_URL + `/game/leaderboards/${LEADERBORD_ID}/list?count=`;
const SCORES_ON_LEADERBOARD = 10;
let session_token = localStorage.getItem('session_token');
function login(callback) {
  if(Boolean(session_token) != null) {
    $.ajax({
      url: LOGIN_URL,
      type: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      data: localStorage.getItem('playerIdentifier') === null ? JSON.stringify({"game_key": "1be82fce1554927a713ca98a497c269d4bb4fc1b", "game_version": "0.10.0.0", "development_mode":   "false"}) : JSON.stringify({"game_key": "1be82fce1554927a713ca98a497c269d4bb4fc1b", "game_version": "0.10.0.0", "development_mode": "false", "player_identifier": localStorage. getItem('playerIdentifier')}),
      success: function(res) {
        session_token = res.session_token;
        localStorage.setItem('playerIdentifier', res.player_identifier);
        localStorage.setItem('session_token', res.session_token);
        callback();
      },
      error: function(xhr){
        console.error("An HTTP error occured running submitScore: " + xhr.status + " " + xhr.statusText);
        return;
      }
    });
  } else {
    callback();
  }
}
function func_192z_a_(username, score) {
  if(score > 5000) {
    return;
  }
  if(score > 700) {
    alert("Since you scored higher than 800, please email info@jcwyt.com or tell us your score on our discord to ensure it doesn’t get removed.")
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      url: LEADERBOARD_SUBMIT_URL,
      type: 'POST',
      headers: {
        "Content-Type": "application/json",
        "x-session-token": session_token
      },
      data: JSON.stringify({
        member_id: username,
        score: score
      }),
      error: function(xhr){
        throw new Error("An HTTP error occured running submitScore: " + xhr.status + " " + xhr.statusText);
        reject();
      },
      success: function(res) {
        resolve();
      }
    });
  });
}
function getScores(count=20) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: LEADERBOARD_FETCH_URL + count.toString(),
      type: 'GET',
      headers: {
        "Content-Type": "application/json",
        "x-session-token": session_token
      },
      success: function(res) {
        let formatted_response = [];
        for (let i = 0; i < res.items.length; i++) {
          formatted_response.push({
            "username": res.items[i].member_id,
            "score": res.items[i].score
          });
        }
        resolve(formatted_response);
      },
      error: function(xhr){
        throw new Error("An HTTP error occured running submitScore: " + xhr.status + " " + xhr.statusText);
        reject("An HTTP error occured running submitScore: " + xhr.status + " " + xhr.statusText);
      }
    });
  });
}

function updateLeaderboard(loadAllScores=false) {
  getScores(loadAllScores ? 1000 : SCORES_ON_LEADERBOARD).then(scores => {
    document.getElementById('leaderboard').innerText=scores.map((score, index) => {
      return `${index+1}. ${censor(score.username)}: ${score.score}`;
    }).join('\n');
  });
}

window.addEventListener('load', () => {
  login(() => {
    updateLeaderboard(location.href.includes('leaderboard'));
  });
});

setInterval(() => {updateLeaderboard(location.href.endsWith('leaderboard'))}, 60000);