$(document).ready(function() {
  $("#formSubmit").click(function(e) {
    e.preventDefault();
    var fname = $("#firstName")[0].value;
    var lname = $("#lastName")[0].value;
    $("#myName").innerHTML = "";
    var output = "";
    if(fname == "" || lname == "") {
      output = "<span>Please enter your first and last name</span>";
    }
    else {
      output = "<span class='blue'>My name is " + fname + " " + lname + "</span>";
    }
    $("#myName").html(output);
  });
  
  $("#serverSubmit").click(function(e) {
    e.preventDefault();
    $.ajax({
    url: '/getName',
    success: function(result) {
      var output = "<span>" + result + "</span>";
      $("#serverResult").html(output);                    
    },
    error: function(result) {
      var output = "<span>Server error</span>";
      $("#serverResult").append(output);
    }});
  });
});

function login() {
  $.ajax({
    url: '/login',
    data: {
      username: $("#username")[0].value,
      password: $("#password")[0].value
    },
    success: function(result) {
      $("#modal").modal('hide');
      $("#error").hide();
      $("#logInMessage").show();
    },
    error: function(result) {
      $("#error").show();
      $("#logInMessage").hide();
    }
  });
}