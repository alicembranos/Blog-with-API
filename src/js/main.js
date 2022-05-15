//!GENERAL VARIABLES
const urlPosts = "http://localhost:3000/posts";
const postContainer = document.getElementById("blogPosts");

//!ON LOAD WINDOW SHOW ALL POST
window.onload = () => {
    getPosts();
};

//!GET DATA
const getPosts = () => {
    fetch(urlPosts)
        .then((response) => response.json())
        .then((data) => {
            for (const post of data) {
                addPosts(post);
            }
        });
};

//!ADD POSTS HTML
async function addPosts(post) {
    //Container reset
    postContainer.textContent = "";

    //Article
    const article = document.createElement("article");
    article.classList.add("post");
    article.dataset.id = post.id;
    article.addEventListener("click", getDataModal);

    //Img container
    const sectionImg = document.createElement("section");
    sectionImg.classList.add("post__img");
    //Img elment
    const img = document.createElement("img");
    /*TEST ADD SRC*/
    img.src = "https://via.placeholder.com/200x200";
    img.classList.add("post__image");

    //Delete and Edit buttons
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    deleteButton.id = "deleteBtn";
    editButton.id = "editBtn";
    deleteButton.textContent = "Delete";
    editButton.textContent = "Edit";
    sectionImg.append(img, deleteButton, editButton);

    //*Info container
    const sectionInfo = document.createElement("section");
    sectionInfo.classList.add("post__info");

    //create title
    const h2 = document.createElement("h2");
    h2.classList.add("post__info-title");
    h2.textContent = post.title;

    //create username
    const userName = document.createElement("p");
    const user = await getUsername(post.userId);
    userName.textContent = user.username;
    userName.classList.add("post__info-username");

    //add title,username to containerInfo
    sectionInfo.append(h2, userName);

    //add all to article
    article.append(sectionImg, sectionInfo);

    //ADD to general container
    postContainer.appendChild(article);
    console.log(article);
}

//!GET USERNAME
async function getUsername(userId) {
    const userURL = `http://localhost:3000/users/${userId}`;
    const response = await fetch(userURL);
    const user = await response.json();
    return user;
}

//!GET DATA FOR MODAL SPECIFIC POST
function getDataModal(e) {
    const clickPostID = this.dataset.id;
    const urlPost = `http://localhost:3000/posts/${clickPostID}`;
    if (!(e.target.id === "deleteBtn" || e.target.id === "editBtn")) {
        fetch(urlPost)
            .then((response) => response.json())
            .then((data) => {
                addElementModal(data);
            });
    }
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
        toogleDisplay(parentContainer.parentElement)
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
    showCommentesBtn.classList.add("comments__show-btn");
    showCommentesBtn.textContent = "Show comments";
    showCommentesBtn.addEventListener("click", () => getDataComments(post.id));
    //Create comments container
    const containerComments = document.createElement("section");
    containerComments.classList.add("comments-container");
    containerComments.classList.add("container--hide");
    containerComments.id = "commentsContainer";
    //add to section
    sectionComments.append(showCommentesBtn, containerComments);

    //ADD ALL TO CONTAINER
    parentContainer.append(closeModalBtn, h2, body, divUser, sectionComments);

    toogleDisplay(parentContainer.parentElement);
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
    console.log(containerComments);

    //add comments elements to containerComments
    containerComments.append(commentName, commentEmail, commentBody);
    toogleDisplay(containerComments);
}
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