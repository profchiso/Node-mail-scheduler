require("dotenv").config();
const express = require("express");
const mailer = require("nodemailer");
const scheduler = require("node-cron");
const uuid = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

let dateArr = [];
const data = [];
let today = `${new Date().getFullYear()}-${new Date().getMonth() +
  1}-${new Date().getDate()}`;

for (let i = 0; i < 10; i++) {
  let date = `${new Date().getFullYear() - i}-${new Date().getMonth() +
    1 +
    i}-${new Date().getDate() - i}`;
  let oneDate = {
    data: {
      date: date,
      status: `${i % 2 === 0 ? "failed" : "success"}`,
      id: `${i + 1}`
    },
    id: uuid(),
    user: {
      name: `${i}name`,
      email: `${i}email`,
      avatar: `${i}avatar`,
      address: `${i}addess`
    }
  };

  dateArr.push(date);
  data.push(oneDate);
}
let numFailed = data.filter(job => {
  return job.data.status === "failed";
}).length;
let mailOptions = {
  from: "sender email",
  to: "receiver email<can be seperated by comma for multiple emails>",
  subject: "Testing Nodemailer and node-cron for scheduling emailing",
  text: `Today ${today}, ${numFailed}  ${
    numFailed > 1 ? "records" : "record"
  } failed to migrate to DPR`
};
let transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: "sender email",
    pass: "email pass"
  }
});

scheduler.schedule(" * * * * *", () => {
  console.log("run schedule every 1 munite");
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
