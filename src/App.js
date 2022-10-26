import axios from 'axios'
import './App.css';
import {React, useEffect} from 'react';
import {useSetRecoilState} from 'recoil';
import {
  playerDataState, 
  itemDataState, 
  placeDataState, 
  allGamesDataState,
  activePlayersDataState
} from './recoilState/stateTemplates';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Games from './views/Game/Games';
import SingleGame from './views/Game/SingleGame'
import Edit from './views/Edit/Edit'
import CreateNewGame from './views/Game/CreateNewGame';
import NavigationBar from './nav/NavigationBar'
import ActivePlayer from './views/ActivePlayer/ActivePlayer';
import {SERVER_URL} from './utils/global-vars';


function App() {
  const setPlayerData = useSetRecoilState(playerDataState);
  const setItemData = useSetRecoilState(itemDataState);
  const setPlaceData = useSetRecoilState(placeDataState);
  const setAllGames = useSetRecoilState(allGamesDataState);
  const setActivePlayers = useSetRecoilState(activePlayersDataState);
  const PLAYER = 'player';
  const ITEM = 'item';
  const PLACE = 'place';
  const entities = [PLAYER, ITEM, PLACE];

  const getData = async () => {
    getAllGames();
    getAllActivePlayers();
    getPlayersItemsPlaces();
  }

  function getPlayersItemsPlaces() {
    entities.map(async (string) => {
      await axios.get(`${SERVER_URL}/${string}`)
      .then(res => res.data)
      .then(json => {
          string === PLAYER ? setPlayerData(json) : string === ITEM ? setItemData(json) : setPlaceData(json);
      })
      .catch((error) => {console.log(error)})
    });
  }

  async function getAllGames (){
    await axios.get(`${SERVER_URL}/allgames`)
    .then(res => res.data)
    .then(json => { setAllGames(json) })
    .catch((error) => {console.log(error)
    });
  }

  async function getAllActivePlayers(){
    await axios.get(`${SERVER_URL}/activeplayers`)
    .then(res => {
      return res.data
    })
    .then(json => { setActivePlayers(json) })
    .catch((error) => {console.log(error)
    });
  }
  
  useEffect(() => {
      getData();
  })


  return (
    <>
      <NavigationBar/>
      <BrowserRouter>
      <Routes>
        <Route  path="/manage-data" element={<Edit getPlayersItemsPlaces={getPlayersItemsPlaces}/>} exact />
        <Route  path="/game/:id" element={<SingleGame getAllActivePlayers={getAllActivePlayers}/>} exact />
        <Route  path="/game/:id/:player" element={<ActivePlayer getAllActivePlayers={getAllActivePlayers}/>} exact />
        <Route  path="/game/create-new-game" element={<CreateNewGame/>} exact />
        <Route  path="/" element={<Games getAllGames={getAllGames} getAllActivePlayers={getAllActivePlayers}/>} exact />
      </Routes>
    </BrowserRouter>
      </>
  );
}

export default App;