let API_URL = "https://JCWYTastic-Backend.turnip123.repl.co";
let CHECK_PASS_URL = API_URL+"/fooaaahh/admin/check";

{
    password = document.cookie.match('(^|;)\\s*' + "password" + '\\s*=\\s*([^;]+)')?.pop() || ''
    if (password != "") {
        console.log("Cookie detected!");
        var xhr = new XMLHttpRequest();
        xhr.open('GET', CHECK_PASS_URL, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader("password", password)
        xhr.onload = function() {
            if (xhr.response.success) {
                location.href = '/panel';
            } else {
                console.log("Invalid cookie!")
                document.cookie = "password=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;"
            }
        }
        xhr.send();
    }
}

function login() {
    var pass = document.getElementById('password').value;

    if (pass == "") {
        notification("Please enter your password");
    } else {
        notification("");
        checkPassword(pass);
    }
}

function checkPassword(pass) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', CHECK_PASS_URL, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader("password", pass)
    xhr.onload = function() {
        if (xhr.response.success) {
            const d = new Date();
            d.setTime(d.getTime() + (1*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = "password=" + pass + ";expires="+ d.toUTCString()+";path=/;";
            location.href = '/panel';
            document.getElementById("notification").innerText = "Success!";
            document.getElementById("notification").style.color = "lightgreen";
            notification("Success!");
        } else {
           notification("Incorrect Password"); 
        }
        
    }
    xhr.send();
}

function notification(text) {
    document.getElementById("notification").innerText = text;
}