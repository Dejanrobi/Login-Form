import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js"
import {getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
signOut, GoogleAuthProvider,
signInWithRedirect,
getRedirectResult,
signInWithPopup

} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import {getDatabase, set, ref, update} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js"
// import { GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
const firebaseApp = initializeApp({
  apiKey: "AIzaSyAOszfVSv5rbTtQFQ2_cQL9a9Wtv2kXRL4",
  authDomain: "login-with-firebase-data-a7315.firebaseapp.com",
  databaseURL: "https://login-with-firebase-data-a7315-default-rtdb.firebaseio.com",
  projectId: "login-with-firebase-data-a7315",
  storageBucket: "login-with-firebase-data-a7315.appspot.com",
  messagingSenderId: "992738365350",
  appId: "1:992738365350:web:79ac273ef63f6a89d40967"
})

//initializing the firebaseApp
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
const provider = new GoogleAuthProvider(firebaseApp);
// const provider = GoogleAuthProvider(firebaseApp)


//Getting all the buttons
const loginBtn = document.querySelector(".login-btn");
const signupBtn = document.querySelector(".signup-btn");
const logOut = document.querySelector(".logout-btn")
const googleBtn = document.querySelector(".google-btn")

// onAuthStateChanged(auth, user=>{
//   if(user!=null){
//     console.log("Logged In!!!")
//   }else{
//     console.log("No User!!!!")
//   }
// })

//Setting Up the Register function
function register(){
  //Getting all of the input fields
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;

  //console.log(email, password);

  //Validating the INPUT FIELDS
  if(validate_email(email) == false || validate_password(password) == false){
    alert("Email or Password if Outta Line!!!!")
  }
  else{
    createUserWithEmailAndPassword(auth, email, password).then((userCredential)=>{
      //Signed In
      const user = userCredential.user

      //INSERTING THE USER INTO THE REALTIME DATABASE
      set(ref(database, 'users/' + user.uid), {
        email: email,
        password: password,
        last_login: Date.now()       
      }).then(()=>{
        alert("User Create sucessfully!!!")
      }).catch((e)=>{
        alert(e);
      })

      //successfully signed in
      
    }).catch((e)=>{
      const errorCode = e.code;
      const errorMessage = e.message 
      alert(`${errorCode}: ${errorMessage}`)
    })
  }
}

//Validating the Email
function validate_email(email){
  const expression = /^[^@]+@\w+(\.\w+)+\w$/
  if(expression.test(email) == true){
    //email is good
    return true
  }
  else{
    //Email is not good
    return false
  }
}

//Validating the password
function validate_password(password){
  if(password<6){
    return false
  }
  else{
    return true
  }
}


signupBtn.addEventListener("click", register);

//SETTING UP A LOGIN FUNCTION
function login(){
  const email = document.querySelector(".email").value 
  const password = document.querySelector(".password").value 

  if(validate_email(email)==false || validate_password(password)==false){
    alert("Email or password is out of Line")
  }else{
    signInWithEmailAndPassword(auth, email, password).then((userCredential)=>{
      //Signed in
      const user = userCredential.user

      update(ref(database, 'users/' + user.uid), {
        last_login: Date.now()       
      })
    }).then(()=>{
      alert("User Logged In Successfully")
    }).catch((e)=>{
      const errorCode = e.code
      const errorMessage = e.message 
      alert(`${errorMessage}`)
    })

  }
}

loginBtn.addEventListener("click", login)

//SIGNING THE USER OUT
function logout(){
  signOut(auth).then(()=>{
    alert("User Signed Out Successfully")
  }).catch((e)=>{
    alert(e.message)
  })
  

}

logOut.addEventListener("click", logout)

//SIGNING IN WITH GOOGLE USING THE REDIRECT METHOD
function googleSignInRedirect(){
  signInWithRedirect(auth, provider)

  getRedirectResult(auth).then((result)=>{
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken 

    //signed in User
    const user = result.user 

  }).catch((error)=>{
    const eCode = e.code 
    const eMessage = e.message 
    const email = e.email 
    const credential = GoogleAuthProvider.credentialFromError(error)
    alert(`${eCode}: ${eMessage}`)
  })

}


//SIGNING WITH POPUP
function googleSignInWithPopup(){
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...

      alert(user.displayName)
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      alert(errorMessage)
    });
}


googleBtn.addEventListener("click", googleSignInWithPopup)