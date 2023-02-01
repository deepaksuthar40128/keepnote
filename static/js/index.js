var image_data = {};

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
        note = form.children[2].outerHTML.toString();
        data = {
            topic: topic,
            note: note,
        }
    })
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