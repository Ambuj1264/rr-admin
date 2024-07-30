import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import { Box, CircularProgress } from '@mui/material';

const suspenseLoaderContainerStyle: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999, // Ensure it's on top of everything
};

const blurBackgroundStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  backdropFilter: 'blur(5px)', // Apply a blur effect to the background
  opacity: 0.7, // Adjust the opacity to control the blur intensity
};

function SuspenseLoader() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <Box sx={suspenseLoaderContainerStyle}>
      <div style={blurBackgroundStyle}></div>
      <CircularProgress size={64} disableShrink thickness={3} />
    </Box>
  );
}

export default SuspenseLoader;
