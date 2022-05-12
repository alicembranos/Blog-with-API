const urlPosts = "http://localhost:3000/posts";
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
  //Article
  const article = document.createElement("article");
  article.classList.add("post");
  //Img elment
  const img = document.createElement("img");
  img.classList.add("post__image");
  //create title
  const h2 = document.createElement("h2");
  h2.classList.add("post__info-title");
  h2.textContent = post.title;
  //ADD USER
  const username = await getUsername(post.userId);
  console.log(username);
}

//!GET USERNAME
async function getUsername(userId) {
  //   let username = "";
  const userURL = `http://localhost:3000/users/${userId}`;
  const response = await fetch(userURL);
  const user = await response.json();
  return user.username;
}
