import React from 'react';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
    name: string;
    style?: string;
}

const Button: React.FC<ButtonProps> = ({ name, style, ...props }) => {
    return (
        <button
            className={style}
            {...props}
        >
            {name}
        </button>
    );
};

export default Button; 