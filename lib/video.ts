// Google Drive URLs for a shared video file (the file must be shared as "Anyone with the link").
export const driveThumb = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
/** Same-origin cached copy of the Drive thumbnail (see app/api/thumb/[id]/route.ts). */
export const thumbPath = (id: string) => `/api/thumb/${id}`;
export const driveEmbed =(id: string) => `https://drive.google.com/file/d/${id}/preview`;
