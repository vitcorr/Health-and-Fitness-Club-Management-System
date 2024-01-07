let user_info = {id: {}, username: {}, password: {}, first_name: {}, last_name: {}, email: {}, phone_num: {}, sex: {}, dob: {}, home_addr: {}};

function memberlogininit() {
    document.getElementById("memberlogin").onclick = memberlogin;
}

function trainerlogininit() {
    document.getElementById("trainerlogin").onclick = trainerlogin;
}

function adminlogininit() {
    document.getElementById("adminlogin").onclick = adminlogin;
}

function logoutinit() {
    document.getElementById("logout").onclick = logout;
}

function memberregisterinit() {
    document.getElementById("memberregister").onclick = memberregister;
}

function trainerregisterinit() {
    document.getElementById("trainerregister").onclick = traineregister;
}


function memberlogin() {
    user_info.username = document.getElementById("username-input").value;
    user_info.password = document.getElementById("password-input").value;

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if(this.readyState==4 && this.status==200) {
            let x = this.responseText;
            console.log(x);
            alert("You have successfully logged in");
            window.location = "/profile/" + x;
        } else if(this.readyState==4 && this.status==400) {
            if (this.responseText == "already logged in") {
                alert("ERROR: You are already logged in");
            } else if (this.responseText == "no username") {
                alert("ERROR: Please enter a username");
            } else if (this.responseText == "no password") {
                alert("ERROR: Please enter a password");
            } else if (this.responseText == "username doesn't exist") {
                alert("ERROR: This username doesn't exist");
            } else if (this.responseText == "not right password") {
                alert("ERROR: This password is not correct");
            }
        }
    };
    req.open("POST", "http://localhost:3000/memberlogin");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(user_info));
}

function trainerlogin() {
    user_info.username = document.getElementById("username-input").value;
    user_info.password = document.getElementById("password-input").value;

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if(this.readyState==4 && this.status==200) {
            let x = this.responseText;
            alert("You have successfully logged in");
            window.location = "/profile/" + x;
        } else if(this.readyState==4 && this.status==400) {
            if (this.responseText == "already logged in") {
                alert("ERROR: You are already logged in");
            } else if (this.responseText == "no username") {
                alert("ERROR: Please enter a username");
            } else if (this.responseText == "no password") {
                alert("ERROR: Please enter a password");
            } else if (this.responseText == "username doesn't exist") {
                alert("ERROR: This username doesn't exist");
            } else if (this.responseText == "not right password") {
                alert("ERROR: This password is not correct");
            }
        }
    };
    req.open("POST", "http://localhost:3000/trainerlogin");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(user_info));
}

function adminlogin() {
    user_info.username = document.getElementById("username-input").value;
    user_info.password = document.getElementById("password-input").value;

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if(this.readyState==4 && this.status==200) {
            alert("You have successfully logged in");
            window.location = "/";
        } else if(this.readyState==4 && this.status==400) {
            if (this.responseText == "already logged in") {
                alert("ERROR: You are already logged in");
            } else if (this.responseText == "no username") {
                alert("ERROR: Please enter a username");
            } else if (this.responseText == "no password") {
                alert("ERROR: Please enter a password");
            } else if (this.responseText == "username doesn't exist") {
                alert("ERROR: This username doesn't exist");
            } else if (this.responseText == "not right password") {
                alert("ERROR: This password is not correct");
            }
        }
    };
    req.open("POST", "http://localhost:3000/adminlogin");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(user_info));
}

//onclick function for logout button
function logout() {
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (this.readyState==4 && this.status==200) {
            alert("You have successfully logged out");
            window.location = "/login";
        } else if (this.readyState==4 && this.status==400)  {
            alert("ERROR: You are not logged in yet");
        }
    }
	req.open("POST", "http://localhost:3000/logout");
	req.setRequestHeader("Content-Type", "application/json");
	req.send();
}

function memberregister() {
    user_info.username = document.getElementById("newusername").value;
    user_info.password = document.getElementById("newpassword").value;
    user_info.first_name = document.getElementById("newfirst").value;
    user_info.last_name = document.getElementById("newlast").value;
    user_info.email = document.getElementById("newemail").value;
    user_info.phone_num = document.getElementById("newnumber").value;
    user_info.sex = document.getElementById("newsex").value;
    user_info.dob = document.getElementById("newdob").value;
    user_info.home_addr = document.getElementById("newaddress").value;

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if(this.readyState==4 && this.status==200) {
            alert("You have successfully created an account");
            window.location = "/";
        } else if(this.readyState==4 && this.status==400) {
            if (this.responseText == "already logged in") {
                alert("ERROR: You are already logged in");
            } else if (this.responseText == "no username") {
                alert("ERROR: Please enter a username");
            } else if (this.responseText == "no password") {
                alert("ERROR: Please enter a password");
            } else if (this.responseText == "no first") {
                alert("ERROR: Please enter your first name");
            } else if (this.responseText == "no last") {
                alert("ERROR: Please enter your last name");
            } else if (this.responseText == "no email") {
                alert("ERROR: Please enter your email");
            } else if (this.responseText == "no phone") {
                alert("ERROR: Please enter your phone number");
            } else if (this.responseText == "no sex") {
                alert("ERROR: Please enter your sex");
            } else if (this.responseText == "no dob") {
                alert("ERROR: Please enter your date of birth");
            } else if (this.responseText == "no address") {
                alert("ERROR: Please enter your address");
            } else if (this.responseText == "already") {
                alert("ERROR: This username already exists \nPlease pick another name");
            } else if (this.responseText == "error") {
                alert("ERROR: Something went wrong. Try again");
            }
        }
    };
    req.open("POST", "http://localhost:3000/memberregister");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(user_info));
}

function traineregister() {
    user_info.username = document.getElementById("newusername").value;
    user_info.password = document.getElementById("newpassword").value;
    user_info.first_name = document.getElementById("newfirst").value;
    user_info.last_name = document.getElementById("newlast").value;
    user_info.email = document.getElementById("newemail").value;
    user_info.phone_num = document.getElementById("newnumber").value;
    user_info.sex = document.getElementById("newsex").value;
    user_info.dob = document.getElementById("newdob").value;
    user_info.home_addr = document.getElementById("newaddress").value;

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if(this.readyState==4 && this.status==200) {
            alert("You have successfully created a new trainer accountt");
            window.location = "/trainers";
        } else if(this.readyState==4 && this.status==400) {
            if (this.responseText == "no username") {
                alert("ERROR: Please enter a username");
            } else if (this.responseText == "no password") {
                alert("ERROR: Please enter a password");
            } else if (this.responseText == "no first") {
                alert("ERROR: Please enter your first name");
            } else if (this.responseText == "no last") {
                alert("ERROR: Please enter your last name");
            } else if (this.responseText == "no email") {
                alert("ERROR: Please enter your email");
            } else if (this.responseText == "no phone") {
                alert("ERROR: Please enter your phone number");
            } else if (this.responseText == "no sex") {
                alert("ERROR: Please enter your sex");
            } else if (this.responseText == "no dob") {
                alert("ERROR: Please enter your date of birth");
            } else if (this.responseText == "no address") {
                alert("ERROR: Please enter your address");
            } else if (this.responseText == "already") {
                alert("ERROR: This username already exists \nPlease pick another name");
            } else if (this.responseText == "error") {
                alert("ERROR: Something went wrong. Try again");
            }
        }
    };
    req.open("POST", "http://localhost:3000/trainers");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(user_info));
}