import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';
import { CSSProperties } from 'react';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const templateParams = {
            from_name: name,
            email: email,
            message: message,
        };
        console.log("Email:", email);
        console.log("Message:", message);

        emailjs.send('service_owlenh6', 'template_w1jufmq', templateParams, 'YfVD5noQjipeCRFbx')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setIsModalOpen(true);
                setName('');
                setEmail('');
                setMessage('');
            }, (err) => {
                console.log('FAILED...', err);
            });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate('/contact-us');
    };

    const containerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
    };

    const formStyle: CSSProperties = {
        maxWidth: '600px',
        width: '100%',
        margin: '110px',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        background: 'white',
    };

    const fieldStyle: CSSProperties = {
        marginBottom: '20px',
    };

    const inputStyle: CSSProperties = {
        width: '95%',
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    };

    const submitButtonStyle: CSSProperties = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const modalStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    };

    const modalContentStyle: CSSProperties = {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    };

    const closeButtonStyle: CSSProperties = {
        marginTop: '20px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const Modal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
        return (
            <div style={modalStyle} onClick={onClose}>
                <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                    <h1>Thank You!</h1>
                    <p>Thank you for contacting the ChronoGram Team, please allow us some time to get back to you regarding your concern.</p>
                    <button onClick={onClose} style={closeButtonStyle}>Close</button>
                </div>
            </div>
        );
    };

    return (
        <div style={containerStyle}>
            <h1>Contact Us</h1>
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={fieldStyle}>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div style={fieldStyle}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div style={fieldStyle}>
                    <label>Message:</label>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div style={fieldStyle}>
                    <button type="submit" style={submitButtonStyle}>Submit</button>
                </div>
            </form>
            {isModalOpen && <Modal onClose={handleCloseModal} />}
        </div>
    );
};

export default ContactPage;
