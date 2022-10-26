import React from 'react';
import Table from 'react-bootstrap/Table';
import { Row, Col, Button } from 'react-bootstrap';

function SelectTable(props) {

    // console.log('selected data',props.selectedData);

  return (
    <div className='m-4 table-container'>
        <div className='table-width'>
            <Row className='mb-2'>
                <Col>
                <Button variant="outline-secondary" >Back</Button>
                </Col>
                <Col className='align-right'>
                <Button variant="outline-secondary" >Next</Button>
                </Col>
            </Row>
            <Table striped bordered hover variant="dark" >
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                    {props.data && (
                        props.data.map((item, count) => {
                            let active;
                            active = item._id === props.selectedData[count]?._id ? 'btn-select-active' : '';
                            return(
                                <tr key={item._id}>
                                <td width={"30%"} className="text-center">
                                    <button onClick={() => props.onClick(item)} className={`btn-select ${active}`}></button>
                                </td>
                                <td width={"70%"}>{item.name}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </Table>
        </div>
    </div>
  );
}

export default SelectTable;
