import React, { useCallback } from 'react';
import styles from './FormattedInput.module.css';

interface FormattedInputProps {
    value: string;
    onChange: (value: string) => void;
    name: string;
    disabled?: boolean;
    id: string;
    required?: boolean;
    onInput?: () => void;
}

const FormattedInput: React.FC<FormattedInputProps> = ({ value, onChange, name, disabled = false, required = false, id, onInput }) => {
    const formatNumber = (value: string) => {
        const [integerPart, decimalPart] = value.replace(/,/g, '').split('.');
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimalPart !== undefined ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const numericValue = value.replace(/[^0-9.]/g, '');
        const formattedValue = formatNumber(numericValue);
        onChange(formattedValue);
    };

    return (
        <input
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={handleChange}
            className={styles.input}
            disabled={disabled}
            required={required}
            onInput={onInput}
        />
    );
};

export default FormattedInput;
