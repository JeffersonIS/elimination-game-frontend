import React from 'react';
import {Button, Modal, Form} from 'react-bootstrap';
import {capitalizeFirstLetter} from '../../utils/edit-utils';

function AddModal(props) {
    const PLAYER = 'player';
    const ITEM = 'item';

  return (
      <Modal show={props.showModal} onHide={props.handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add {capitalizeFirstLetter(props.type)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="add-form">
                {props.type === PLAYER ? 
                    <>                   
                        <Form.Label>Player Name</Form.Label>
                        <Form.Control value={props.entityName} onChange={props.handleFormChange} type="name" placeholder="ex. Jeffrozone" />
                        <br></br>
                        <Form.Label>Secret Code</Form.Label>
                        <Form.Control value={props.secretName} onChange={props.handleSecretChange} type="secret" placeholder="ex. Mr.Lungs" />
                        <Form.Text id="passwordHelpBlock" muted>
                            No length or character requirements. Just remember this to be able to access your assignments once the game begins.
                        </Form.Text>
                    </>
                : props.type === ITEM ?
                    <>                   
                        <Form.Label>Name of Item</Form.Label>
                        <Form.Control value={props.entityName} onChange={props.handleFormChange} type="name" placeholder="ex. 'Water Bottle'" />
                        <Form.Text id="passwordHelpBlock" muted>
                            Be specific to avoid confusion.
                        </Form.Text>
                       
                    </>
                :
                    <>                   
                        <Form.Label>Place</Form.Label>
                        <Form.Control value={props.entityName} onChange={props.handleFormChange} type="name" placeholder="ex. Front Porch" />
                        <Form.Text id="passwordHelpBlock" muted>
                            Be specific to avoid confusion.
                        </Form.Text>
                    </>
                }
                <br></br>
                <Form.Text style={{color: "#dc3545"}}>{props.errorMessage}</Form.Text>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            {props.isLoading ?
                <div>one second...</div>  
            :
                <Button variant="success" type="submit" onClick={props.handleSaveItem}>
                    Save
                </Button>
            }
        </Modal.Footer>
      </Modal>
  );
}

export default AddModal;