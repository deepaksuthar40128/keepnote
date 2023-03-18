var image_data = {};
const popupBtn = document.getElementById('popup-btn');
const popupOverlay = document.getElementById('popup-overlay');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('close-btn');

document.getElementById('image').onchange = () => {
    const imagefiles = document.getElementById('image').files;
    Array.from(imagefiles).forEach((img) => {
        process_image(img).then((data) => {
            textarea = document.getElementById('text');
            textarea.innerHTML += `<br><div contenteditable="false" style=" resize: both;height:300px;overflow: hidden;user-select:none;display:inline-block; "><img id="${data._id}"  style="-webkit-user-drag:none;  
                user-select: none;width:100%;height:100%;" src="${data.imageURL}" alt=""></div><br>`;
        })
    })
}

function process_image(image) {
    return new Promise((resolve, reject) => {
        var filereader = new FileReader();
        filereader.readAsDataURL(image);
        filereader.onload = function (event) {
            let x = event.target.result;
            var id = "id" + Math.random().toString(16).slice(2)
            image_data[id] = image;
            return resolve({ imageURL: x, _id: id });
        }
    })
}

function setBackGround(num) {
    if (num == -1) document.getElementsByClassName('text-area')[0].style.backgroundImage = '';
    else {
        let ele = document.getElementById('preview-bg');
        document.getElementsByClassName('text-area')[0].style.backgroundImage = `url(${ele.children[num].getAttribute('src')})`
    }
}

function submitForm() {
    let form = document.getElementById('myform');
    updateURLs(form).then(() => {
        console.log("updated");
        topic = form.children[1].value;
        form.children[2].setAttribute('contenteditable', 'false');
        form.children[2].style.resize = 'none';
        note = form.children[2].outerHTML.toString();
        form.children[2].style.resize = 'both';
        form.children[2].setAttribute('contenteditable', 'true');
        var data = {};
        data["note"] = note;
        data["topic"] = topic;
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': form.children[0].value,
            }
        });
        var request = {
            "url": `/saveNote`,
            "method": "POST",
            "data": data
        }
        $.ajax(request).done(function (response) {
            document.getElementsByClassName('notes')[0].innerHTML = create_note(response) + document.getElementsByClassName('notes')[0].innerHTML;
            form.children[2].innerHTML = 'Write Something Here'
        })
    })
}


function create_note(data) {
    let dropmenu = `<div class="note-body" style="background-color:`
    if (data.isCompleted) {
        dropmenu += `#9ae79a"`;
    }
    else {
        dropmenu += `#f1c7c7"`;
    }
    dropmenu += ` id=${data._id}>
                                        <div class="note-header">
                                                ${data.topic}
                                                <div style="display:inline">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/130/130921.png" style="height:20px;width:20px">
                                                        <div class="menu">`
    if (!data.isCompleted) {
        dropmenu += `<button class="menu-item" data-type="status" onclick = btnHandler("${data._id}","status") > Completed</button>
                                                                            <button class="menu-item" data-type="edit" onclick = btnHandler("${data._id}","edit")>Edit</button>
                                                                            <button class="menu-item" data-type="remainder" onclick = btnHandler("${data._id}","remainder") > Remainder </button>`
    }
    dropmenu += `<button class="menu-item" data-type="delete" onclick = btnHandler("${data._id}","delete") >Delete</button>
                                                                        <button class="menu-item" data-type="details" onclick = btnHandler("${data._id}","details") >Details</button>
                                                        </div >
                                                </div >
                                        </div >
                        ${data.note}
                        <div>${data.createdAt}</div>
                    </div > `
    return dropmenu;
}

async function btnHandler(noteId, action) {
    console.log(noteId);
    console.log(action);
    if (action == "status") {
        console.log(action);
        document.getElementById(noteId).remove();
        var data = {};
        data["isCompleted"] = true;
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': document.getElementById('myform').children[0].value,
            }
        });
        var request = {
            "url": `/update/${noteId}`,
            "method": "POST",
            "data": data
        }
        $.ajax(request).done(function (response) {
            alert("congo");
        })
    }
    else if (action == "details") {
        popupOverlay.style.display = 'block';
        popup.children[0].innerHTML = 'Details'
        popup.children[1].innerHTML = '<div class = "loading"><img src="https://cdn-icons-png.flaticon.com/512/64/64708.png" alt=""></div>'
        details = await get_datails(noteId);
        console.log(details);
        popup.children[1].innerHTML = `
        <div class = "details">
        <p>Created By: ${details.username}</p>
        <p>created Date: ${details.createdAt}</p>
        <p>Last updated Date: ${details.updatedAt}</p>
        <p>Is Completed: ${details.isCompleted}</p>
                                                <p>Tags: student,work,School,Education</p>
                                                <p>Target Date: 20 Feb 2023</p>
                                                <p>Remaining Days: 5 Days </p>
                                                </div>`
    }
    else if (action == "remainder") {
        popupOverlay.style.display = 'block';
        popup.children[0].innerHTML = 'Remainder'
        popup.children[1].innerHTML = `<label for="datetime-input">Select a date and time:</label>
<input type="datetime-local" id="datetime-input" min="" max="" />

`
        const datetimeInput = document.getElementById('datetime-input');

        var now = new Date();
        const minDatetime = new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);
        datetimeInput.setAttribute('min', minDatetime);

        const maxDatetime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
        datetimeInput.setAttribute('max', maxDatetime);

        datetimeInput.addEventListener('change', function () {
            const selectedDatetime = new Date(datetimeInput.value) - 1;
            // console.log(selectedDatetime);
            dddd = new Date() - 1;
            dddd += 84600;
            // console.log(dddd);
            if (selectedDatetime < dddd) {
                alert("select atleast one hour ")
                datetimeInput.value = '';
                datetimeInput.setCustomValidity('You cannot select past date and time.');
            } else {
                datetimeInput.setCustomValidity('');
                popup.children[3].style.display = 'inline';
                popup.children[3].setAttribute('onclick', `setRemainder('${selectedDatetime}','${noteId}')`);
                // console.log(selectedDatetime);
            }
        });
    }
    else if (action == "delete") {
        delete_note(noteId);
        document.getElementById(noteId).parentElement.remove();
    }
}

function updateURLs(form) {
    return new Promise((resolve, reject) => {
        images = form.getElementsByTagName('img');
        let total_img = images.length;
        if (total_img == 0) return resolve();
        Array.from(images).forEach((image) => {
            if (image.getAttribute("id") in image_data) {
                img = image_data[image.getAttribute("id")];
                upload_image(img, form).then((data) => {
                    image.src = data.link;
                    total_img--;
                    if (total_img == 0) return resolve();
                })
            }
        })
    })
}


function upload_image(image, form) {
    return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append('image', image);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/save-img', true);
        xhr.setRequestHeader('X-CSRF-TOKEN', form.children[0].value);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.response);
                console.log(response.link);
                console.log('Image successfully uploaded.');
                return resolve({ link: response.link });
            } else {
                console.error('An error occurred while uploading the image.');
                return reject();
            }
        };
        xhr.send(formData);
    })
}

document.getElementById('background-img').onchange = () => {
    let image = document.getElementById('background-img').files[0];
    upload_image(image, document.getElementById('myform')).then((data) => {
        console.log(data);
        document.getElementById('text').style.backgroundImage = `url(../${data.link})`
    })
}

function get_datails(noteId) {
    return new Promise((Resolve, Reject) => {
        xhr = new XMLHttpRequest();
        xhr.open('GET', `/details/${noteId}`, true);
        xhr.setRequestHeader('X-CSRF-TOKEN', document.getElementById('myform').children[0].value);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.response);
                return Resolve(response);
            } else {
                return Reject("error");
            }
        };
        xhr.send();
    })
}

function delete_note(noteId) {
    xhr = new XMLHttpRequest();
    xhr.open('GET', `/delete/${noteId}`, true);
    xhr.setRequestHeader('X-CSRF-TOKEN', document.getElementById('myform').children[0].value);
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert(xhr.response);
        }
    };
    xhr.send();
}

function setRemainder(time, noteId) {
    popup.children[1].innerHTML = '<div class = "loading"><img src="https://cdn-icons-png.flaticon.com/512/64/64708.png" alt=""></div>'
    xhr = new XMLHttpRequest();
    xhr.open('GET', `/remainder/${noteId}?time=${time}`, true);
    xhr.setRequestHeader('X-CSRF-TOKEN', document.getElementById('myform').children[0].value);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.response);
            console.log(response);
            popupOverlay.style.display = 'none';
            alert("Remainder Set You will Be notified On Time");
        }
    };
    xhr.send();
}