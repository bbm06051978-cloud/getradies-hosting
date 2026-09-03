// Utility to fetch pre-signed S3 URLs for private images
// Used for job photos and chat photos

export async function getSignedImageUrl(s3Url: string): Promise<string> {
  if (!s3Url) return "";
  try {
    const res = await fetch("/api/upload/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: s3Url }),
    });
    const data = await res.json();
    return data.signedUrl || s3Url;
  } catch {
    return s3Url;
  }
}

export async function getSignedImageUrls(s3Urls: string[]): Promise<string[]> {
  return Promise.all(s3Urls.map(url => getSignedImageUrl(url)));
}
