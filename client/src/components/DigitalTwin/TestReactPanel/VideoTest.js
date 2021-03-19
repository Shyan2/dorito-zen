import React from 'react';

const VideoTest = () => {
  return (
    <div>
      <iframe
        style={{ width: '324px', height: '244px' }}
        src='http://10.86.49.13/cgi-bin/encoder?USER=admin&PWD=123456&GET_STREAM'
      ></iframe>
    </div>
  );
};

export default VideoTest;
