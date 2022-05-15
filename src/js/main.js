const urlPosts = "http://localhost:3000/posts";
const postContainer = document.getElementById("blogPosts");
let controlRepeated = [];
let indexPost = 0; //Last post load


window.onload = () => {
    getPosts();
};


//!ADD INFINITY SCROLL
postContainer.addEventListener('scroll', () => {
    if (postContainer.scrollTop + postContainer.clientHeight >=
        postContainer.scrollHeight) {
        getPosts();
    }
})

//!GET DATA
const getPosts = () => {
    fetch(urlPosts)
        .then((response) => response.json())
        .then((data) => {
            for (let i = indexPost; i < indexPost + 10; i++) {
                addPosts(data[i]);
            }
            indexPost = indexPost + 10;
        });
};

//!ADD POSTS HTML
async function addPosts(post) {

    let titlePost = post.title;
    let usernamePost = await getUsername(post.userId);
    let idPost = post.id;
    let imagePost = getImagesSplash(99);
    createHTMLpostSection(imagePost, titlePost, usernamePost, idPost);
    createHTMLsliderSection(imagePost, titlePost, idPost);

    //Remove active class
    const divsCarousel = document.querySelectorAll('.carousel-item');
    divsCarousel.forEach(div => {
        div.classList.remove("active")
    })
    divsCarousel[0].classList.add("active");

}

async function createHTMLsliderSection(image, title, id) {
    const carouselContent = document.getElementById("carouselContent");

    const div = document.createElement("div");
    div.classList.add("carousel-item");
    div.dataset.id = id;
    div.addEventListener("click", getDataModal);

    const imgSlider = document.createElement("img");
    imgSlider.classList.add("d-block", "w-100");
    imgSlider.src = image;

    const titleSlider = document.createElement("h5");
    titleSlider.textContent = title

    div.append(imgSlider, titleSlider);
    carouselContent.append(div);

}

async function createHTMLpostSection(image, title, username, id) {

    //Article
    const article = document.createElement("article");
    article.classList.add("card");
    // article.style.width = "18rem";
    article.dataset.id = id;
    article.addEventListener("click", getDataModal);

    //Img element
    const img1 = document.createElement("div");
    img1.classList.add("card-img");
    // img1.classList.add("card-img-top", "card-img");
    img1.style.backgroundImage = `url(${image})`;

    const img2 = document.createElement("div");
    img2.classList.add("card__img--hover");
    img2.style.backgroundImage = `url(${image})`;


    //Body container
    const sectionBody = document.createElement("section");
    sectionBody.classList.add("card-info");

    //Buttons container
    const sectionButtons = document.createElement("section");
    sectionButtons.classList.add("card-buttons");

    //Delete and Edit buttons
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    deleteButton.id = "deleteBtn";
    editButton.id = "editBtn";
    deleteButton.textContent = "Delete";
    editButton.textContent = "Edit";
    deleteButton.classList.add("btn", "buttons_posts");
    editButton.classList.add("btn", "buttons_posts");

    //add buttons to their section
    sectionButtons.append(editButton, deleteButton);

    //create title
    const h2 = document.createElement("h2");
    h2.classList.add("card-title");
    h2.textContent = title;
    //create username
    const userName = document.createElement("p");
    userName.classList.add("card-text");
    userName.textContent = `by ${username}`;

    //add title,username and buttons to body
    sectionBody.append(sectionButtons, h2, userName);
    //add all to article
    article.append(img1, img2, sectionBody);

    //ADD to general container
    postContainer.appendChild(article);
}

//!GET USERNAME
async function getUsername(userId) {
    const userURL = `http://localhost:3000/users/${userId}`;
    const response = await fetch(userURL);
    const user = await response.json();
    return user.username;
}

//!GET IMAGES
async function getImages(filter = '') {
    const urlImages = "https://api.pexels.com/v1/curated?per_page=80";
    const dataImages = await fetchImages(urlImages);
    return generateRandomImage(dataImages);
}

async function fetchImages(url) {
    // const APIkey = "563492ad6f91700001000001bfb8fa2610e342dcbc6aaf2087ec52d0"; pexels
    const APIkey = "gKosga8otH1P9B-t1lcm2ZyIiFUPmOE8A0XN7Akra5M";
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: APIkey
        }
    });
    const data = await response.json();
    return data.photos;
}

function generateRandomImage(arrayImages) {
    //Only 80 images in the API 
    //we have 100 post, so that's why we control not to have repeated images until 80 posts
    let index;
    let image = '';
    if (controlRepeated.length < 80) {
        index = randomIndex(arrayImages);
        while (controlRepeated[0] == arrayImages[index].id) {
            index = randomIndex(arrayImages);
        }
        controlRepeated.unshift(arrayImages[index].id);
    } else {
        index = randomIndex(arrayImages);
    }

    image = arrayImages[index].src.tiny;
    return image;

}

//!GET IMAGE FROM UNSPLASH SOURCE
function getImagesSplash(index) {
    const randomNumber = randomIndex(index);
    const srcImages = `https://source.unsplash.com/16${randomNumber}x9${randomNumber}/`
    return srcImages;
}

function randomIndex(num) {
    return Math.floor((Math.random() * num) + 1);
}


//!GET DATA FOR MODAL SPECIFIC POST
function getDataModal(e) {
    if (!(e.target.id === "deleteBtn" || e.target.id === "editBtn")) {
        const clickPostID = this.dataset.id;
        fetchToServerPosts(clickPostID);
    } else if (e.target.id === "editBtn") {
        const clickPostID = e.target.parentElement.parentElement.dataset.id;
        fetchToServerPosts(clickPostID, false);
    } else if (e.target.id === "deleteBtn") {
        deletePost(e);
    }
}

async function fetchToServerPosts(id, info = true) {
    const urlPost = `http://localhost:3000/posts/${id}`;
    fetch(urlPost)
        .then((response) => response.json())
        .then((data) => {
            if (info) {
                addElementModal(data);
            } else {
                addElementModalEdit(data)
            }
        });
}

// !ADD ELEMENTS TO MODAL
async function addElementModal(post) {
    const parentContainer = document.getElementById("modalContent");
    parentContainer.textContent = "";
    //Close modal

    //Create title
    const h2 = document.createElement("h2");
    h2.classList.add("modal__title");
    h2.textContent = post.title;

    //Create body
    const body = document.createElement("p");
    body.textContent = post.body;
    body.classList.add("modal__body");

    //Create div container user info
    const divUser = document.createElement("div");
    divUser.classList.add("modal__user-info");

    //Create username
    const user = await getUsername(post.userId);
    const username = document.createElement("p");
    username.classList.add("user-info__username");
    username.textContent = user.username;
    //Create email
    const email = document.createElement("p");
    email.classList.add("user-info__email");
    email.textContent = user.email;
    //getUsername function
    //add to userinfo div the p
    divUser.append(username, email);

    //Create section comments
    const sectionComments = document.createElement("section");
    sectionComments.classList.add("modal__comments");
    //create button show comments
    const showCommentesBtn = document.createElement("button");
    showCommentesBtn.classList.add("comments-container");
    showCommentesBtn.textContent = "Show comments";
    //Create comments container
    const containerComments = document.createElement("section");
    containerComments.classList.add("comments-container");
    containerComments.classList.add("container--hide");
    //add to section
    sectionComments.append(showCommentesBtn, containerComments);

    //ADD ALL TO CONTAINER
    parentContainer.append(h2, body, divUser, sectionComments);

    parentContainer.parentElement.classList.toggle("container--hide");
}

// !ADD ELEMENTS TO MODAL EDIT
async function addElementModalEdit(post) {
    const parentContainer = document.getElementById("modalContentEdit");
    parentContainer.textContent = "";
    //Close modal

    //Create title
    const h2 = document.createElement("h2");
    h2.classList.add("modal__title");
    h2.textContent = "Edit the post";

    //Create form 
    const formBody = document.createElement("form");
    formBody.classList.add("modal-edit__form");
    formBody.dataset.id = post.id;

    //Create form content
    //Create label title
    const labelTitle = document.createElement("label");
    labelTitle.classList.add("modal-edit__label");
    labelTitle.htmlFor = "titleInput";
    labelTitle.textContent = "Title:";
    //Create input title
    const inputTitle = document.createElement("input");
    inputTitle.classList.add("modal-edit__input");
    inputTitle.id = "titleInput";
    inputTitle.type = "text";
    inputTitle.value = post.title;
    inputTitle.addEventListener('change', updateValue);

    labelTitle.append(inputTitle);

    //Create label body
    const labelBody = document.createElement("label");
    labelBody.classList.add("modal-edit__label");
    labelBody.htmlFor = "bodyInput";
    labelBody.textContent = "Body:";
    //Create input body
    const inputBody = document.createElement("input");
    inputBody.classList.add("modal-edit__input");
    inputBody.id = "bodyInput";
    inputBody.type = "text";
    inputBody.value = post.body;
    // inputBody.addEventListener('change', updateValue);

    labelBody.append(inputBody);

    //Create label savebutton
    const labelSave = document.createElement("label");
    labelSave.classList.add("modal-edit__label");
    labelSave.htmlFor = "saveBtn";
    //Create input savebutton
    const inputSave = document.createElement("input");
    inputSave.classList.add("modal-edit__input");
    inputSave.id = "saveBtn";
    inputSave.type = "submit";
    inputSave.value = "Save";
    labelSave.append(inputSave);

    //ADD TO FORM
    formBody.append(labelTitle, labelBody, labelSave);
    //ADD FORM TO CONTAINER
    parentContainer.append(h2, formBody);

    inputSave.addEventListener("click", modifyPost);

    parentContainer.parentElement.classList.toggle("container--hide");
}

//!UPDATE INPUT FIELDS
function updateValue(e) {
    if (e.target.id = "titleInput") {
        const title = document.getElementById("titleInput");
        title.value = e.target.value;
    } else if (e.target.id = "bodyInput") {
        const body = document.getElementById("bodyInput");
        body.value = e.target.value;
    }
}

//!MODIFY POST BY FETCH REQUEST
//!GET DATA FOR MODAL SPECIFIC POST
async function modifyPost(e) {
    e.preventDefault();
    const clickPostID = e.target.parentElement.parentElement.dataset.id;
    const urlPost = `http://localhost:3000/posts/${clickPostID}`;
    const response = await fetch(urlPost);
    const post = await response.json();
    fetchToModifyPosts(urlPost, post);
}

async function fetchToModifyPosts(url, post) {
    const titlePost = document.getElementById("titleInput").value;
    const bodyPost = document.getElementById("bodyInput").value;
    const responsePUT = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: post.userId,
            title: titlePost,
            body: bodyPost,
            id: post.id
        })
    });
    const result = await responsePUT.text();
    //!TODOcreate popup to indicate if the user is sure about modifying the post
    alert(result + 'modificado');

}

//!DELETE POST BY FETCH REQUEST
async function deletePost(e) {
    const clickPostID = e.target.parentElement.parentElement.dataset.id;
    const urlPost = `http://localhost:3000/posts/${clickPostID}`;
    const responseDELETE = await fetch(urlPost, {
        method: 'DELETE'
    });
    const result = await responseDELETE.text();
    //!TODOcreate popup to indicate if the user is sure about deleting the post
    alert(result + 'eliminado')
}


function reset() {
    postContainer.textContent = "";
    controlRepeated = [];
    indexPost = 0;
    getPosts();
}