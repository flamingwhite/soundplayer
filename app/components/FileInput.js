import React, { Component } from 'react';
import { Button, Icon, message } from 'antd';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return false;
  //   return isJPG && isLt2M;
}

class FileInput extends Component {
  onFileChange = e => {
    const { onFileSelect } = this.props;
    e.preventDefault();
    const files = e.target.files;
    return files && onFileSelect && onFileSelect(files);
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
        <Button onClick={() => this.fileInput.click()}>
          <Icon type="upload" /> {buttonText}
        </Button>
      </div>
    );
  }
}

export default FileInput;

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
