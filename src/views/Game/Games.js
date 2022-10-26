import React, { useEffect } from 'react';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { useNavigate  } from 'react-router-dom';
import { allGamesDataState } from '../../recoilState/stateTemplates';
import {  useRecoilValue } from 'recoil';
import { deleteGame, deleteActivePlayers, filterActiveGames, filterFinishedGames } from './game-utils';
import './gameStyles.css';

function Games(props) {
  const allGamesData = useRecoilValue(allGamesDataState);
  let navigate = useNavigate();
  let getAllGames = props.getAllGames;
  let getAllActivePlayers = props.getAllActivePlayers;

  const activeGames = allGamesData.filter(filterActiveGames);
  const finishedGames = allGamesData.filter(filterFinishedGames);

  function deleteItem(gameNumber){
    if(window.confirm('Deleting a game cannot be undone. Do you want to proceed?')){
      //delete game and all active players associated with it
      deleteActivePlayers(gameNumber);
      deleteGame(gameNumber, props.getAllGames);
    }
  }

  function navToGame(game){
    navigate(`game/${game.gameNumber}`)
  }

  useEffect(() => {
    getAllGames();
    getAllActivePlayers();
}, [getAllGames, getAllActivePlayers])

  return (
    <>
        <div className="App">
        <div className='table-container'>

            <Row>
              <Col className='align-right mb-3 mt-2'>
                <Button variant="success" className='mt-2' href='game/create-new-game'>+ Create New Game</Button>
              </Col>
            </Row>
            
          <div className='table-width-big'>

            <header >
              <h3 className='mt-2'>Active Games</h3>
              <p className='mb-4'><small>All active and current games are shown. Click on a game to view standings.</small></p>
            </header>

            <Table  striped hover >
              <thead>
                <tr>
                  <th>Game</th>
                  <th>No. Players</th>
                  <th>Status</th>
                  {/* <th>Delete</th> */}
                </tr>
              </thead>
              <tbody>
              {activeGames.length > 0 ?
                activeGames.map(game => {
                  let status, color;
                  if(game.complete){
                    status = "Finished";
                    color = "green";
                  } else {
                    status = "In Progress";
                    color = "#ecab38";
                  }

                  return(
                    <tr key={game._id} className='row-hover'>
                      <td onClick={() => {navToGame(game)}}>{game.name}</td>
                      <td>{game.numPlayers}</td>
                      <td style={{color: color}} onClick={() => {navToGame(game)}}>
                        {status}
                      </td>

                      {/* <td>
                        <Button onClick={() => deleteItem(game.gameNumber)}
                        variant="outline-secondary"
                        >Delete</Button>
                      </td> */}
                    </tr>
                  )
                })
                :
                <tr>
                  <td colSpan={4}>No Games To Display</td>
                </tr>
              }
              </tbody>

            </Table>
            </div>
            <div className='table-width-big'>

            <br></br>

            <header >
              <h3 className='mt-5 mb-4'>Finished Games</h3>
            </header>

            <Table  striped hover >
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Status</th>
                  <th>Winner</th>
                  <th>Delete</th>

                </tr>
              </thead>
              <tbody>
              {finishedGames.length > 0 ?
                finishedGames.map(game => {
                  let status, color;
                  if(game.complete){
                    status = "Finished";
                    color = "green";
                  } else {
                    status = "In Progress";
                    color = "#ecab38";
                  }
                  return(
                    <tr key={game._id} className='row-hover'>
                      <td onClick={() => {navToGame(game)}}>{game.name}</td>
                      <td style={{color: color}} onClick={() => {navToGame(game)}}>
                        {status}
                      </td>
                      <td onClick={() => {navToGame(game)}}>{game.winner}</td>
                      <td>
                        <Button onClick={() => deleteItem(game.gameNumber)}
                        variant="outline-secondary"
                        >Delete</Button>
                      </td>
                    </tr>
                  )
                })
                :
                <tr>
                  <td colSpan={5}>No data</td>
                </tr>
              }
              </tbody>

            </Table>

            </div>
        </div>
      </div>
      </>
  );
}

export default Games;