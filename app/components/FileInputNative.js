import React, { Component } from 'react';
import { Button, Icon, message } from 'antd';
import { remote } from 'electron';
import dataurl from 'dataurl';
import fs from 'fs';

const { dialog } = remote;
console.log(dialog);

const convertSong = filePath =>
  new Promise((resolve, reject) => {
    console.log('reading', filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(dataurl.convert({ data, mimetype: 'audio/mp3' }));
    });
  });

class FileInputNative extends Component {
  showDialog = () => {
    const { select } = this.props;
    dialog.showOpenDialog(
      {
        title: 'hello',
      },
      r => select(convertSong(r[0])),
    );
  };
  render() {
    const { onFileChange } = this;
    const { buttonText = 'Upload' } = this.props;

    return (
      <div>
        <input
          style={{ display: 'none' }}
          type="file"
          ref={input => (this.fileInput = input)}
          onChange={onFileChange}
          multiple
        />
        <Button onClick={() => this.showDialog()}>
          <Icon type="upload" /> {buttonText}
        </Button>
      </div>
    );
  }
}

export default FileInputNative;

//   <Upload
//     className="ImageUploader-uploader"
//     name="avatar"
//     showUploadList={false}
//     action="//jsonplaceholder.typicode.com/posts/"
//     beforeUpload={beforeUpload}
//     onChange={this.handleChange}
//   >
//     {
//       imageUrl ?
//         <img src={imageUrl} alt="" className="avatar" /> :
//         <Icon type="plus" className="avatar-uploader-trigger" />
//     }
//   </Upload>
