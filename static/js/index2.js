let xhr1, xhr2, flag = false, order = 1, show_status = 2;
var start_index = 0;

window.onload = intital();
async function intital() {
    flag = false;
    document.getElementsByClassName('loading')[0].innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/64/64708.png" alt=""><p id="note-loaded"></p><button onclick="stopxhr(${order},${show_status})">Stop</button>`
    allids = await allNotes();
    console.log(start_index);
    for (let i = start_index; i < allids.length; i++) {
        console.log(start_index);
        const id = allids[i];
        start_index++;
        note = await getNote(id._id);
        newnote = document.createElement("div");
        newnote.classList.add('fix-width');
        newnote.innerHTML = create_note(note);
        document.getElementById('note-loaded').innerHTML = `${i + 1}/${allids.length}`;
        document.getElementsByClassName("notes")[0].appendChild(newnote);
    }
    document.getElementsByClassName('loading')[0].innerHTML = `<button class='btn' onclick="intital(${order},${status})">Refresh</button>`;
}


function getNote(id) {
    return new Promise((Resolve, Reject) => {
        xhr2 = new XMLHttpRequest();
        xhr2.open('GET', `/note/${id}`, true);
        xhr2.setRequestHeader('X-CSRF-TOKEN', document.getElementById('myform').children[0].value);
        xhr2.onload = function () {
            if (xhr2.status === 200) {
                var response = JSON.parse(xhr2.response);
                return Resolve(response);
            } else {
                return Reject("error");
            }
        };
        xhr2.send();
    })
}

function allNotes() {
    return new Promise((Resolve, Reject) => {
        xhr1 = new XMLHttpRequest();
        xhr1.open('GET', `/allNotes?order=${order}&status=${show_status}`, true);
        xhr1.setRequestHeader('X-CSRF-TOKEN', document.getElementById('myform').children[0].value);
        xhr1.onload = function () {
            if (xhr1.status === 200) {
                var response = JSON.parse(xhr1.response);
                console.log(response);
                return Resolve(response);
            } else {
                return Reject("error");
            }
        };
        xhr1.send();
    })
}

function stopxhr() {
    console.log(start_index);
    flag = true;
    if (xhr1)
        xhr1.abort();
    if (xhr2)
        xhr2.abort();
    document.getElementsByClassName('loading')[0].innerHTML = `<button class='btn' onclick="intital(${order},${show_status})">Reload</button>`
}



popupBtn.addEventListener('click', function () {
    popupOverlay.style.display = 'block';
});

closeBtn.addEventListener('click', function () {
    popupOverlay.style.display = 'none';
});

popupOverlay.addEventListener('click', function (e) {
    if (e.target === popupOverlay) {
        popupOverlay.style.display = 'none';
    }
});


function undo() {
    document.execCommand("undo", false, null);
}

function redo() {
    document.execCommand("redo", false, null);
}
const time_ele = document.getElementById('car');
time_ele.addEventListener('change', () => {
    stopxhr(1, 2);
    start_index = 0;
    document.getElementsByClassName("notes")[0].innerHTML = '';
    order = time_ele.value;
    intital();
})

const radioButtons = document.getElementsByName("myGender");
radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("change", function () {
        const selectedValue = document.querySelector('input[name="myGender"]:checked').value;
        show_status = selectedValue;
        stopxhr();
        start_index = 0;
        document.getElementsByClassName("notes")[0].innerHTML = '';
        intital();
    });
});
