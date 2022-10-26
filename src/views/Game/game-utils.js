import axios from "axios";
import { SERVER_URL } from "../../utils/global-vars";

export function setTargets(activePlayers) {
    let array = activePlayers.slice(0);
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    array.forEach((item, count) => {
      if(count === 0){ //the first person in array
        item.target = array[count + 1].player
        item.targetedBy = array[array.length - 1].player
      } else if(count === array.length - 1){ //the last person in array
        item.target = array[0].player
        item.targetedBy = array[count - 1].player
      } else { //middle persons in array
        item.target = array[count + 1].player
        item.targetedBy = array[count - 1].player
      }
    });

    return array;
  } 

export function getRandomNum(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

export function handleAddorRemove (array, event) {
    let exists, i, j;
    
    if(array.length > 0){
      for(i=0; i < array.length; i++)
        if(array[i]._id === event._id){
          exists = true;
          j = i;
          i = array.length;
        }
    }

    if(exists){
      array.splice(j,1);
    } else {
      array.push(event);
    }
    return array;
  }

export function getNewGame(nextGameNumber, numPlayers, gameName) {
  let newGame = {
    gameNumber: nextGameNumber,
    numPlayers: numPlayers,
    winner: "",
    name: gameName,
    complete: false,
  }

  return newGame;
}

export async function postNewGame(newGame){
  await axios.post(`${SERVER_URL}/game`, newGame)
  .then(res => res.data)
  .catch(function (error) {
    console.log(error);
  });
}

export async function postActivePlayers(activePlayers){
  activePlayers.map(async player => {
    await axios.post(`${SERVER_URL}/activeplayer`, player)
    .then(res => res.data)
    .catch(function (error) {
      console.log(error);
    });
  })
}

export function getActivePlayers(allPlayers, gameId){
  let activePlayers = [];
  allPlayers.forEach(player => {  
    if(player.gameNumber === gameId){
      activePlayers.push(player);
    }
  })

  return activePlayers;
}

export async function getActivePlayer(player, gameNumber){
  return await axios.get(`${SERVER_URL}/activeplayer/${player}/${gameNumber}`)
  .then(res => res.data)
  .catch(function (error) {
    console.log(error);
  });
  
}


export async function updatePlayer(player, getAllActivePlayers){
  await axios.put(`${SERVER_URL}/updateactiveplayer`, player)
  .then(function (response) {
    if(response){
      getAllActivePlayers();
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

export async function updateGame(gameId, winner){
  await axios.put(`${SERVER_URL}/updategametocomplete/${gameId}/${winner}`)
  .then(function (response) {
    console.log(response.data)
  })
  .catch(function (error) {
    console.log(error);
  });
}

export async function deleteActivePlayers(gameNumber){
  await axios.post(`${SERVER_URL}/deleteactiveplayers/${gameNumber}`)
  .then(res => res.data)
  .catch(function (error) {
    console.log(error);
  });
}

export async function deleteGame(gameNumber, getAllGames){
  await axios.post(`${SERVER_URL}/deletegame/${gameNumber}`)
  .then(res => {
    getAllGames();
    return res;
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function filterActivePlayers(player) {
  return player.eliminated === false;
}

export function filterEliminatedPlayers(player) {
  return player.eliminated === true;
}

export function filterActiveGames(game) {
  return game.complete === false;
}

export function filterFinishedGames(game) {
  return game.complete === true;
}