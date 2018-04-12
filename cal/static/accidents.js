function newAccident() {
    var token = localStorage.getItem('token');
    var url = "http://localhost:8000/accidents/";
    var xhr = new XMLHttpRequest();
    var descriptionElement = document.getElementById('new_description');
    var dateElement = document.getElementById('new_date');
    var timeElement = document.getElementById('new_time');
    var injuredElement = document.getElementById('new_injured');
    var killedElement = document.getElementById('new_killed');
    var violationElement = document.getElementById('new_violation');
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        console.log(data);
        if (this.status === 201) {
            window.editAccidentId = data["id"];
            window.times = 3;
            load_all();
            document.getElementById('form_new_accident').reset();
        } else {
            alert("Please, fill in all accident details. Only comments are not required.")
        }
    });
    var sendObject = JSON.stringify({
        description: descriptionElement.value,
        date: dateElement.value,
        time: timeElement.value,
        injured: injuredElement.value,
        killed: killedElement.value,
        violation_code: violationElement.value
    });
    console.log("Sending", sendObject);
    xhr.send(sendObject);
}

function openEditForm(data) {
    var token = localStorage.getItem('token');
    var url = "http://localhost:8000/accidents/"
    var xhr = new XMLHttpRequest();
    var modalHeader = document.getElementById('edit_modal_header');
    modalHeader.innerHTML = "Edit " + data["destination"];
    window.editAccidentId = data["id"];
    $('#edit_destination').val(data["destination"]);
    $('#edit_start_date').val(data["start_date"]);
    $('#edit_end_date').val(data["end_date"]);
    $('#edit_comment').val(data["comment"]);
    $('#editModalForm').modal('show');
}

function saveChanges() {
    var accidentId = window.editAccidentId.toString();
    $('#editModalForm').modal('hide');
    var editDestionation = $('#edit_destination').val();
    var editComment = $('#edit_comment').val();
    var editStartDate = $('#edit_start_date').val();
    var editEndDate = $('#edit_end_date').val();

    var token = localStorage.getItem('token');
    var url = "http://localhost:8000/accidents/" + accidentId + "/";
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function () {
        load_all();
    });
    var sendObject = JSON.stringify({
        destination: editDestionation,
        start_date: editStartDate,
        end_date: editEndDate,
        comment: editComment
    });
    console.log("Sending", sendObject);
    xhr.send(sendObject);
}


function getAccidents() {
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('username');
    var url = "http://localhost:8000/accidents/";
    var filter = "";
    var searchFilter = $('#filter_text').val();
    if (searchFilter != "") {
        filter = "?search=" + searchFilter;
    }
    var fromFilter = $('#filter_from').val();
    if (fromFilter != "") {
        if (filter != "")
            filter += "&";
        else
            filter = "?";
        filter += "from=" + fromFilter;
    }
    var toFilter = $('#filter_to').val();
    if (toFilter != "") {
        if (filter != "")
            filter += "&";
        else
            filter = "?";
        filter += "till=" + toFilter;
    }
    url += filter;
    var xhr = new XMLHttpRequest();
    var resultElement = document.getElementById('result');
    xhr.open('GET', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        console.log(data);
        if (this.status == 401) {
            document.getElementById("login_button").style.visibility = "visible";
            document.getElementById("logout_button").style.visibility = "hidden";
            resultElement.innerHTML = "No credentials provided";
        } else {
            document.getElementById("login_button").style.visibility = "hidden";
            document.getElementById("logout_button").style.visibility = "visible";
            document.getElementById("logout_button").textContent = "Logout " + user;

            var tableHeader = '<table class="table">';
            tableHeader += "<thead><tr>" +
                "<th>Date</th>" +
                "<th>Time</th>" +
                "<th>Description</th>" +
                "<th>Injured</th>" +
                "<th>Killed</th>" +
                "<th>Alcohol</th>" +
                "<th>Violation</th>";
            tableHeader += "</tr></thead>";

            var r = new Array(), j = -1;
            for (var key = 0, size = data.length; key < size; key++) {
                console.log(data[key]["destination"])
                if (data[key]["id"] == window.editAccidentId)
                    r[++j] = '<tr class="changed">';
                else
                    r[++j] = '<tr>';
                r[++j] = '<td>' + data[key]["date"] + "</td>";
                r[++j] = '<td>' + data[key]["time"] + "</td>";
                r[++j] = '<td>' + data[key]["description"].replace(/<(?:.|\n)*?>/gm, '') + "</td>";
                r[++j] = '<td>' + data[key]["injured"] + "</td>";
                r[++j] = '<td>' + data[key]["killed"] + "</td>";
                r[++j] = '<td>' + data[key]["alcohol"] + "</td>";
                r[++j] = '<td>' + data[key]["violation_code"] + "</td>";
                // r[++j] = '<td><a href="#" onclick="editAccident(' + data[key]["id"] + ')">Edit 🖉</a> ' +
                //     ' <a href="#" onclick="deleteAccident(' + data[key]["id"] + ", '" + data[key]["destination"] + "'" + ')">Delete ✘</a> </td>';
                r[++j] = '</tr>';
            }
            resultElement.innerHTML = tableHeader + r.join('') + "</table>";
            window.times -= 1;
            // if (window.times <= 0)
            //     window.editAccidentId = "-1";
        }
    });
    xhr.send(null);
}
