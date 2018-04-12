var editMealId;
var times = 0;

function getToken() {
    var loginUrl = "http://localhost:8000/auth-web/"
    var xhr = new XMLHttpRequest();
    var userElement = document.getElementById('username');
    var passwordElement = document.getElementById('password');
    var resultElement = document.getElementById('result');
    var errorElement = document.getElementById('login-error-div');
    var user = userElement.value;
    var password = passwordElement.value;
    errorElement.innerHTML = "";
    var response = grecaptcha.getResponse();
    grecaptcha.reset();
    // if(response.length > 0)
    //     alert(response);
    // else
    //     alert("Not verified");
    xhr.open('POST', loginUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function () {
        var responseObject = JSON.parse(this.response);
        console.log(responseObject);
        if (responseObject.token) {
            localStorage.setItem('token', responseObject.token);
            localStorage.setItem('username', user);
            load_all();
            $('#myModal').modal('hide');
            return (true);
        } else {
            if (responseObject.non_field_errors) {
                errorElement.innerHTML = responseObject.non_field_errors;
                if (responseObject.non_field_errors.toString().indexOf("not verified") > 0)
                    errorElement.innerHTML = responseObject.non_field_errors + "<br><a href='#' onclick='send_verification_code(" + '"' + user + '"' + ")'>Send verification code</a>";
            }

            return (false);
        }
    });

    var sendObject = JSON.stringify({username: user, password: password, captcha: response});

    console.log('going to send', sendObject);

    xhr.send(sendObject);
}

function send_verification_code(username) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/users/" + username + "/send_verification_code", true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function () {
        var responseObject = JSON.parse(this.response);
        alert(responseObject.detail);
    });

    var sendObject = JSON.stringify({username: username});

    //console.log('going to send', sendObject);

    xhr.send(sendObject);
}

function logout() {
    localStorage.setItem('token', "");
    load_all();
}

function load_all() {
    getAccidents();
}
function onLoad() {
    $("#form_new_accident").submit(function (event) {
        event.preventDefault();
        newAccident(event);
    });
    $("#edit_meal_form").submit(function (event) {
        saveChanges();
        event.preventDefault();
    });
    $("#filter_form").submit(function (event) {
        load_all();
        event.preventDefault();
    });
    load_all();
}
function loginFromModal(e) {
    if (getToken() == true)
        $('#myModal').modal('hide');
}
function registerFromModal(e) {
    register();
    event.preventDefault();
}

