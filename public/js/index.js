window.onload = function stateDropDownList() {
     var jsondata1 = [
        {"state_id":0,"state_name":"Select State/Province"},
        {"state_id":1,"state_name":"Andaman and Nicobar Islands"},
        {"state_id":2,"state_name":"Andhra Pradesh"},
        {"state_id":3,"state_name":"Arunachal Pradesh"},
        {"state_id":4,"state_name":"Assam"},
        {"state_id":5,"state_name":"Bihar"},
        {"state_id":6,"state_name":"Chandigarh"},
        {"state_id":7,"state_name":"Chhattisgarh"},
        {"state_id":8,"state_name":"Dadra and Nagar Haveli"},
        {"state_id":37,"state_name":"Daman and Diu"},
        {"state_id":9,"state_name":"Delhi"},
        {"state_id":10,"state_name":"Goa"},
        {"state_id":11,"state_name":"Gujarat"},
        {"state_id":12,"state_name":"Haryana"},
        {"state_id":13,"state_name":"Himachal Pradesh"},
        {"state_id":14,"state_name":"Jammu and Kashmir"},
        {"state_id":15,"state_name":"Jharkhand"},
        {"state_id":16,"state_name":"Karnataka"},
        {"state_id":17,"state_name":"Kerala"},
        {"state_id":18,"state_name":"Ladakh"},
        {"state_id":19,"state_name":"Lakshadweep"},
        {"state_id":20,"state_name":"Madhya Pradesh"},
        {"state_id":21,"state_name":"Maharashtra"},
        {"state_id":22,"state_name":"Manipur"},
        {"state_id":23,"state_name":"Meghalaya"},
        {"state_id":24,"state_name":"Mizoram"},
        {"state_id":25,"state_name":"Nagaland"},
        {"state_id":26,"state_name":"Odisha"},
        {"state_id":27,"state_name":"Puducherry"},
        {"state_id":28,"state_name":"Punjab"},
        {"state_id":29,"state_name":"Rajasthan"},
        {"state_id":30,"state_name":"Sikkim"},
        {"state_id":31,"state_name":"Tamil Nadu"},
        {"state_id":32,"state_name":"Telangana"},
        {"state_id":33,"state_name":"Tripura"},
        {"state_id":34,"state_name":"Uttar Pradesh"},
        {"state_id":35,"state_name":"Uttarakhand"},
        {"state_id":36,"state_name":"West Bengal"}
    ];
     var ddlCustomers = document.getElementById("state-dropdown");
     for (var i = 0; i < jsondata1.length; i++) {
         var option = document.createElement("option");
         option.innerHTML = jsondata1[i].state_name;
         option.value = jsondata1[i].state_id;
         ddlCustomers.options.add(option);
    }
}

function stateChanged(states)
{
    var dropdown = document.getElementById("district-dropdown");
    var jsondata = [];
    let dis_url = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + states.toString();
    dropdown.innerHTML = null;
    const Http = new XMLHttpRequest();
    Http.open("GET", dis_url);
    Http.send();
    var flag = 0;
    Http.onreadystatechange = (e) => {
        jsondata = JSON.parse(Http.responseText);
        if(flag === 0){
            var option0 = document.createElement("option");
            option0.innerHTML = "Select District";
            option0.value = 0;
            dropdown.options.add(option0);
            for (var i = 0; i < jsondata.districts.length; i++) {
                flag = 1;
                var option = document.createElement("option");
                option.innerHTML = jsondata.districts[i].district_name;
                option.value = jsondata.districts[i].district_id;
                dropdown.options.add(option);
           }
        }
    }
}


function onSubmit(token) {
var emailpattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if($("#inputEmail3").val() == "") {
       $(".alert").html("Please Enter Email");
       alerting();
 	}

  else {
    if(emailpattern.test($("#inputEmail3").val()) == false)
    	{
        $(".alert").html("Please Enter Correct Email");
        alerting();
      }
    else{
      if($("#state-dropdown").val() == 0) {
        $(".alert").html("Please Enter State");
        alerting();
      }
      else{
        if($("#district-dropdown").val() == 0){
          $(".alert").html("Please Enter District");
          alerting();
        }
        else{
          document.getElementById("form-submit").submit();
        }
      }
    }
  }
}



function alerting() {
 $(".alert").addClass("d-flex");
 $(".alert").removeClass("d-none");
 $(".alert").addClass("come-down");
}