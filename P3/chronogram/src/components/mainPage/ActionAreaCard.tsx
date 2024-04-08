import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ActionAreaCardProps {
  title: string;
  content: string;
  buttonText: string;
  image: string;
  navigateTo: string;
}

const ActionAreaCard: React.FC<ActionAreaCardProps> = ({ title, content, buttonText, image, navigateTo }) => {
    
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleButtonClick = () => {
        navigate(navigateTo); // Navigate to the specified URL
    };

    return (
        <Card sx={{ flexBasis: '30%', maxWidth: '30%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardActionArea>
            <CardMedia
            component="img"
            height="200"
            image={image}
            alt={title}
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ minHeight: '70px' }}>
                {content}
            </Typography>
            </CardContent>
        </CardActionArea>
        <div style={{ marginTop: 'auto', padding: '10px' }}>
            <Button onClick={handleButtonClick} variant="contained" sx={{ textTransform: 'none', fontSize: '1rem', borderRadius: '999px', width: '100%' }}>{buttonText}</Button>
        </div>
        </Card>
    );
};

export default ActionAreaCard;
