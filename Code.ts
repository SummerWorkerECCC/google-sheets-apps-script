/**
 * Checks if content sheet is there
 * 
 * @return {Spreadsheet}  content spreadsheet
 * 
 */
const validateSheets = async () => {
    const ui = SpreadsheetApp.getUi();
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const content = spreadsheet.getSheetByName('Content');

    if (!content) {
        const err = 'Missing Content spreadsheet. Please make sure you have a spreadsheet called \'Content\'';
        throw new Error(err)
    }

    return content
}

/**
 * Validate Headers. We make sure there are no empty cells
 * 
 * @param {Object[]} The headers (first row)
 * @return {Object[]} Validated headers
 * 
 */
const validateHeaders = async (headers) => {
    // empty cells are represented by an empty string
    const newHeaders = headers.filter((value) => value !== '')
    if (newHeaders.length === headers.length) {
        return newHeaders
    } else {
        throw new Error('Headers either has a blank cell or is weird')
    }
}

/**
 * Validate data. We also make sure there are no empty rows.
 * 
 * @param {Object[][]} The data
 * @return {Object[][]} Validated data
 * 
 */
const validateData = async (data) => {
    // empty cells are represented by an empty string
    for (let row of data) {
        for (let cell of row) {
            if (cell === '') {
                // empty cell. ABORT!
                throw new Error('Blank cell detected in the data! Please do not include blank cells')
            }
        }
    }

    return data
}

/**
 * Send a post request to Deta
 * 
 * @param {Payload} The data
 * @return {HTTPResponse} The response
 * 
 */
const postToDeta = (payload) => {
    const url = 'https://q77r6a.deta.dev/upload';
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        payload: JSON.stringify(payload)
    };
    const response = UrlFetchApp.fetch(url, options);
    return response.getContentText()
}

/**
 * Uploads code to deta
 * 
 * @return {null} we hope it works
 * 
 */
const uploadToDeta = async () => {
    const ui = SpreadsheetApp.getUi();

    try {
        const contentSheet = await validateSheets();
        const dataRange = contentSheet.getDataRange();
        const values = dataRange.getValues();

        const [rawHeaders, ...rawData] = values;
        const headers = await validateHeaders(rawHeaders)
        const data = await validateData(rawData)

        const payload = {
            id: SpreadsheetApp.getActiveSpreadsheet().getId(),
            columnNames: headers,
            size: { cols: headers.length, rows: data.length },
            rows: data
        }
        Logger.log('Payload!' + JSON.stringify(payload))

        const response = postToDeta(payload)
        Logger.log('Response!' + JSON.stringify(response))

        ui.alert('Deployment Success!', 'Data is now updated on the cloud!', ui.ButtonSet.OK);

    } catch (e) {
        Logger.log('Error!' + JSON.stringify(e))
        ui.alert(e);
    }
}

/**
 * Runs when the button is pressed
 * 
 * @return {null} we hope it works
 * 
 */
const reactToButton = async () => {
    var ui = SpreadsheetApp.getUi(); // Same variations.

    var result = ui.alert(
        'Confirm Upload Data',
        'Confirm that you want to upload/update the data to the cloud.',
        ui.ButtonSet.YES_NO);

    // Process the user's response.
    if (result == ui.Button.YES) {
        // User clicked "Yes".
        await uploadToDeta()
    }
}

