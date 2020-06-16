var first = -1;
function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
function addTabi(text) {
    const tabis = document.getElementsByClassName('tabi');
    if(tabis.length < 2) {
        if(document.getElementById('colors').checked)
            document.body.style.backgroundColor = 'darkslateblue';
        else    
            document.body.style.backgroundColor = 'black';
        var newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'tabi');
        var regtime = /^([0-9]+)\:([0-9]+)\:([0-9]+)\,([0-9]+) \-\-\>/gm;
        var arr = text.matchAll(regtime);    
        var x = arr.next()
        var where = x.value.index;
        const my_first = Number(x.value[1]) * 3600 + Number(x.value[2]) * 60 + Number(x.value[3]) + Number(x.value[4]) / 1000;        
        var location = 0;
        for(x = arr.next(); !x.done; x=arr.next()) {
            let p_text = text.substring(where, x.value.index).match(/[^\r\n]+/g);
            p_text.shift();
            p_text.pop();
            let newP = document.createElement('p');
            newP.innerHTML = p_text.join('<br>').replace('{\\an8}', '');
            newP.style.position = 'absolute';
            newP.style.top = (location * 2.5) + 'em';
            newDiv.appendChild(newP);
            location = Number(x.value[1]) * 3600 + Number(x.value[2]) * 60 + Number(x.value[3]) + Number(x.value[4]) / 1000 - my_first;
            where = x.value.index;
        }
        let p_text = text.substring(where).match(/[^\r\n]+/g);
        p_text.shift();
        let newP = document.createElement('p');
        newP.innerHTML = p_text.join('<br>').replace('{\\an8}', '');
        newP.style.position = 'absolute';
        newP.style.top = (location * 2.5) + 'em';
        newDiv.appendChild(newP);
        newDiv.style.height = '100em';
        if(first == -1)
            first = my_first;
        else {
            document.getElementById('files').disabled = true;
            if(my_first >= first) {
                newDiv.style.marginTop = '' + (my_first - first) + 'em';
                tabis[0].style.marginTop = '0em';
                }
            else {
                tabis[0].style.marginTop = '' + (first - my_first) + 'em';
                newDiv.style.marginTop = '0em';
            }
        }
        var currentDiv = document.getElementById('tab1');
        currentDiv.appendChild(newDiv);
    }
}
function clearTabs() {
    const tabis = document.getElementsByClassName('tabi');
    for(let i=tabis.length; i>0; i--)
        tabis[i-1].remove();
    document.getElementById('files').value = '';
    first = -1;
    document.getElementById('files').disabled = false;
    document.body.style.backgroundColor = 'white';
}
function switchTabs() {
    const tabis = document.getElementsByClassName('tabi');
    if(tabis.length > 0) {
        if(tabis[0].style.float == 'right')
            tabis[0].style.float = 'left';
        else
            tabis[0].style.float = 'right';
    }
}
function changeSize(value) {
    var reader = document.getElementById("reader");
    reader.style.fontSize = '' + value + 'em';
}

function openFile(event) {
    var input = event.target;
    for(let i=0; i < input.files.length; i++) {
        let reader = new FileReader();
        reader.onload = function() {
            var text = reader.result;
            addTabi(text)
        };
        reader.readAsText(input.files[i]);
    }
}
/*function flip() {
    var tab1 = document.getElementById('tab1');
    var tab2 = document.getElementById('tab2');
    var temp = tab1.className;
    tab1.className = tab2.className;
    tab2.className = temp;
}
document.body.onkeyup = function(e) {
    if(e.keyCode == 37 || e.keyCode == 39 ){
        flip();
    }
}*/
window.onscroll = function(ev) {
    var totop = document.getElementById('totop');
    if (window.scrollY > 0.8 * window.innerHeight)
        totop.style.display = 'inline-block';
    if (window.scrollY < 0.8 * window.innerHeight)
        totop.style.display = 'none';
};
function addColors(checkb) {
    const tabis = document.getElementsByClassName('tabi');
    var reader = document.getElementById('reader');
    if(checkb.checked) {
        reader.className = "colored";
        if(tabis.length > 0)
            document.body.style.backgroundColor = 'darkslateblue';
    }
    else {
        reader.className = "";
        if(tabis.length > 0)
            document.body.style.backgroundColor = 'black';
    }
}
function sync(value) {
    const tabis = document.getElementsByClassName('tabi');
    if(tabis.length == 2) {
        let h0 = Number(tabis[0].style.marginTop.match(/[0-9.]+/));
        let h1 = Number(tabis[1].style.marginTop.match(/[0-9.]+/));
        if(value > 0) {
            if(h1 - value > 0)
                tabis[1].style.marginTop = '' + (h1 - value) + 'em';
            else
                tabis[0].style.marginTop = '' + (h0 + value) + 'em';
        }
        if(value < 0) {
            if(h0 + value > 0)
                tabis[0].style.marginTop = '' + (h0 + value) + 'em';
            else
                tabis[1].style.marginTop = '' + (h1 - value) + 'em';
        }
    }
}
