/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
async function imageToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  const reader = new FileReader();
  const dataUrlPromise = await new Promise((resolve, reject) => {
    if (!valid) {
      throw Error('Provided file is not a png, jpg or jpeg image. Saving the question will not save this upload as the question image');
    }
    reader.readAsDataURL(file);
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  return dataUrlPromise;
}

export default imageToDataUrl;
