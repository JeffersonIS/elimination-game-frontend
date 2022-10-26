import React, { useState } from 'react';
import axios from 'axios'
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import {capitalizeFirstLetter} from '../../utils/edit-utils';
import AddModal from './AddModal';
import { formatObject } from '../../utils/api-utils';
import './editStyles.css';
import {SERVER_URL} from '../../utils/global-vars';

function EditTable(props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [entityName, setEntityName] = React.useState('');
  const [secretName, setSecretName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSaveItem = () => {
    if(validate(entityName, secretName)){
      setErrorMessage('');
      setIsLoading(true);
      const object = formatObject(entityName, secretName, props.type)
      axios.post(`${SERVER_URL}/${props.type}`, object)
      .then(function (response) {
        setIsLoading(false);
        setShowMessage("Added Successfully");
        setEntityName('');
        setSecretName('');
        setShowAddModal(false);
        props.getData();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  const validate = (entityName, secretName) => {
    if(entityName === ''){
      setErrorMessage('Please enter a name.');
      return false;
    }

    if(props.type === "player"){
      if(secretName === ''){
        setErrorMessage('Please enter a secret code.');
        return false;
      }
    }
    return true;
  }

  const deleteItem = (name) => {
    const obj = {name: name}
    axios.post(`${SERVER_URL}/delete${props.type}`, obj)
    .then(res => res.data)
    .then(() => {
      props.getPlayersItemsPlaces()
    })
    .catch(function (error) {
      console.log(error);
      setShowMessage("Error Deleting")
    });

    props.getData();
  }

  const handleCloseAddModal = () => {
    setSecretName('');
    setEntityName('');
    setShowAddModal(false);
    setShowMessage('');
  }

  const handleShowModal = () => {
    setShowAddModal(true);
  }

  const handleFormChange = (event) => {
    setEntityName(event.target.value)
}

const handleSecretChange = (event) => {
    setSecretName(event.target.value)
}

  return (
    <div className='text-center m-4 mt-4'>
      <AddModal 
        handleCloseModal={handleCloseAddModal}
        showModal={showAddModal}
        type={props.type}
        handleFormChange={handleFormChange}
        handleSecretChange={handleSecretChange}
        handleSaveItem={handleSaveItem}
        isLoading={isLoading}
        showMessage={showMessage}
        secretName={secretName}
        errorMessage={errorMessage}
        />

      <div className='table-container'>
        <div className='table-width-big'>
          <div className='btn-add-new'>
            
          <span className='m-3' style={{color: 'grey'}}>{showMessage}</span>
          <Button className='mb-2' colSpan={2} 
              variant="success"
              onClick={() => {handleShowModal()}}>
              Add {capitalizeFirstLetter(props.type)}
            </Button>
          </div>

          <Table striped hover >
          <thead>
            <tr>
              <th>Name</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {props.data && (
              props.data.map(item => {
                return(
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>
                      <Button onClick={() => deleteItem(item.name)}
                      variant="outline-secondary"
                      >Remove</Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </Table>
        </div>
      </div>
    </div>
  );
  }

export default EditTable;
