import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const KPICard = ({ title, value, change, description, color }) => {
  const isPositive = change && change.startsWith('+');
  
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        borderLeft: `4px solid ${color}`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 16px 48px ${color}40`,
          background: `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        },
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            color: '#b3b3b3',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'block',
            mb: 1.5,
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 800,
            fontSize: '2.5rem',
            color: '#ffffff',
            mb: 2,
            textShadow: `0 0 20px ${color}60`,
            lineHeight: 1,
            letterSpacing: '-1px',
          }}
        >
          {value}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {change && (
            <Chip
              size="small"
              icon={isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
              label={change}
              sx={{
                background: isPositive 
                  ? 'linear-gradient(135deg, #00C851 0%, #007E33 100%)'
                  : 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
                height: '26px',
                boxShadow: isPositive 
                  ? '0 2px 8px rgba(0, 200, 81, 0.4)'
                  : '0 2px 8px rgba(255, 68, 68, 0.4)',
                '& .MuiChip-icon': {
                  color: '#fff',
                  fontSize: '16px',
                },
              }}
            />
          )}
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#999',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard;
