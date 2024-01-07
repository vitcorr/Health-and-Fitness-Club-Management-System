let user_info = {id: {}, username: {}, password: {}, first_name: {}, last_name: {}, email: {}, phone_num: {}, sex: {}, dob: {}, home_addr: {}};

let newrecord = {type: {}, new_weight: {}, height: {}, excercises: {}, date_end: {}, goal_description: {}}

function savepd() {
    user_info.first_name = document.getElementById("firstname").value;
    user_info.last_name = document.getElementById("lastname").value;
    user_info.email = document.getElementById("email").value;
    user_info.phone_num = document.getElementById("phone").value;
    user_info.sex = document.getElementById("sex").value;
    user_info.dob = document.getElementById("dob").value;
    user_info.home_addr = document.getElementById("address").value;

    let x = document.getElementById("title").textContent;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if(this.readyState==4 && this.status==200) {
            alert("You have saved new personal details");
        } else if(this.readyState==4 && this.status==400) {
            alert("ERROR: Something went wrong and the changes weren't saved");
        }
    };
    req.open("POST", "http://localhost:3000/profile/" + x);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(user_info));
}

function savenewhm() {
    newrecord.type = document.getElementById("add").name;
    newrecord.new_weight = document.getElementById("weight").value;
    newrecord.height = document.getElementById("height").value;

    let x = document.getElementById("title").textContent;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if(this.readyState==4 && this.status==200) {
            alert("You have saved a new health metric");
            window.location = "/profile/" + x;
        } else if(this.readyState==4 && this.status==400) {
            if (this.responseText == "no changes") {
                alert("ERROR: You didn't make a change");
            } else {
                alert("ERROR: Something went wrong and the changes weren't saved");
            }
        }
    };
    req.open("POST", "http://localhost:3000/addnew/" + x);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(newrecord));
}