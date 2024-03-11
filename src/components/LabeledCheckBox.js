const LabeledCheckBox = ({ id, text, checked, onChange }) => {
    return (
      <div className="checkbox-container">
        <label htmlFor={id}>{text}</label>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      </div>
    );
  };
  
  export default LabeledCheckBox;
  