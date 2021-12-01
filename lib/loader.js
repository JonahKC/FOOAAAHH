// Once loading bar and the meta tags are loaded, load everything else via ajax
let loadbar = new ldBar("#gameloadingbar");const loadIncrement=100/12;
window.addEventListener('load', function() {
    // Make an XMLHTTPRequest to the indexHTMLloader.txt file
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './_indexHTMLloader.html', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                loadbar.set(loadbar.value+loadIncrement);
                document.body.innerHTML = xhr.responseText;
            } else {
                console.error('FATAL ERROR LOADING HTMLloader');
            }
        }
    }
});