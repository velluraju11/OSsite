
'use server';
import { google } from 'googleapis';
import { Submission } from './db';

const FOLDER_NAME = 'Ryha OS Submissions';

async function getAuthenticatedClient() {
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}');
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  return auth.getClient();
}

async function findOrCreateFolder(drive: any) {
  let folderId = '';

  // Search for the folder
  const res = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`,
    fields: 'files(id, name)',
  });

  if (res.data.files.length > 0) {
    // Folder exists
    folderId = res.data.files[0].id;
  } else {
    // Folder does not exist, create it
    const fileMetadata = {
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    };
    const folder = await drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    });
    folderId = folder.data.id;
  }
  
  return folderId;
}

export async function saveToGoogleDrive(submission: Submission) {
  try {
    const authClient = await getAuthenticatedClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const folderId = await findOrCreateFolder(drive);
    
    const fileName = `submission-${submission.id}-${submission.username}.json`;
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };
    
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(submission, null, 2),
    };
    
    await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    });

    console.log(`Submission ${submission.id} saved to Google Drive in folder ${FOLDER_NAME}.`);

  } catch (error) {
    console.error('Failed to save to Google Drive:', error);
    // Depending on requirements, you might want to re-throw the error
    // to let the calling function know something went wrong.
    throw new Error('Failed to save submission to Google Drive.');
  }
}
