import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
// import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [formData, setFormData] = useState({
    fields: [],
    buttons: [],
  });

  const [fieldScript, setFieldScript] = useState('');
  const [buttonScript, setButtonScript] = useState('');

  const handleFieldChange = (e, index) => {
    const updatedFields = [...formData.fields];
    updatedFields[index][e.target.name] = e.target.value;
    setFormData({ ...formData, fields: updatedFields });
  };

  const handleButtonChange = (e, index) => {
    const updatedButtons = [...formData.buttons];
    updatedButtons[index][e.target.name] = e.target.value;
    setFormData({ ...formData, buttons: updatedButtons });
  };

  const addField = () => {
    setFormData({
      ...formData,
      fields: [...formData.fields, { fieldName: '', fieldType: 'text' }],
    });
  };

  const addButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      buttons: [
        ...prevFormData.buttons,
        { buttonName: '', buttonType: 'update', index: prevFormData.buttons.length },
      ],
    }));
  };


  const removeField = (index) => {
    const updatedFields = [...formData.fields];
    updatedFields.splice(index, 1);
    setFormData({ ...formData, fields: updatedFields });
  };

  const removeButton = (index) => {
    const updatedButtons = [...formData.buttons];
    updatedButtons.splice(index, 1);
    setFormData({ ...formData, buttons: updatedButtons });
  };

  const generateFieldScript = () => {
    const generatedScript = formData.fields;
    var fieldsQuery = "CREATE TABLE Products (";
    for (var f of generatedScript) {
      f.fieldName = f.fieldName.replace(" ", "_");
      fieldsQuery = fieldsQuery + " " + f.fieldName + "";
      fieldsQuery = fieldsQuery + " " + f.fieldType + ",";
    }
    fieldsQuery = fieldsQuery.slice(0, -1);
    fieldsQuery = fieldsQuery + ");";
    setFieldScript(fieldsQuery);
  };

  const generateButtonScript = () => {
    const generatedScript = formData.buttons;
    var allButtons = [];
    const generatedFields = formData.fields;
    for (var b of generatedScript) {
      if (b.buttonIndex <= 0 || b.buttonIndex >= generatedFields.length) {
        alert("Button Index Out of Bound");
        console.log("Button Index Out of Bound");
        return;
      }
      generatedFields[b.index].fieldName = generatedFields[b.index].fieldName.replace(" ", "_");
      if (b.buttonType === "update") {
        allButtons.push("UPDATE Products SET " + generatedFields[b.index - 1].fieldName + "=@text WHERE id=@id");
      }
      else if (b.buttonType === "delete") {
        allButtons.push("ALTER TABLE Products DROP COLUMN " + generatedFields[b.index - 1].fieldName + "");
      }

    }
    setButtonScript(allButtons);
  };

  useEffect(() => {
    addField();
    addButton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Fields:</h2>
      {formData.fields.map((field, index) => (
        <div key={index}>


          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-sm">Field Name</InputGroup.Text>
            <Form.Control
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              type="text"
              name="fieldName"
              value={field.fieldName}
              onChange={(e) => handleFieldChange(e, index)}
            />
          </InputGroup>

          <Form.Label htmlFor="ftype">Field Type</Form.Label>
          <Form.Select name="fieldType"
            value={field.fieldType}
            id='ftype'
            onChange={(e) => handleFieldChange(e, index)}
            aria-label="Default select example">
            <option value="int">int</option>
            <option value="text">text</option>
            <option value="date">date</option>
          </Form.Select>

          <Button variant="danger" type='Danger' onClick={() => removeField(index)}>
            Remove Field
          </Button>
        </div>
      ))}
      <Button variant='primary' type="button" onClick={addField}>
        Add Field
      </Button>
      <Button variant='success' type="button" onClick={generateFieldScript}>
        Generate Field Script
      </Button>

      <h2>Buttons:</h2>
      {formData.buttons.map((button, index) => (
        <div key={index}>
          <label>

            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm">Button name</InputGroup.Text>
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                type="text"
                name="buttonName"
                value={button.buttonName}
                onChange={(e) => handleButtonChange(e, index)}
              />
            </InputGroup>
          </label>

          <Form.Label htmlFor="btype">Button Type</Form.Label>

          <Form.Select name="buttonType"
            value={button.buttonType}
            id='btype'
            onChange={(e) => handleButtonChange(e, index)}
            aria-label="Default select example">
            <option value="update">update</option>
            <option value="delete">delete</option>
          </Form.Select>

          <Form.Label htmlFor="bindex">Button Index</Form.Label>

          <input
            type="number"
            name="index"
            value={button.index}
            id='bindex'
            onChange={(e) => handleButtonChange(e, index)}
          />

          <Button variant='danger' type="button" onClick={() => removeButton(index)}>
            Remove Button
          </Button>
        </div>
      ))}
      <Button variant='primary' type="button" onClick={addButton}>
        Add Button
      </Button>
      <Button variant='success' type="button" onClick={generateButtonScript}>
        Generate Button Script
      </Button>

      <div>
        <h2>Generated Field Script:</h2>
        <pre>{JSON.stringify(fieldScript, null, 2)}</pre>
      </div>

      <div>
        <h2>Generated Button Script:</h2>
        <pre>{JSON.stringify(buttonScript, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
