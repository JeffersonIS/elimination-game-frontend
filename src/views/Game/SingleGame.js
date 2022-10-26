import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';
import { activePlayersDataState } from '../../recoilState/stateTemplates';
import {  useRecoilValue } from 'recoil';
import { getActivePlayers, 
  getActivePlayer, 
  updatePlayer, 
  filterActivePlayers,
  filterEliminatedPlayers,
  updateGame,
 } from './game-utils';
import { Table, Button } from 'react-bootstrap';
import './gameStyles.css'
import {SERVER_URL} from '../../utils/global-vars';

function SingleGame(props) {
  let params = useParams();
  let navigate = useNavigate();
  const allPlayers = useRecoilValue(activePlayersDataState);
  const [currentGame, setCurrentGame] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  const players = getActivePlayers(allPlayers, params.id);  
  const activePlayers = players.filter(filterActivePlayers);
  const eliminatedPlayers = players.filter(filterEliminatedPlayers)

  async function eliminatePlayer(player){

    if(window.confirm('Eliminating a player cannot be undone. Do you want to proceed?')){
      let playerToEliminate  = {...player}
      playerToEliminate.eliminated = true;

      
      //get killer an update who they will kill and with what
      let assassin = await getActivePlayer(playerToEliminate.targetedBy, playerToEliminate.gameNumber);
      let itemUsed = assassin.itemToUse
      let placeKilled = assassin.placeToKill;

      assassin.itemToUse = playerToEliminate.itemToUse;
      assassin.placeToKill = playerToEliminate.placeToKill;
      assassin.target = playerToEliminate.target;

      playerToEliminate.itemToUse = itemUsed;
      playerToEliminate.placeToKill = placeKilled;
  
      //get new target and updated targetedBy attribute
      let newTarget = await getActivePlayer(playerToEliminate.target, playerToEliminate.gameNumber);
      newTarget.targetedBy = assassin.player;
  
      // console.log('player to eliminate is ', playerToEliminate.player, playerToEliminate);
      // console.log('killer was ', assassin.player, assassin);
      // console.log('killer will now kill ', newTarget.player, newTarget);
  
      await updatePlayer(playerToEliminate, props.getAllActivePlayers);
      await updatePlayer(assassin, props.getAllActivePlayers);
      await updatePlayer(newTarget, props.getAllActivePlayers);
      if(activePlayers.length === 2){
        getCurrentGame();
      }
    }
  }

  function navToActivePlayer(player){
    navigate(`/game/${player.gameNumber}/${player.player}/`);
  }

  function navBackToGames(){
    navigate(`/`)
  }

  function getCurrentGame(){
    axios.get(`${SERVER_URL}/currentgame/${params.id}`)
    .then(res => {setCurrentGame(res.data)})
    .catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => {
    if(!currentGame){
      getCurrentGame()
    }
  })

  if(!gameComplete && currentGame){
    if(activePlayers.length === 1){

      if(!currentGame.complete){
        console.log(currentGame);
        updateGame(currentGame._id, activePlayers[0].player);
        setGameComplete(true);
      }
    }
  }

  return (
    <div>
      <div className='m-4 text-center'>

      </div>
      <div className='table-container'>
        <div className='table-width'>
        <div className='m-2 breadcrumb' onClick={() => navBackToGames()}>&#8592; Games</div>
        <div className='text-center'>
          <h3>{currentGame?.name}</h3>
        </div>
          {currentGame?.complete ? 
            <>
              <Table striped className='text-center mb-5'>
                <thead>
                  <tr>
                    <th>Player Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activePlayers.length > 0 && (
                    activePlayers.map(player => {
                        let status = "Winner";
                        let color = "green";

                      return(
                        <tr key={player._id} className="row-winner">
                          <td>{player.player}</td>
                          <td style={{color: color}}>{status}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </Table>

            </>
            :
              // ACTIVE PLAYERS TABLE 
              <Table striped hover className='text-center mb-5'>
                <thead>
                  <tr>
                    <th>Player Name</th>
                    {/* <th>Targeting</th>
                    <th>Item To Use</th>
                    <th>Place To Kill</th> */}
                    <th>Status</th>
                    <th>Eliminate</th>

                  </tr>
                </thead>
                <tbody>
                  {activePlayers.length > 0 && (
                    activePlayers.map(player => {
                        let status = "Active";
                        let color = "green";

                      return(
                        <tr key={player._id} className='row-hover'>
                          <td onClick={() => {navToActivePlayer(player)}}>{player.player}</td>

                          {/* <td>{player.target}</td>
                          <td><small>{player.itemToUse}</small></td>
                          <td><small>{player.placeToKill}</small></td> */}

                          <td style={{color: color}}
                          onClick={() => {navToActivePlayer(player)}}
                          >{status}</td>

                          <td>
                            <Button onClick={() => eliminatePlayer(player)}
                            variant="outline-danger"
                            >Eliminate</Button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </Table>
          }

            <br></br>

            <div className='m-4 text-center'>
              <h4>Players Who Got Rekt</h4>
            </div>
            
            {/* ELIMINATED PLAYERS TABLE */}

            <Table striped className='text-center'>
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {eliminatedPlayers.length > 0 && (
                  eliminatedPlayers.map(player => {
                      let status = "Eliminated";
                      let color = "#dc3545";
  
                      return(
                        <tr key={player._id}>
                          <td>{player.player}</td>
                          <td><small>Got rekt by <b>{player.targetedBy}</b> with a <b>{player.itemToUse}</b> in the <b>{player.placeToKill}</b></small></td>
                          <td style={{color: color}}>{status}</td>
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

export default SingleGame;
