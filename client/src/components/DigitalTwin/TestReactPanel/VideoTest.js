const VideoTest = (props) => {
  return (
    <iframe
      style={{
        width: '100%',
        height: '800px',
      }}
      src={`http://10.86.49.${props.id}/cgi-bin/encoder?USER=admin&PWD=123456&GET_STREAM`}
    />
  );
};

export default VideoTest;
