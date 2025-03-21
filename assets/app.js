// ? Select the element that will display the username
const nameHoster = document.getElementById("name");

// ! Retrieve the username from localStorage
let username = localStorage.getItem("username");

if (!username || username === "") {
  username = "User";
}

window.onload = () => {
  nameHoster.innerHTML = username;
};
