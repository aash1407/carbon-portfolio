import React from 'react';
import { Box, Typography } from '@mui/material';

interface MessagePopupProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const MessagePopup: React.FC<MessagePopupProps> = ({ message, type, onClose }) => {
  const backgroundColor = type === 'success' ? 'lightgreen' : 'lightcoral';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor,
        padding: 2,
        borderRadius: '8px',
        boxShadow: 2,
        zIndex: 1000,
        cursor: 'pointer',
      }}
      onClick={onClose}
    >
      <Typography>{message}</Typography>
    </Box>
  );
};

export default MessagePopup;
