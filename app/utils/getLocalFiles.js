import * as R from 'ramda';
import { remote } from 'electron';

const { dialog } = remote;

const getLocalFile = options =>
  new Promise(resolve => dialog.showOpenDialog(options, r => resolve(r)));

export const singleFilePath = options => getLocalFile(options).then(files => files[0]);
export const filePaths = getLocalFile;

export const localAudioPaths = (options = {}) => {
  const newOpts = R.compose(
    R.over(R.lensProp('filters'), R.append({ name: 'Audios', extensions: ['mp3'] })),
    R.over(R.lensProp('properties'), R.pipe(R.append('openFile'), R.append('multiSelections'))),
  )(options);

  console.log(newOpts);

  return getLocalFile(newOpts);
};
