const urlPosts = "http://localhost:3000/posts";
const postContainer = document.getElementById("blogPosts");
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
  postContainer.textContent = "";

  //Article
  const article = document.createElement("article");
  article.classList.add("post");
  //*Img container
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
  userName.textContent = await getUsername(post.userId);
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
  return user.username;
}
