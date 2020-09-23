const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");

const app = express();

const port = process.env.PORT;
const portLocal = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, res) => {
  const firstName = req.body.inputFirstName;
  const lastName = req.body.inputLastName;
  const emailAddress = req.body.inputEmail;

  let data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const userName = "BolingD";
  const apiKey = "f94c36367da4743a374ce1a567ca7001-us2";
  const listId = "ca9d5cc47d";
  const serverNumber = 2;
  const url = `https://us${serverNumber}.api.mailchimp.com/3.0/lists/${listId}`;
  const options = {
    method: "POST",
    auth: `${userName}:${apiKey}`
  };
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
      let result = (JSON.parse(data).error_count === 0) ? "success" : "failure";
      res.sendFile(`${__dirname}/${result}.html`);
    })
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
})

app.listen(port || portLocal, () => {
  console.log(`Server is running on port ${port}.`);
});
