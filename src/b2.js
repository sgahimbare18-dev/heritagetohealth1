import B2 from 'backblaze-b2';
import crypto from 'crypto';

// Backblaze B2 upload helper
// Expected env vars:
// - B2_KEY_ID
// - B2_APP_KEY
// - B2_BUCKET_ID
// - B2_BUCKET_NAME (optional, used to compose public URL)
// - B2_PUBLIC_URL_BASE (optional, e.g. https://f000.backblazeb2.com/file)

const keyId = process.env.B2_KEY_ID;
const appKey = process.env.B2_APP_KEY;
const bucketId = process.env.B2_BUCKET_ID;
const bucketName = process.env.B2_BUCKET_NAME;
const publicBase = process.env.B2_PUBLIC_URL_BASE || 'https://f000.backblazeb2.com/file';

if (!keyId || !appKey || !bucketId) {
  console.warn('B2 env vars missing: B2_KEY_ID, B2_APP_KEY, B2_BUCKET_ID');
}

const b2 = new B2({
  applicationKeyId: keyId,
  applicationKey: appKey,
});

export async function uploadToB2({ buffer, contentType, originalName, folder = 'uploads' }) {
  await b2.authorize();
  const { data: uploadUrlData } = await b2.getUploadUrl({ bucketId });

  const fileNameSafe = `${folder}/${Date.now()}-${originalName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const sha1 = crypto.createHash('sha1').update(buffer).digest('hex');

  const { data } = await b2.uploadFile({
    uploadUrl: uploadUrlData.uploadUrl,
    uploadAuthToken: uploadUrlData.authorizationToken,
    fileName: fileNameSafe,
    data: buffer,
    contentType: contentType || 'application/octet-stream',
    hash: sha1,
  });

  const url = `${publicBase}/${bucketName}/${fileNameSafe}`;
  return {
    fileId: data.fileId,
    fileName: data.fileName,
    url,
    contentType: data.contentType,
    size: data.contentLength,
  };
}