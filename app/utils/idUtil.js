import uuidv4 from 'uuid/v4';
import crypto from 'crypto';

export const getUUID = () => uuidv4();
export const getMd5 = v =>
  crypto
    .createHash('md5')
    .update(v)
    .digest('hex');
