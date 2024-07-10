import React from "react";

interface SelectListProps {
  name: string;
  elements: string[];
}

const ListTrx: React.FC<SelectListProps> = ({ name, elements }) => {
  return (
    <select name={name}>
      {elements.map((el: string, index: number) => (
        <option key={`key_${index}`}>{el}</option>
      ))}
    </select>
  );
};

export default ListTrx;
