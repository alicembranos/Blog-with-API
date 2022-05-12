const urlPosts = "http://localhost:3000/posts";

const populateBlog = () => {
    fetch(urlPosts)
        .then((response) => response.json())
        .then((data) => {
            data.map((post) => {
                let img = createNode('img');
                img.classList.add("post__image");

                //Titulo//cargar imagen
                let h2 = createNode('h2');
                h2.classList.add("post__info-title");
                h2.textContent = post.title;
                //Username
                let p = createNode('p');
                p.textContent = searchUsername(post.userId);
                console.log(post.userId);

                console.log('Title: ' + post.title);
                console.log('Username: ' + searchUsername(post.userId));

            });
        });
}

let searchUsername = (userId) => {
    let username = "";
    const urlUsers = `http://localhost:3000/users/${userId}`;
    fetch(urlUsers)
        .then((response) => response.json())
        .then((data) => {
            // console.log(data.username);
            username = data.username;
        });
        return username;
}

//searchUsername(3);
function createNode(element) {
    return document.createElement(element);
}

populateBlog();