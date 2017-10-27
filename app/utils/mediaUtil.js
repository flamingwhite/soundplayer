import { remote } from 'electron';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import child_process from 'child_process';
import { secondsToTimeStr } from './timeUtil';
import { replaceFileSync } from './getLocalFiles';

const { app } = remote;

const promisify = (fn, context) => (...params) =>
  new Promise((res, rej) =>
    fn.call(context, ...params, (err, result) => (err ? rej(err) : res(result))),
  );

const exec = promisify(child_process.exec, child_process);

const defaultFileFormat = '%(title)s';
const defaultFileFormatWithExt = '%(title)s.%(ext)s';

export const getMediaFolder = () => path.join(app.getPath('music'), 'soundPlayer');
export const getAudioFolder = () => path.join(getMediaFolder(), 'Audios');
export const getVideoFolder = () => path.join(getMediaFolder(), 'Videos');

export const getFilenameByUrl = (url, format = defaultFileFormat) =>
  exec(`youtube-dl --no-check-certificate --get-filename  -o "${format}" ${url}`);

export const getDurationByUrl = url =>
  //   exec(`youtube-dl --no-check-certificate --get-duration  ${url}`);
  exec(`youtube-dl --no-check-certificate -j  ${url}`).then(
    r =>
      // console.log(r);
      r && JSON.parse(r).duration,
  );

export const downloadAudio = (
  url,
  audioPath = getAudioFolder(),
  format = defaultFileFormatWithExt,
) =>
  exec(
    `cd ${audioPath}; youtube-dl --no-check-certificate --extract-audio -o "${format}" --audio-format mp3 ${url}`,
  ).then(r => r);

export const downloadVideo = (
  url,
  videoPath = getVideoFolder(),
  format = defaultFileFormatWithExt,
) => exec(`cd ${videoPath}; youtube-dl --no-check-certificate -o "${format}" --format mp4 ${url}`);

// export const downloadAudio = (url, audioPath = getMediaFolder()) => download(url, audioPath);

export const cutMedia = (inputPath, outputPath, startTime = 0, duration = 0) => {
  console.log('arg', inputPath, outputPath, startTime, duration);
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(secondsToTimeStr(startTime))
      .setDuration(duration)
      .output(outputPath)
      .on('end', err => (err ? reject(err) : resolve('Done')))
      .run();
  });
};

export const getMediaInfo = (url, format = defaultFileFormat) =>
  Promise.all([
    getFilenameByUrl(url, format),
    getDurationByUrl(url, format),
  ]).then(([filename, duration]) => ({
    name: `${filename.trim()}`,
    duration,
  }));

export function getYoutubeVideoId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

export const downloadAndCutMedia = async ({
  url,
  filenameWithoutExt,
  mediaFolder,
  type,
  startDuration,
}) => {
  console.log(url, filenameWithoutExt, mediaFolder, type, startDuration);
  let downloadFn = downloadAudio;
  let ext = '.mp3';
  if (type !== 'audio') {
    downloadFn = downloadVideo;
    ext = '.mp4';
  }

  await downloadFn(url);
  const filePath = path.join(mediaFolder, filenameWithoutExt + ext);
  console.log('filepath', filePath);
  if (startDuration) {
    const { start, duration } = startDuration;
    const tempPath = `${filePath}temp${ext}`;
    await cutMedia(filePath, tempPath, start, duration);
    replaceFileSync(tempPath, filePath);
  }
  return {
    name: filenameWithoutExt + ext,
    path: filePath,
    type,
  };
};
