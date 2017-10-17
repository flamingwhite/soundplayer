import fs from 'fs';
import path from 'path';
import dataurl from 'dataurl';
import mp3Duration from 'mp3-duration';
import id3 from 'id3js';

export const convertSong = filePath =>
  new Promise((resolve, reject) => {
    console.log('reading', filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(dataurl.convert({ data, mimetype: 'audio/mp3' }));
    });
  });

export const getDuration = filePath => {
  const durationPromise = new Promise((resolve, reject) => {
    mp3Duration(filePath, (err, duration) => {
      if (duration) {
        resolve(duration);
      }
      if (err) {
        reject(err);
      }
    });
  });
  return durationPromise;
};

export const getTags = track => {
  const { filePath } = track;
  const tagsPromise = new Promise((resolve, reject) => {
    id3({ file: filePath, type: id3.OPEN_LOCAL }, (err, tags) => {
      if (tags) {
        const { title, album, artist } = tags;
        Object.assign(track, { title, album, artist, track: tags.v1.track });
        resolve(track);
      }
      if (err) {
        reject(err);
      }
    });
  });
  return tagsPromise;
};

export const getNameByPath = filePath => {
  const basename = path.basename(filePath);
  const extname = path.extname(filePath);
  return basename.slice(0, basename.length - extname.length);
};
