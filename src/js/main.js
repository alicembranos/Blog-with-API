const urlPosts = "http://localhost:3000/posts";
const postContainer = document.getElementById("blogPosts");
const controlRepeated = [];
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
    div.addEventListener("click", showModal);

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
    article.classList.add("post");
    article.dataset.id = id;
    article.addEventListener("click", showModal);

    //*Img container
    const sectionImg = document.createElement("section");
    sectionImg.classList.add("post__img");

    //Img element
    const img = document.createElement("img");
    img.classList.add("post__image");
    img.src = image;

    //Delete and Edit buttons
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    deleteButton.id = "deleteBtn";
    editButton.id = "editBtn";
    deleteButton.textContent = "Delete";
    editButton.textContent = "Edit";

    sectionImg.append(img, deleteButton, editButton);

    //Info container
    const sectionInfo = document.createElement("section");
    sectionInfo.classList.add("post__info");
    //create title
    const h2 = document.createElement("h2");
    h2.classList.add("post__info-title");
    h2.textContent = title;
    //create username
    const userName = document.createElement("p");
    userName.textContent = username;
    userName.classList.add("post__info-username");
    //add title,username to containerInfo
    sectionInfo.append(h2, userName);
    //add all to article
    article.append(sectionImg, sectionInfo);

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

function showModal(e) {
    if (!(e.target.id === "deleteBtn" || e.target.id === "editBtn")) {
        console.log(e.target);
    } else if (e.target.id === "deleteBtn") {

    } else if (e.target.id === "editBtn") {
        
    }
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

//!EDIT POST