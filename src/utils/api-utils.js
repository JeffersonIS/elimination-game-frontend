export function formatObject(objName, secretName, type){
    let obj
    if(type === "player"){
        obj = {
            name: objName,
            secretCode: secretName,
            totalPlayersEliminated: 0,
            gamesWon: 0,
        }
    } else {
        obj = {
            name: objName,
        }
    }
    return obj;
}