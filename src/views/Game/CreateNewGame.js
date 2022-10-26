import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import {playerDataState, itemDataState, placeDataState} from '../../recoilState/stateTemplates';
import './gameStyles.css'
import { capitalizeFirstLetter } from '../../utils/edit-utils';
import Table from 'react-bootstrap/Table';
import { setTargets, getRandomNum, 
  handleAddorRemove, getNewGame, 
  postNewGame, postActivePlayers} from './game-utils';
import {SERVER_URL} from '../../utils/global-vars';

function CreateNewGame() {
  const CREATE_GAME = 'Create Game';
  const PLAYER = 'player';
  const ITEM = 'item';
  const PLACE = 'place';
  const playerData = useRecoilValue(playerDataState);
  const itemData = useRecoilValue(itemDataState);
  const placeData = useRecoilValue(placeDataState);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(PLAYER); //change back to PLAYER
  const [count, setCount] = React.useState(0);
  const [submitDisabled, setSubmitDisabled] = React.useState(true); //change back to true
  const [errorMessage, setErrorMessage] = React.useState('');
  const [selectedPlayers, setSelectedPlayers] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectedPlaces, setSelectedPlaces] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState([]);
  const [gameName, setGameName] = React.useState('');
  const [nextGameNumber, setNextGameNumber] = React.useState(1); //change back to PLAYER
  const submitArray = [selectedPlayers, selectedItems, selectedPlaces];
  const tabsArray = ['Players', 'Items', 'Places'];

  let data = activeTab === PLAYER ? playerData : activeTab === ITEM ? itemData : placeData;

  const handleSelect = (event) => {
    if(activeTab === PLAYER){
      let array = handleAddorRemove(selectedPlayers, event);
      setSelectedPlayers(array);
      setCount(count + 1);
      setSelectedData(array);

    } else if(activeTab === ITEM){
      let array = handleAddorRemove(selectedItems, event)
      setSelectedItems(array);
      setCount(count + 1);
      setSelectedData(array);
    } else {
      let array = handleAddorRemove(selectedPlaces, event)
      setSelectedPlaces(array);
      setCount(count + 1);
      setSelectedData(array);

    }
  }

  function handleGameNameChange(e){
    setGameName(e.target.value);
  }

  const checkIsSelected = (id) => {
    let isSelected = false;
    selectedData.forEach(item => {
      if(item._id === id) isSelected = true;
    });
    return isSelected;
  }

  async function checkEqualCounts () {
    setErrorMessage('');
    setSubmitDisabled(true);

    if(selectedPlayers.length >= 3){
      if(selectedPlayers.length === selectedItems.length && selectedItems.length === selectedPlaces.length){
        setSubmitDisabled(false);
        await getHighestGameNumber();
      } else {
        setErrorMessage('You must have an equal number of players, items and places')
      }

    } else {
      setErrorMessage('You must have at least 3 players, items and places.');
    }    
}

  const advanceTab = () => {
    if(activeTab === PLAYER){
      setActiveTab(ITEM)
      setSelectedData(selectedItems);
    } else if(activeTab === ITEM){
      setActiveTab(PLACE);
      setSelectedData(selectedPlaces);
    } else if(activeTab === PLACE){
      checkEqualCounts();
      setActiveTab(CREATE_GAME);
      setSelectedData([]);
    }
  }

  const revertTab = () => {
    if(activeTab === ITEM){
      setActiveTab(PLAYER)
      setSelectedData(selectedPlayers);
    } else if(activeTab === PLACE){
      setActiveTab(ITEM);
      setSelectedData(selectedItems);
    } else if(activeTab === CREATE_GAME){
      setActiveTab(PLACE);
      setSelectedData(selectedPlaces);
    }
  }

  async function submitNewGame () {
    setSubmitDisabled(true);
    let name = gameName;
    let activePlayers = getActivePlayers();
    let activePlayersWithTargets = setTargets(activePlayers);
    if(name === ''){
      name = String(nextGameNumber);
    }
    
    try {
      //creating the game and adding players to active players table.
      await postNewGame(getNewGame(nextGameNumber, selectedPlayers.length, name));
      await postActivePlayers(activePlayersWithTargets);
    } catch (err) {
      console.log(err);
    }
    
    //take to the /game page
    navigate('/');
  }

  const getActivePlayers = () => {
    let activePlayers = [];
    let items = selectedItems.splice(0);
    let places = selectedPlaces.splice(0);
    
    selectedPlayers.forEach((item) => {
      let itemToUse = items.splice(getRandomNum(0, items.length - 1), 1);
      let placeToKill = places.splice(getRandomNum(0, places.length - 1), 1);

      let activePlayer = {
        player: item.name,
        playerId: item._id,
        placeToKill: placeToKill[0].name,
        itemToUse: itemToUse[0].name,
        target: '',
        targetedBy: '',
        eliminated: false,
        gameNumber: nextGameNumber,
        secretCode: item.secretCode,
      }
      activePlayers.push(activePlayer);
    });
    return activePlayers;
  }

  async function getHighestGameNumber (){
    await axios.get(`${SERVER_URL}/getHighestGameId`)
    .then(res => res.data)
    .then(json => { 
      if(json.length > 0) setNextGameNumber(json[0].gameNumber + 1);
    })
    .catch((error) => {console.log(error)
    });
  }
  
  return (
    <div>
      {activeTab !== CREATE_GAME ?
      <div className='text-center'>
        <h3 className='mt-3'>Select {capitalizeFirstLetter(activeTab)}s</h3>
        <p><small>To create a game, select players, items and places (3 of each). Then enter a name for your game. </small></p>
      </div>
      :
      <div className='text-center'>
        <h3 className='text-center mt-3'>{capitalizeFirstLetter(activeTab)}</h3>
        <p><small>To create a game, select players, items and places (3 of each). Then enter a name for your game. </small></p>
      </div>
      }
        <div className='table-container'>

        <div className='table-width mt-4'>
            <Row className='mb-2'>
                <Col>
                {activeTab !== PLAYER ?
                  <Button variant="outline-secondary" onClick={() => {revertTab()}} >Back</Button> : <span></span>
                }
                </Col>
                <Col className='align-right'>
                  {activeTab !== CREATE_GAME ?
                    <Button variant="success" onClick={() => {advanceTab()}}>Next</Button> 
                  :
                  <>
                    <Button variant="success" disabled={submitDisabled} onClick={() => {submitNewGame()}}>Create Game</Button>
                    <div className='align-right mt-3'><span>{errorMessage}</span></div>
                  </>
                  }
                </Col>
            </Row>

            {activeTab === CREATE_GAME && (
              <Form>
                <Form.Group>
                <Form.Label>Enter Game Name</Form.Label>
                <Form.Control value={gameName} onChange={(e) => handleGameNameChange(e)} type="name" placeholder="ex. Big House Bash" />
                </Form.Group>
              </Form>
            )}

            
            {activeTab !== CREATE_GAME ?

              <Table striped hover className='text-center'>
                <thead>
                <tr>
                    <th>Select</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                    {data && (
                        data.map((item, count) => {
                            let active;
                            if(checkIsSelected(item._id)){
                              active = 'btn-select-active';
                            }
                            return(
                                <tr key={item._id} className="row-hover"  onClick={() => handleSelect(item)}>
                                <td width={"30%"} className="text-center">
                                    <button  className={`btn-select ${active}`}></button>
                                </td>
                                <td width={"70%"}>{item.name}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
              </Table>
            :
              <Row className='mt-4'>
                {submitArray.map((array, count) => {
                  return(
                    <Col key={count} className='text-center m-2'>
                      <Table>
                        <thead>
                          <tr><td><strong>Total {tabsArray[count]}: {array.length}</strong></td></tr>
                        </thead>
                        <tbody>
                          {array?.map(item => {
                            return(
                              <tr key={item._id}><td>{item.name}</td></tr>
                            )
                          })}
                        </tbody>
                      </Table>
                  </Col>
                  )
                })}
              </Row>
            }
        </div>
    </div>
    </div>
  );
}

export default CreateNewGame;
