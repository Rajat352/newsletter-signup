const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { write } = require("fs");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const audienceKey = `${process.env.AUDIENCE_KEY}`;
  const apiKey = `${process.env.API_KEY}`;

  const url = `https://us12.api.mailchimp.com/3.0/lists/${audienceKey}`;
  const options = {
    method: "POST",
    auth: `rajat1:${apiKey}`,
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else res.sendFile(__dirname + "/faliure.html");

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/faliure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is up and running....");
});
