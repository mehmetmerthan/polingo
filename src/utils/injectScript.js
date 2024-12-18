const injectScript = `
var materialIconsLink = document.createElement('link');
materialIconsLink.rel = 'stylesheet';
materialIconsLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
document.head.appendChild(materialIconsLink);

let currentMenu = null;

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var selectedText = window.getSelection().toString();
    if (selectedText) {
        if (currentMenu) {
            document.body.removeChild(currentMenu);
            currentMenu = null;
        }
        var menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = (e.clientY - 150) + 'px';
        menu.style.left = (e.clientX + 10) + 'px';
        menu.style.backgroundColor = '#ffffffff';
        menu.style.borderRadius = '10px';
        menu.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, 0.4)';
        menu.style.padding = '10px';
        menu.style.zIndex = 1000;
        menu.style.border = '1px solid rgba(173, 173, 173, 1)';
        
        var button1 = document.createElement('button');
        button1.style.display = 'block';
        button1.style.color = '#000000';
        button1.style.background = 'transparent';
        button1.style.border = 'none'; 
        var icon = document.createElement('i');
        icon.className = 'material-icons';
        icon.innerHTML = 'translate';
        icon.style.fontSize = '64px'; 
        button1.appendChild(icon);
        button1.onclick = function() {
            window.ReactNativeWebView.postMessage(selectedText);
            document.body.removeChild(menu);
            currentMenu = null;
        };

        menu.appendChild(button1);
        document.body.appendChild(menu);
        currentMenu = menu;
    }
});

document.addEventListener('click', function(e) {
    if (currentMenu) {
        document.body.removeChild(currentMenu);
        currentMenu = null;
    }
});
`;

export default injectScript;
