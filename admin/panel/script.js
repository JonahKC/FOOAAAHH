let TABLE_TOP = "<tr> <th>Username</th> <th>Score</th> <th>Attempts</th> </tr>"
let TABLE_LOADING = "<tr> <td></td> <td>Loading Data...</th> <td></th> </tr>"
//let API_URL = "https://JCWYTastic-Backend.turnip123.repl.co";
let API_URL = "https://JCWYTastic-Backend.turnip123.repl.co";
let USERS_URL = API_URL+"/fooaaahh/admin/users";
let DELETE_USER_URL = API_URL+"/fooaaahh/admin/delete";
let password = "";

{
  password = document.cookie.match('(^|;)\\s*' + "password" + '\\s*=\\s*([^;]+)')?.pop() || ''
}

function getUsers() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', USERS_URL, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader("password", password)
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        let json = xhr.response;
        var text = TABLE_TOP;
        for (var i = 0; i < json.users.length; i++) {
            text += "<tr><td class=\"user\">"+json.users[i].username+"</td><td>"
              +json.users[i].score+"</td><td>"
              +json.users[i].attempts+"</td></tr>\n";
        }
        document.getElementById("leaderboard").innerHTML = text;
        for (var i = 0; i < document.getElementsByClassName("user").length; i++) {
          document.getElementsByClassName("user").item(i).addEventListener("click", (click) => {
            removeName(click)
          })
        }
        
      } else {
        if (status == 403) {
          location.href = '../';
        } else {
          console.log("Error retriving JSON from "+url);
          document.getElementById("leaderboard").innerHTML = 
          TABLE_TOP + "\n<tr> <td></td> <td>Error Retriving data</th> <td></th> </tr>";
        }
        
      }
    };
    xhr.send();
}

function removeName(event) {
  if (confirm("Are you sure you want to delete "+event.currentTarget.innerHTML+"?")) {
    document.getElementById("leaderboard").innerHTML = TABLE_TOP+TABLE_LOADING
    var xhr = new XMLHttpRequest();
    xhr.open('POST', DELETE_USER_URL, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.setRequestHeader("password", password)
    var req = {};
    req.user = event.currentTarget.innerHTML
    xhr.onload = function() {
      if (xhr.status == 200) {
        getUsers();
      } else {
        if (xhr.status == 403) {
          location.href = '../';
        } else {
          console.log("Error updating JSON from "+url);
          document.getElementById("leaderboard").innerHTML = 
          TABLE_TOP + "\n<tr> <td></td> <td>Error updating data</th> <td></th> </tr>";
        }
      }
    }
    xhr.send(JSON.stringify(req));
  }
}

function refresh() {
  document.getElementById("leaderboard").innerHTML = TABLE_TOP + TABLE_LOADING;
  getUsers();
}

function logout() {
  document.cookie = "password=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;"
  location.href = "../"
}