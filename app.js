const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");
const sendmailWel = require('./WelcomeMail.js');
const sendmail = require("./send-mail.js");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));

app.use(express.json())

app.use(express.static("public"));

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '-' + mm + '-' + yyyy;

var results = [];
var centers = [];


// //Connection with DB
// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "vaccine"
// });
// connection.connect(function(err) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log("DB Connected");
//   }
// });



//Connection with AWS DB
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "donthack@3546",
  database: "vaccine"
});
connection.connect(function(err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("DB Connected");
  }
});


app.get("/", function(_req, res) {
  cleanDB();
  res.render("index");
});


app.get("/unsubscribe", function(_req, res){
  cleanDB();
  res.render('unsubscribe');
});

app.get("/alreadyunsub", function(_req, res){
  cleanDB();
  res.render('alreadyunsub');
});


app.post("/", function(req, res) {
  const email = req.body.email;
  const age_limit = req.body.age;
  const state = req.body.state;
  const district = req.body.district;

  if (email != "" && state != 0 && district != 0){
    var query = "SELECT email_id from data WHERE email_id = '" + email + "'";
    connection.query(query, function(err, rows, _fields){
      if (err) {
        console.log(err);
      }
      else{
        if (rows.length == 0) {
          var sql_main = "INSERT INTO data (age_limit, email_id, state, district) VALUES ('" + age_limit + "','" + email + "','" + state + "','" + district + "' )";
          connection.query(sql_main, function(err1, _rows, _fields1) {
            if (err1) {
              console.log(err1);
            }
            else {
              var query3 = "SELECT email_id from unsub WHERE email_id = '" + email + "'";
              connection.query(query3, function(err3, unsubemails, _fields2){
                if (err3) {
                  console.log(err3);
                }
                else{
                  var query4 = "DELETE FROM unsub WHERE email_id = '" + email + "' ";
                  connection.query(query4, function(err2, _values, _fields3){
                    if (err2) {
                      console.log(err2);
                    }
                    else {
                      sendmailWel(email);
                      console.log("New User Added!!!");
                      res.render("thankyou");
                    }
                  });
                }
              });
            }
          });
        }
        else{
          res.render('alreadyreg');
        }
      }
    });
  }
  else{
    res.render('index');
  }

  var sql_district = "INSERT INTO districts_data (districts) VALUES ('" + district + "')";
  var check_district = "SELECT * FROM districts_data WHERE districts = '" + district + "'";
  connection.query(check_district, function(err4, result, _fields4) {
    if (err4) {
      console.log(err4);
    }
    else {
      if (result.length == 0) {
        connection.query(sql_district, function(err5, _result, _fields5) {
          if (err5) {
            console.log(err5);
          }
          else {
            console.log("District Added");
          }
        });
      }
    }
  });

  cleanDB();
});



app.post("/acceptEmail", function(req, res) {
  if(req.body.testTOKEN == 'yesy'){
    centers = [];
    var vacc_data = req.body;
    var age = vacc_data.age_limit;
    var dist_num = vacc_data.dist_num;
    var incomingCenters = vacc_data.centers;
    // console.log(incomingCenters);
    connection.query("SELECT email_id FROM data WHERE district = '" + dist_num + "' AND age_limit = '" + age + "' ", function(err, email_result, _fields) {
      if (err) {
        console.log(err);
      }
      else {
          for (j = 0; j < incomingCenters.length; j++) {
            if (j == 5) {
              const center_data = {
                name: "Not a center",
                available: incomingCenters.length - 5,
                fee: 0,
                vacc_name: 0,
                age_limit: 0
              }
              centers.push(center_data);
              break;
            }
            else {
              const center_data = {
                name: incomingCenters[j].name,
                available: incomingCenters[j].available_capacity,
                fee: incomingCenters[j].fee_type,
                vacc_name: incomingCenters[j].vaccine,
                age_limit: incomingCenters[j].min_age_limit
              }
              centers.push(center_data);
            }
          }

          for (i = 0; i < email_result.length; i++) {
            sendmail(email_result[i].email_id, centers);
          }
      }
    });
    res.send("received");
  }
  else{
    console.log('request from unauthorized ip');
    res.status(403).send("You do not have rights to access this page");
  }

  cleanDB();
});



app.post("/unsubscribe", function(req, res) {
  var unsubemail = req.body.email

  connection.query("SELECT email_id FROM unsub WHERE email_id = '" + unsubemail + "' ", function(err, alreadyunsub, field) {
    if (err) {
      console.log(err);
    }
    else{
      console.log(alreadyunsub.length);
      if (alreadyunsub.length != 1) {

        connection.query("SELECT * FROM data WHERE email_id = '" + unsubemail + "' ", function(err, unsubresult, _fields){
          if (err) {
            console.log(err);
          }
          else{
              var query1 = "INSERT INTO unsub (age_limit, email_id, state, district) VALUES ('" + unsubresult[0].age_limit + "','" + unsubresult[0].email_id + "','" + unsubresult[0].state + "','" + unsubresult[0].district + "' )";
              connection.query(query1, function(err1, _fields1){
              if (err1) {
                console.log(err1);
              }
              else{
                var query4 = "SELECT district FROM data WHERE district = '" + unsubresult[0].district + "' ";
                connection.query(query4, function(err3, result, _fields2){
                  if(err3){
                    console.log(err3);
                  }
                  else{
                    if(result.length == 1){
                      var query7 = "DELETE FROM districts_data WHERE districts = '" + result[0].district + "' ";
                      connection.query(query7, function(err5, _fields3){
                        if (err5) {
                          console.log(err5);
                        }
                        else{
                          console.log("District Removed");
                        }
                      });
                    }
                    var query2 = "DELETE FROM data WHERE email_id = '" + unsubemail + "' ";
                    connection.query(query2, function(err2, _fields4){
                      if (err2) {
                        console.log(err2);
                      } else {
                        console.log("Email Deleted");
                      }
                    });
                  }
                });
              }
            });

          }
        });
        res.redirect("/");
      } else {
        res.redirect("/alreadyunsub");
      }
    }
  })

  cleanDB();
});



app.get("/districts", function(_req, res) {
  cleanDB();
  connection.query('SELECT districts FROM districts_data', function(err, result, _fields) {
    if (err) {
      console.log(err);
    }
    else {
      if (result.length !== 0) {
        results = [];
        for (var i = 0; i < result.length; i++) {
          results.push(parseInt(result[i].districts));
        }
        res.send(results)
      }
    }
  });
});

function cleanDB(){
  var maindataq = "SELECT * FROM data";
  var mainunsubq = "SELECT * FROM unsub";
  var maindisq = "SELECT * FROM districts_data";


  connection.query(maindataq, function(err1, results1, field){
    if (err1) {
      console.log(err1);
    }
    else{
      for(var i = 0; i < results1.length; i++){
        if (results1[i].email_id == ('undefined' || "" || undefined || null)) {
          var delq = "DELETE from data where id = '" + results1[i].id + "'";
          connection.query(delq, function(err2, fields) {
            if (err2) {
              console.log(err2);
            }
          });
        }
      }
    }
  });


  connection.query(mainunsubq, function(err3, results2, field){
    if (err3) {
      console.log(err3);
    }
    else{
      for(var i = 0; i < results2.length; i++){
        if (results2[i].email_id == ('undefined' || "" || undefined || null)) {
          var delq = "DELETE from unsub where id = '" + results2[i].id + "'";
          connection.query(delq, function(err4, fields) {
            if (err4) {
              console.log(err4);
            }
          });
        }
      }
    }
  });


  connection.query(maindisq, function(err5, results3, field){
    if (err5) {
      console.log(err5);
    }
    else{
      for(var i = 0; i < results3.length; i++){
        if (results3[i].districts == ('undefined' || "" || undefined || null || 0)) {
          var delq = "DELETE from data where id = '" + results3[i].id + "'";
          connection.query(delq, function(err6, fields) {
            if (err6) {
              console.log(err6);
            }
          });
        }
      }
    }
  });

}

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log(`Server running on port ${PORT}`);
});

app.use(function(req, res, next) {
  res.status(404).render("404");
});
