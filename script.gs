/*
Edit these tokens to change Line group chat to be sent by LineNotify
*/
/* -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- */

// This section defines access tokens for Line Notify. You should replace these with your own tokens.
var BIRTHDAY_CHANNEL_ACCESS_TOKEN = ["____________________________"];
var TEST_BIRTHDAY_CHANNEL_ACCESS_TOKEN = ["____________________________"];

// This variable controls which google sheet that you're using, so change it to your current sheet.
var YOUR_SHEET_ID = "____________________________";
var YOUR_SHEET_NAME = "____________________________";

// This variable controls whether you're using the production or testing channel. Set it to `true` for testing and `false` for production.
var isTestEnvironment = true;

/* -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- */

// Define the API endpoint URL and spreadsheet details
var URL = "https://api.line.me/v2/bot/message/reply";
var SHEET_ID = YOUR_SHEET_ID;
var SHEET_NAME = YOUR_SHEET_NAME;
var SPREAD = SpreadsheetApp.getActiveSpreadsheet();
var SHEET = SPREAD.getSheets()[0];

// This function triggers the birthday notification process
async function triggerBirthdayNotification() {
  var tokens = isTestEnvironment ? TEST_BIRTHDAY_CHANNEL_ACCESS_TOKEN : BIRTHDAY_CHANNEL_ACCESS_TOKEN;
  var spreadSheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadSheet.getSheetByName(SHEET_NAME);
  var row = sheet.getLastRow();

  var currentDate = Utilities.formatDate(new Date(), "GMT+7", "dd/MM");

  for (i = 2; i <= row; i++) {
    if (!sheet.getRange(i, 1).getValue()) continue;

    var birthday = Utilities.formatDate(sheet.getRange(i, 1).getValue(), "GMT+7", "dd/MM");

    if (currentDate == birthday) {
      console.log(sheet.getRange(i, 1).getValue(), sheet.getRange(i, 4).getValue())

      // Extract the person's details from the sheet
      var firstname = sheet.getRange(i, 2).getValue();
      var lastname = sheet.getRange(i, 3).getValue();
      var nickname = sheet.getRange(i, 4).getValue();

      // Create the birthday message
      var message = `ข่าวดี 📢\nวันนี้เป็นวันเกิดของ\n${nickname} (${firstname} ${lastname}) 🍰\nเกิดในวันที่ ${birthday}\n🎉🎂🎀💗🥳`;

      for (const token of tokens) {
        await sendLineNotify(message, token);
      }
    }
  }
}

// This function sends a notification to Line Notify using the provided message and access token (ignore this function)
async function sendLineNotify(message, token) {
  var options = {
    method: "post",
    payload: {
      message: message,
    },
    headers: { Authorization: "Bearer " + token },
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}