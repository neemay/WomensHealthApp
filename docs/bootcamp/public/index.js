$(document).ready(function() {
  $("#formSubmit").click(function(e) {
    e.preventDefault();
    $("#myName").innerHTML = "";
    var output = "<span class='blue'>My name is " + $("#firstName")[0].value + " " + $("#lastName")[0].value + "</span>";
    
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