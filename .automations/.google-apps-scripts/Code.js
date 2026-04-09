function getConfig() {
  const config = {
    /*************************************************************************/
    /***************************** BEGIN SETTINGS ****************************/
    /*************************************************************************/
    courseTitle: SpreadsheetApp.getActiveSheet().getSheetName(), // title of spreadsheet
    headingRow: 3, // the row number with the main column headings, starting from 1
    sendHtml: true, // whether to send email including HTML or plain text
    debug_mode: false, // change to false in order to go live
    debug_mode_recipient: Session.getActiveUser().getEmail(), // used when in debug mode... send to self
    // settings for weekly emails:
    PAUSE_BETWEEN_EMAILS: 200, // milleseconds delay between sending each email
    EMAIL_DAYS: [ScriptApp.WeekDay.TUESDAY, ScriptApp.WeekDay.THURSDAY],
    EMAIL_HOUR: 6,
    EMAIL_TEMPLATE_DOC_URL:
      "https://docs.google.com/document/d/1OS3FrzzXYd7jbTxjexG_bL3UujzijPXF6pmBsW34Y6w/edit?tab=t.0",
    EMAIL_REPLY_TO: "no-reply@knowledge.kitchen", // if recipient hits reply to email
    /*************************************************************************/
    /****************************** END SETTINGS *****************************/
    /*************************************************************************/
  };
  return config;
}

function doGet(e) {
  /**
   * Handle web app get request... shoot off grading email to student based on their email address.
   */
  // get the sheet name with the charts from the query string
  const config = getConfig();
  // we expect a `email` query string in the request
  if (e.parameter["email"]) {
    const email = decodeURIComponent(e.parameter["email"]);
    Logger.log(`GET request to send grades to email ${email}`);
    const rowNum = getRowNumByEmail(email);
    if (rowNum) SEND_ONE_ROW_NOW(config.debug_mode, rowNum); // send it!
  }
}

function getRowNumByEmail(email = promptUserForEmail()) {
  /**
   * Get a row number by the student's email address.
   */
  const config = getConfig();
  // grab the relevant row from the active spreadsheet
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  const headings = values[config.headingRow - 1]; // extract the column headings
  const emailIndex = headings.indexOf("Email");
  // iterate through all rows
  for (let i = 0; i < values.length; i++) {
    const row = values[i]; // array indices start from 0, while sheet rows start from 1
    if (row[emailIndex] == email) {
      const rowNum = i + 1; // increment by 1 since spreadsheet row numbers are one more than array indices.
      Logger.log(`Found email ${email} at row ${rowNum}!`);
      return rowNum; // found it!  exit.
    }
  }
  Logger.log(`Could not find email ${email}`);
  return false; // failed to find email
}

function promptUserForRowNum() {
  /**
   * Prompts the UI for the user to enter the row number of interest.
   */
  const ui = SpreadsheetApp.getUi();
  //Call the HTML file and set the width and height
  const response = ui.prompt(
    "Row to send",
    "Please enter the row number of the grades to send",
    ui.ButtonSet.OK_CANCEL,
  );
  const rowNum = response.getResponseText();
  return rowNum;
}

function promptUserForEmail() {
  /**
   * Prompts the UI for the user to enter the email address interest.
   */
  const ui = SpreadsheetApp.getUi();
  //Call the HTML file and set the width and height
  const response = ui.prompt(
    "Email address",
    "Please enter the email address for the user whose grades to send",
    ui.ButtonSet.OK_CANCEL,
  );
  const email = response.getResponseText();
  return email;
}

function DEBUG_SEND_ONE_ROW_NOW() {
  /**
   * Sends one row
   */
  SEND_ONE_ROW_NOW(true); // debug mode
}

function DEBUG_SEND_ONE_ROW_NOW_BY_EMAIL() {
  SEND_ONE_ROW_NOW_BY_EMAIL((debug_mode = true), (rowNum = getRowNumByEmail()));
}

function SEND_ONE_ROW_NOW_BY_EMAIL(
  debug_mode = getConfig().debug_mode,
  rowNum = getRowNumByEmail(),
) {
  if (rowNum) {
    SEND_ONE_ROW_NOW(debug_mode, rowNum);
  } else {
    Logger.log(`No row number specified... aborting.`);
  }
}

// send just one student's grades
function SEND_ONE_ROW_NOW(
  debug_mode = getConfig().debug_mode,
  rowNum = promptUserForRowNum(),
) {
  const config = getConfig();
  // const ui = SpreadsheetApp.getUi();

  // debugging
  Logger.log(`Got the row ${rowNum}`);

  if (rowNum) {
    // debugging
    Logger.log("got a response");

    // grab the relevant row from the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    const values = sheet.getDataRange().getValues();
    const headings = values[config.headingRow - 1]; // extract the column headings

    // loop through and send only the row we want
    for (let i = 1; i < values.length; i++) {
      if (i == parseInt(rowNum)) {
        Logger.log("sending row " + (i - 1));
        const row = values[i - 1]; // array indices start from 0, while sheet rows start from 1
        const rows = [headings, row]; // package up headings and single row
        sendGrades(rows, debug_mode); // send an email
        break; // no need to keep iterating
      }
    }
  } // if rowNum
}

function SEND_ALL_GRADES_NOW(e = null, debug_mode = getConfig().debug_mode) {
  /**
   * Send all students' grades right now!
   * @param e Event object passed automatically when function called automatically by time-based trigger
   * @param debug_mode Whether to run in debug mode and send email to the developer not the student
   */
  const config = getConfig();
  Logger.log("Sending all grades...");

  const sheet = SpreadsheetApp.getActiveSheet();
  let rows = sheet.getDataRange().getValues();
  rows = rows.slice(config.headingRow - 1); // remove rows above heading
  sendGrades(rows, debug_mode); // send 'em all
}

// send grades to all rows passed as argument
function sendGrades(rows, debug_mode = getConfig().debug_mode) {
  const config = getConfig();
  const template = getMessageTemplate(config.EMAIL_TEMPLATE_DOC_URL);

  // alert if in debug mode
  Logger.log(`DEBUG MODE: ${JSON.stringify(debug_mode, null, 2)}`);

  const columnNames = rows[0]; //indexes start from 0, while row numbers start from 1 -> row[0] is usually the headings

  // if (debug_mode) {
  // const ui = SpreadsheetApp.getUi();
  // ui.alert('You are currently in DEBUG MODE... all emails will be sent to yourself, not to the students.');
  // console.log(`COLUMNS: ${columnNames}`);
  // console.log(`ROWS: ${rows.length}`);
  // }

  for (var i = 1; i < rows.length; i++) {
    // changing i = config.headingRow to i = 1
    var row = rows[i];
    var data = extractData(columnNames, row); //get this row of data as an associative array with lowercase keys

    // ignore rows that have a Status field set to "dropped" or "incomplete"
    if ("status" in data && data["status"] != "enrolled") {
      console.log(`Skipping ${data["email"]} due to status ${data["status"]}`);
      continue; //skip this row
    }

    //only send emails if we have an email address!
    if (data["email"]) {
      // Logger.log(`EMAIL: ${data['email']}`);

      // determine recipient
      let to = debug_mode ? config.debug_mode_recipient : data["email"]; //send to debugging email address when in debug mode
      let subject = config.courseTitle + " :: Grades"; //prepend course name to subject

      //SEND EMAIL!
      // set up email options
      // let options = {
      //   replyTo: config.replyTo
      // }

      // if (config.sendHtml) {
      //   // add html email content
      //   options.htmlBody = message
      // }
      // else {
      //   // strip any html from message, if html not desired
      //   const regex = /(<([^>]+)>)/ig
      //   const message = message.replace(regex, "");
      // }

      try {
        let message = createMessageFromTemplate(data["email"], data, template);
        // Logger.log(`MESSAGE: ${message}`)
        MailApp.sendEmail({
          to: to,
          replyTo: config.EMAIL_REPLY_TO,
          subject: subject,
          htmlBody: message,
        });
      } catch (err) {
        Logger.log(`Failed to send email to ${to}: ${err}`);
      }
    } //endif data
    else {
      // there was no email...
      Logger.log(`NO EMAIL: ${data}`);
    }

    // pause for a few seconds before moving on to next
    Utilities.sleep(config.PAUSE_BETWEEN_EMAILS); // pause in the loop to not anger the Google spamlords
  } //endfor
}

/**
 * Returns an associative array from one row of data.  Keys are the column names.
 **/
function extractData(columnNames, row) {
  let data = new Array();

  for (var i = 0; i < columnNames.length; i++) {
    let columnName = columnNames[i] + "";
    columnName = columnName.toLowerCase();
    try {
      data[columnName] = row[i];
    } catch (err) {}
  }

  return data;
}

/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the readRows() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let entries = [
    {
      name: "Send all grades!!!",
      functionName: "SEND_ALL_GRADES_NOW",
    },
    {
      name: "Send one student their grades by row number",
      functionName: "SEND_ONE_ROW_NOW",
    },
    {
      name: "Send one student their grades by email address",
      functionName: "SEND_ONE_ROW_NOW_BY_EMAIL",
    },
    null,
    {
      name: "DEBUGGING: send sample email to myself",
      functionName: "DEBUG_SEND_ONE_ROW_NOW",
    },
    null,
    {
      name: "Set up weekly emails",
      functionName: "createWeeklyTrigger",
    },
    {
      name: "Cancel weekly emails",
      functionName: "cancelWeeklyTrigger",
    },
  ];

  spreadsheet.addMenu("Grading", entries);
}

/**
 * Returns any time-based triggers
 */
function getTimeBasedTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  const timeBasedTriggers = [];
  for (var i = 0; i < triggers.length; i++) {
    const type = triggers[i].getEventType();
    if (type == ScriptApp.EventType.CLOCK) {
      timeBasedTriggers.push(triggers[i]); // add to list
    }
  }
  return timeBasedTriggers;
}

/**
 * Creates a weekly trigger to send all grades.
 * @see https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers
 */
function createWeeklyTrigger() {
  const config = getConfig();

  // first remove any existing triggers
  cancelWeeklyTrigger();

  // Trigger every week on certain days at a specific time
  config.EMAIL_DAYS.forEach((day) => {
    ScriptApp.newTrigger("SEND_ALL_GRADES_NOW")
      .timeBased()
      .onWeekDay(day)
      .atHour(config.EMAIL_HOUR)
      .create();

    Logger.log(
      `Created time-based trigger for ${day} at ${config.EMAIL_HOUR}.`,
    );
  });
}

/**
 * Cancels weekly trigger to send all grades.
 * @see https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers
 */
function cancelWeeklyTrigger() {
  // Deletes all time-based triggers in the current project.
  var triggers = getTimeBasedTriggers();
  for (var i = 0; i < triggers.length; i++) {
    // delete any triggers that shoot out all grades
    if (triggers[i].getHandlerFunction() == "SEND_ALL_GRADES_NOW") {
      Logger.log("Deleted time-based trigger.");
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function getMessageTemplate(templateUrl) {
  // Make sure to update the emailTemplateDocId at the top.
  const docId = DocumentApp.openByUrl(templateUrl).getId();
  try {
    let template = docToHtml(docId);
    if (!template) {
      throw new Error("Message template is empty!", template);
    }
    return template;
  } catch (err) {
    throw err;
  }
}

/**
 * Creates email body and includes the links based on topic.
 *
 * @param {string} recipient - The recipient's email address.
 * @param {string[]} topics - List of topics to include in the email body.
 * @param {string} template - The template from which to create the message
 * @return {string} - The email body as an HTML string.
 */
function createMessageFromTemplate(email, data, template) {
  message = template;

  Logger.log(`Preparing email for ${email}.`);

  // inject respondent data into email template

  // inject the data into the email template
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\{\{${key}\}\}`, "gi");
    if (data[key] !== "" && data[key] !== undefined && data[key] !== null) {
      // Logger.log(`Has value - ${key}: ${data[key]}`)
      message = message.replace(regex, data[key]);
    } else {
      // if no data, replace with empty string
      // Logger.log(`No value - ${key}: ${data[key]}`)
      message = message.replace(regex, "");
    }
  });

  // remove any unused templated values from the message
  message = message.replace(/{{.*?}}/g, "N/A"); // lazy regex

  return message;
}

/**
 * Downloads a Google Doc as an HTML string.
 *
 * @param {string} docId - The ID of a Google Doc to fetch content from.
 * @return {string} The Google Doc rendered as an HTML string.
 */
function docToHtml(docId) {
  // Downloads a Google Doc as an HTML string.
  const url =
    "https://docs.google.com/feeds/download/documents/export/Export?id=" +
    docId +
    "&exportFormat=html";
  const param = {
    method: "get",
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    // muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
