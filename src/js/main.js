//!GENERAL VARIABLES
const urlPosts = "http://localhost:3000/posts";
const postContainer = document.getElementById("blogPosts");
let indexPost = 0; //Last post load

window.onload = () => {
    createSkeleton(4);
    getPosts();
};

//!ADD INFINITY SCROLL
postContainer.addEventListener("scroll", () => {
    if (
        postContainer.scrollTop + postContainer.clientHeight >=
        postContainer.scrollHeight
    ) {
        createSkeleton(4);
        getPosts();
    }
});

//!GET DATA
const getPosts = () => {
    fetch(urlPosts)
        .then((response) => response.json())
        .then((data) => {
            for (let i = indexPost; i < indexPost + 4; i++) {
                addPosts(data[i]);
            }
            indexPost = indexPost + 4;
        });
};

//!CREATE SKELETON TEMPLATE
function createSkeleton(num) {
    const skeleton = [...Array(num).keys()].map((card) => {
        //Article
        const article = document.createElement("article");
        article.classList.add("card", "is-loading");

        //Img element
        const img1 = document.createElement("div");
        img1.classList.add("card-img");

        //Body container
        const sectionBody = document.createElement("section");
        sectionBody.classList.add("card-info");

        //Buttons container
        const sectionButtons = document.createElement("section");
        sectionButtons.classList.add("card-buttons");

        //Delete and Edit buttons
        const deleteButton = document.createElement("button");
        const editButton = document.createElement("button");
        deleteButton.classList.add("btn", "buttons_posts");
        editButton.classList.add("btn", "buttons_posts");

        //add buttons to their section
        sectionButtons.append(editButton, deleteButton);

        //create title
        const h2 = document.createElement("h2");
        h2.classList.add("card-title");
        //create username
        const userName = document.createElement("p");
        userName.classList.add("card-text");

        //add title,username and buttons to body
        sectionBody.append(h2, userName, sectionButtons);
        //add all to article
        article.append(img1, sectionBody);

        //ADD to general container
        postContainer.appendChild(article);
    });

    return skeleton;
}

//!REMOVE SKELETON CARDS
function removeSkeleton() {
    const skeletonCards = document.querySelectorAll(".is-loading");
    if (skeletonCards) {
        Array.from(skeletonCards).map((card) => card.remove());
    }
}

//!ADD POSTS HTML
async function addPosts(post) {
    let titlePost = capitalizeFirstLetter(post.title);
    let usernamePost = await getUsername(post.userId);
    let idPost = post.id;
    let imagePost = getImagesSplash(99);
    removeSkeleton();
    createHTMLpostSection(imagePost, titlePost, usernamePost, idPost);
    createHTMLsliderSection(imagePost, titlePost, idPost);

    //Remove active class
    const divsCarousel = document.querySelectorAll(".carousel-item");
    divsCarousel.forEach((div) => {
        div.classList.remove("active");
    });
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
    titleSlider.textContent = title;

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
    userName.textContent = `by ${username.username}`;

    //add title,username and buttons to body
    sectionBody.append(h2, userName, sectionButtons);
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
    return user;
}

//!GET IMAGE FROM UNSPLASH SOURCE
function getImagesSplash(index) {
    const randomNumber = randomIndex(index);
    const srcImages = `https://source.unsplash.com/16${randomNumber}x9${randomNumber}/`;
    return srcImages;
}

function randomIndex(num) {
    return Math.floor(Math.random() * num + 1);
}

//!GET DATA FOR MODAL SPECIFIC POST
async function getDataModal(e) {

    if (!(e.target.id === "deleteBtn" || e.target.id === "editBtn")) {
        const clickPostID = this.dataset.id;
        fetchToServerPosts(clickPostID);
    } else if (e.target.id === "editBtn") {
        const clickPostID = e.target.parentElement.parentElement.parentElement.dataset.id;
        fetchToServerPosts(clickPostID, false);
    } else if (e.target.id === "deleteBtn") {
        const popupModal = document.getElementById("popup");
        const responseDelete = await deletePost(e);
        const clickPostID = e.target.parentElement.parentElement.parentElement.dataset.id;
        popup(clickPostID, popupModal, false, responseDelete);
        removeCard(clickPostID);
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
                addElementModalEdit(data);
            }
        });
}

// !ADD ELEMENTS TO MODAL
async function addElementModal(post) {
    const parentContainer = document.getElementById("modalContent");
    parentContainer.textContent = "";

    //Close modal
    const closeModalBtn = document.createElement("button");
    closeModalBtn.textContent = "X";
    closeModalBtn.classList.add("modal__close");
    closeModalBtn.addEventListener("click", () =>
        toogleDisplay(parentContainer.parentElement.parentElement)
    );
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
    const userContainer = document.createElement("div");
    userContainer.classList.add("user__container");
    const user = await getUsername(post.userId);
    const username = document.createElement("p");
    username.classList.add("user-info__username");
    username.textContent = user.username;
    const userIcon = document.createElement("i");
    userIcon.className = "fa-solid fa-circle-user";
    userContainer.append(userIcon, username);

    //Create email
    const emailContainer = document.createElement("div");
    emailContainer.classList.add("email__container");
    const email = document.createElement("p");
    email.classList.add("user-info__email");
    email.textContent = user.email;
    const emailIcon = document.createElement("i");
    emailIcon.className = "fa-solid fa-envelope";
    emailContainer.append(emailIcon, email);

    //add to userinfo div the p
    divUser.append(userContainer, emailContainer);

    //button container
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("modal__button-container");
    //create button show comments
    const showCommentesBtn = document.createElement("button");
    showCommentesBtn.classList.add("comments__show-btn");
    showCommentesBtn.classList.add("primary__btn");
    showCommentesBtn.textContent = "Show comments";
    showCommentesBtn.addEventListener("click", () => getDataComments(post.id));
    btnContainer.append(showCommentesBtn);
    //Create comments container
    const containerComments = document.createElement("section");
    containerComments.classList.add("comments-container");
    containerComments.classList.add("container--hide");
    containerComments.id = "commentsContainer";

    //ADD ALL TO CONTAINER
    parentContainer.append(
        closeModalBtn,
        h2,
        body,
        divUser,
        btnContainer,
        containerComments
    );

    toogleDisplay(parentContainer.parentElement.parentElement);
}

//!GET DATA FROM URL COMMENTS
function getDataComments(postId) {
    const containerComments = document.getElementById("commentsContainer");
    containerComments.textContent = "";
    const commentsURL = `http://localhost:3000/comments`;
    fetch(commentsURL)
        .then((response) => response.json())
        .then((data) => {
            for (const comment of data) {
                if (comment.postId === postId) {
                    addCommentsToSection(comment, containerComments);
                }
            }
        });
}

//!ADD COMMENTS TO HTML
function addCommentsToSection(comment, containerComments) {
    containerComments.classList.add("scrollbar");
    const commentItem = document.createElement("div");
    commentItem.classList.add("comment__item");
    //create comments elements
    const commentName = document.createElement("h3");
    commentName.classList.add("comment__name");
    commentName.textContent = comment.name;

    const commentEmail = document.createElement("p");
    commentEmail.classList.add("comment__email");
    commentEmail.textContent = comment.email;

    const commentBody = document.createElement("p");
    commentBody.classList.add("comment__body");
    commentBody.textContent = comment.body;

    const line = document.createElement("hr");
    line.classList.add("comment__separator");
    //add comments elements to containerComments
    commentItem.append(commentName, commentEmail, commentBody, line);
    containerComments.append(commentItem);
    toogleDisplay(containerComments);
}

// !ADD ELEMENTS TO MODAL EDIT
async function addElementModalEdit(post) {
    const parentContainer = document.getElementById("modalContentEdit");
    parentContainer.textContent = "";
    //Close modal
    parentContainer.parentElement.addEventListener("click", (event) => {
        closeModal(parentContainer.parentElement, event);
    });

    //Image create background
    const backgorundImage = document.createElement("div");
    backgorundImage.classList.add("modal-edit__img");

    //Image illustration
    const illustrationImage = document.createElement("div");
    illustrationImage.classList.add("modal-edit__illustration");

    backgorundImage.append(illustrationImage);

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
    inputTitle.addEventListener("change", updateValue);

    labelTitle.append(inputTitle);

    //Create label body
    const labelBody = document.createElement("label");
    labelBody.classList.add("modal-edit__label");
    labelBody.htmlFor = "bodyInput";
    labelBody.textContent = "Body:";
    //Create input body
    const inputBody = document.createElement("textarea");
    inputBody.classList.add("modal-edit__textarea");
    inputBody.id = "bodyInput";
    // inputBody.type = "text";
    inputBody.value = post.body;
    inputBody.addEventListener('change', updateValue);

    labelBody.append(inputBody);

    //Create input savebutton
    const inputSave = document.createElement("input");
    inputSave.classList.add("modal-edit__btn");
    inputSave.id = "saveBtn";
    inputSave.type = "submit";
    inputSave.value = "Save";

    //Close btn
    const inputClose = document.createElement("input");
    inputClose.className = "modal-edit__btn modal-edit__btn-close";
    inputClose.id = "deleteBtn";
    inputClose.type = "button";
    inputClose.value = "Close";
    inputClose.addEventListener("click", (e) => {
        toogleDisplay(parentContainer.parentElement);
    });

    //Container buttons
    const containerButtons = document.createElement("div");
    containerButtons.append(inputClose, inputSave);
    containerButtons.classList.add("modal-edit__container-btn");
    //ADD TO FORM
    formBody.append(labelTitle, labelBody);
    //ADD FORM TO CONTAINER
    parentContainer.append(backgorundImage, formBody, containerButtons);

    inputSave.addEventListener("click", (e) => {
        e.preventDefault();
        modifyPost(e);
    });

    parentContainer.parentElement.classList.toggle("container--hide");
}

//!UPDATE INPUT FIELDS
function updateValue(e) {
    if ((e.target.id === "titleInput")) {
        const title = document.getElementById("titleInput");
        title.value = e.target.value;
    } else if ((e.target.id === "bodyInput")) {
        const body = document.getElementById("bodyInput");
        body.value = e.target.value;
    }
}

//!MODIFY POST BY FETCH REQUE
//!GET DATA FOR MODAL SPECIFIC POST
async function modifyPost(e) {
    const popupModal = document.getElementById("popup");
    const clickPostID = e.target.parentElement.previousSibling.dataset.id;
    const urlPost = `http://localhost:3000/posts/${clickPostID}`;
    const response = await fetch(urlPost);
    const post = await response.json();
    const result = await fetchToModifyPosts(urlPost, post);
    //show popup info after modify post
    popup(clickPostID, popupModal, true, result);
}

async function fetchToModifyPosts(url, post) {
    const titlePost = document.getElementById("titleInput").value;
    const bodyPost = document.getElementById("bodyInput").value;
    try {
        await fetch(url, {
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
        updateCard(post.id, titlePost);
        return false;
    } catch (error) {
        console.log(error);
        return true;
    }
}

//!FUNCTION TO REMOVE POST
function removeCard(id) {
    const element = document.querySelector((`article[data-id='${id}']`));
    element.remove();
}

//!FUNCTION TO UPDATE POST CARD INFO
function updateCard(id, title) {
    const element = document.querySelector((`article[data-id='${id}']`));
    const titleElement = element.querySelector(".card-title");
    titleElement.textContent = title;
}

//!DELETE POST BY FETCH REQUEST
async function deletePost(e) {
    const clickPostID = e.target.parentElement.parentElement.parentElement.dataset.id;
    const urlPost = `http://localhost:3000/posts/${clickPostID}`;
    try {
        await fetch(urlPost, {
            method: 'DELETE'
        });
        // const result = await responseDELETE.text();
        return false;
    } catch (error) {
        console.log(error);
        return true;
    }

}

//!CAPITALIZE FIRST LETTER
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//!POPUP MODAL EDIT/DELETE INFO
function popup(id, container, edit = true, error = false) {

    //Remove last popup create if exists
    const popup = document.getElementById("popup").childNodes;
    if (popup.length > 0) {
        Array.from(popup).map(child => child.remove());
    }

    const modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog");

    const modalContent = document.createElement("section");
    modalContent.classList.add("modal-content");

    //Popup header
    const modalHeader = document.createElement("article");
    modalHeader.classList.add("modal-header");

    const h5Header = document.createElement("h5");
    h5Header.classList.add("modal-title");
    h5Header.textContent = "Info"

    modalHeader.append(h5Header);

    //Popupbody
    const modalBody = document.createElement("article");
    modalBody.classList.add("modal-body");

    const pBody = document.createElement("p");
    //Add content based on response and method
    if (!error) {
        if (edit) {
            pBody.textContent = `Post with the id ${id} has been succesfully modified`;
        } else {
            pBody.textContent = `Post with the id ${id} has been succesfully removed`;
        }
    } else {
        pBody.textContent = `An error has occured when updating post`;
    }

    modalBody.append(pBody);
    //Popupfooter
    const modalFooter = document.createElement("modal-footer");
    modalFooter.classList.add("modal-footer");

    //Popup buttons
    const buttonClose = document.createElement("button");
    buttonClose.classList.add("btn", "btn-secondary");
    buttonClose.textContent = "Close";
    buttonClose.addEventListener("click", () => {
        const editModal = document.getElementById("modalContentEdit").parentElement;
        toogleDisplay(container);
        //Depending on delete or edit function
        if (!editModal.classList.contains("container--hide")) {
            toogleDisplay(editModal);
        }
    });

    modalFooter.append(buttonClose);
    modalContent.append(modalHeader, modalBody, modalFooter);
    modalDialog.append(modalContent);

    container.append(modalDialog);

    toogleDisplay(container);

}

//!MODAL FUNCTIONALITY
const parentContainer = document.querySelector(".modal");
parentContainer.addEventListener("click", (event) =>
    closeModal(parentContainer, event)
);

function closeModal(element, event) {
    if (element === event.target) {
        toogleDisplay(element);
    }
}

//!TOGGLE DISPLAY ELEMENT HIDE/SHOW
function toogleDisplay(element) {
    element.classList.toggle("container--hide");
}