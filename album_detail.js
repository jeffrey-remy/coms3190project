function fetchUser() {
    document.getElementById("loginuser").innerHTML = `Authenticating...`;
    return new Promise((resolve, reject) => {
      fetch("./07_2_31_Challenge_fetchuser_login_Async_Await.json")
      .then((response)=>{return response.json()})
      .then((data)=>{resolve(data)})
      .catch((error)=>{console.log(error)})
    });
  }
  function login(users, userInput, passwordInput) {
      //check user and password with users json
      if(users.user === userInput && users.password === passwordInput){
          document.getElementById("loginuser").innerHTML = "correct";
      }else {
          document.getElementById("loginuser").innerHTML = "false";
      }
  }
  async function useAdmin(userInput, passwordInput) {
      let users = await fetchUser();
      login(users,userInput,passwordInput);
  }
  document.getElementById("loginButton").addEventListener("click", (event) => {
    event.preventDefault();
    const userInput = document.getElementById("userInput").value;
    const passwordInput = document.getElementById("passwordInput").value;
    useAdmin(userInput,passwordInput);
  });