# Google Sheets Apps Scripts

This holds the code for the Google Sheets apps scripts that is responsible for uploading the cells in a spreadsheet to the Deta database.

## Note:

This repo uses a [daikikatsuragawa/clasp-action](https://github.com/daikikatsuragawa/clasp-action) to push the code to the Google Apps Script codebase, but because of a [bug in v2.4.0 of Google Clasp](https://github.com/google/clasp/issues/856#issuecomment-882016152), I had to use v2.3.2 to get everything working. This is why I am currently using a forked version of the codebase, [joshuanianji/clasp-action@test](https://github.com/joshuanianji/clasp-action/tree/downgrade-google-clasp).
