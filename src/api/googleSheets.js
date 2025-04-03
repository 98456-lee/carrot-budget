import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCPEgEvI95Q0dYD\n5YNPDbxt1v0bxdceZ+u04BhtkPyJjCh2J0ezqG8tBoJdPP3ZW5aVXQ4o77MKJ3nJ\noHLg4e3Ciwc5tYqEVzJmvOyIvdUlHZEkyO9/IUrMOZA7d3tlb6ujh7iCQNQB4sBS\nwCXXVIAV84e7WttJnpT4vXCdxynyUAI7zz7MY77Wcn5ZfMp8oLGmDt1a19n8x821\n7SfIjtKSDT1p8Nmzs6JuxI88uLEfsEkAp+JAJToTlId+X8FpJe3qRBi8Zsinfy8z\no8B5ZBSRHY2JptLlMwiz+2MBSXX7jP9osnOvRslPCSCIbukMEudaCkYIkVbUZzJO\nQg4uyPH/AgMBAAECggEAJUVqe45bjzBrEY7L+183tGGqhH6wwOIPvIoYswpvT6Hs\ntIMdIceCVvd4JLQL6YD7pKOeWbnAKagJCSa8ZqtU1jaDxlvt3vYcUjlrYWAa09V1\nB2E1SygwJS3lzigdRFqoGyzzOzOKR4d71NLryMHhsFZGCN/teqtOYdJwMRo+ajpb\n8OVf8x7NJ/rWKw51U0rTneD9v4Xow35iur3fj9hvvjhPshPjinfEycSPmPmPjRT1\nvxxU1n6uYVhzCV/nlsm8IRLo9icb8WkQeH9ONhgbvAIbmsS6RUSN7yQ4o7QJqbKf\ncKy0WsGYj/9cqbvay2ajSYTuCY1Al0daimP62zoV+QKBgQDCV1cj6ouboLjdtO5O\nQc6FcS/B6FK6ufasUZYLh4tOClAew3GplevdTZ2srxdrGvmOwqvWrezbJZe9OC0/\ngaGkZ9IqUe9BsrvAt7mQnr3qlPKTSL6SUtoacwYBXA+wi5ZsuzI4Gcjaq3dNFU/a\ngEniGyY2CLkI8Pwb1UDKS/sKLQKBgQC8dmASPOyZzdvXtDdkUUAZJywneuwKJI5P\n18ImredCZRnNNbMt6/qsHFkzaQLdSaKykFzhShqrMOFUYCdOoMSk/lQXg8LuyOeR\n6FAbxUMg2gcli1mBLsl1/OlURYGLSvuMjjhosf9BISJY8Zd0R4oA6PCDuB9JKDqG\nBSZuxFYkWwKBgFMD8iJSf35kQnPaZO2i6LBR8D+ZmTVQWNG1LC4SoWwdtanefQAf\nHZj0HcV1KcDDzhSwjazvsLzQKyhWBeYZ3s2W18ziIRzkV5V0Jd1kIeZB5/kIWvew\nUqB3v/n2tHEKv6AEuugCA619D0IrN2gz4tumE0WDpl7uahMNnlaL7FmlAoGBAJyc\njld5k3B4lpFY7JMLxgVg/RtN1erT2ANXm7rC1yPgmiFi16R4rlXqNOI5CK1VrMNQ\nni6Fg0Xxl76jLOb1SJSH2N+1mf8OqwkgEboSIiehp0C23Ukx1S6cXlWucOmNBR8X\nbJ7sE99OppldImv5qx/4cy4yiqUjrgaDLx3rQF5zAoGAPTtUmpEwbKHHH7xNgCaV\nPufL5zqTUtN6P5wGRU9MkYpE6IXw7YTOd77hfBrXA6XZggP/H1A9HorqkaB5+nI8\nu5sZRmwH/BLOXuG6jnuWdABcDZDdHy5McG/yC1N0sl0yIC054Zcv7FP8N+ZJUx2E\nL5rLJ8z2f9nA+t04OmM0NXQ=\n-----END PRIVATE KEY-----\n'
const formattedKey = privateKey.replace(/\\n/g, '\n');

const auth = new google.auth.JWT(
  'carrots-lee@carrots-budget-project.iam.gserviceaccount.com',
  null,
  formattedKey, 
  SCOPES
);

const sheets = google.sheets({ version: 'v4', auth });


export async function appendRowToSheet(spreadsheetId, sheetName, rowData) {
  await sheets.spreadsheets.values.append({
    spreadsheetId : '1O8SMtmUJ9lTbE_RKyaBKnLNkvmQ0AzoogMCyeBMfkQs',
    range: `${'Sheet1'}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [rowData],
    },
  });
}
