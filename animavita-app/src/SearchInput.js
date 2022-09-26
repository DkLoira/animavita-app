import React, { useState } from 'react';
import useDebounce from './useDebounce';

export default function SearchInput({ value, onChange }) {

    const [displayValue, setDisplayValue] = useState(value);
    const debouncedChange = useDebounce(onChange, 300);

    function handleChange(event) { 
        setDisplayValue(event.target.value);
        debouncedChange(event.target.value);
     }

     return (
        <input className="form-control mr-sm-2" type="search" placeholder="Pesquisar" aria-label="Pesquisar" value = { displayValue } onChange = { handleChange } ></input>
    );
};