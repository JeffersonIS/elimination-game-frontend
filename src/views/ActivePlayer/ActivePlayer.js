import React, {useEffect, useState} from 'react';
import './activeplayer.css';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import {SERVER_URL} from '../../utils/global-vars';

function ActivePlayer(){
    let params = useParams();
    let navigate = useNavigate();
    const [player, setPlayer] = useState();
    const [showData, setShowData] = useState(false);
    const [secretCode, setSecretCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleEnterSecret(e){
        setSecretCode(e.target.value);
        setErrorMessage('');
    }

    function handleSubmitSecretCode(){
        console.log(secretCode, player.secretCode)
        if(secretCode === player.secretCode){
            setShowData(true);
        } else {
            setErrorMessage('Whoops, wrong code! Try again, or ask Jefferson.')
        }
    }

    function navBackToGame(){
        navigate(`/game/${params.id}/`)
    }

    useEffect(() => {
        async function getActivePlayer(player, gameNumber){
            await axios.get(`${SERVER_URL}/activeplayer/${player}/${gameNumber}`)
            .then(res => {setPlayer(res.data)})
            .catch(function (error) {
              console.log(error);
            });
          }
        getActivePlayer(params.player, params.id)
    }, [params.id, params.player]);

    return(
        <>
        <div className='activeplayer-container mt-3'>
        <div className='m-2 mb-3 breadcrumb' onClick={() => navBackToGame()}> &#8592; Back to Game</div>

            <div className='activeplayer-card'>
            <h3 className='mb-3'>Welcome {player?.player},</h3>

                {showData ?
                <Row >
                    <Col className='mt-3 card-text'>
                        <p>Eliminate <b>{player.target}</b> with a <b>{player.itemToUse}</b> in/on the <b>{player.placeToKill}</b></p>
                        <p><b>Target: </b>{player.target}</p>
                        <p><b>Item: </b>{player.itemToUse}</p>
                        <p><b>Location: </b>{player.placeToKill}</p>

                    </Col>
                </Row>
                :
                <Row>
                    <Form>
                            <Form.Text>
                                <p> Enter your secret code below to reveal your mission.
                                    <br></br>
                                    This is the code you entered when you created yourself as a player.
                                </p>
                            </Form.Text>
                            <Form.Control className='mb-3' value={secretCode} onChange={(e) => handleEnterSecret(e)} type="name" placeholder="Enter code here" />
                            <Button className='mb-1' variant="outline-success" onClick={() => handleSubmitSecretCode()}>Submit Code</Button>
                            <br></br>
                            <Form.Text style={{color: '#dc3545'}}>{errorMessage}</Form.Text>
                    </Form>
                </Row>
                }
            </div>
        </div >
        </>


    
    )
}

export default ActivePlayer;