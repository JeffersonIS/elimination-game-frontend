import React from 'react';
import EditTable from './EditTable';
import axios from 'axios'
import {playerDataState, itemDataState, placeDataState} from '../../recoilState/stateTemplates';
import { useRecoilState } from 'recoil';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import {SERVER_URL} from '../../utils/global-vars';
  
function Edit(props) {
    const PLAYER = 'player';
    const ITEM = 'item';
    const PLACE = 'place';
    const entities = [PLAYER, ITEM, PLACE];
    const [activeTab, setActiveTab] = React.useState(PLAYER); 
    const [playerData, setPlayerData] = useRecoilState(playerDataState);
    const [itemData, setItemData] = useRecoilState(itemDataState);
    const [placeData, setPlaceData] = useRecoilState(placeDataState);
    const [formValues, setFormValues] = React.useState(''); 

    let toggle = function(event){
        setActiveTab(event);
        setFormValues('');
    }

    const getData = async () => {
        entities.map(async (string) => {
            await axios.get(`${SERVER_URL}/${string}`)
            .then(res => res.data)
            .then(json => {
                string === PLAYER ? setPlayerData(json) : string === ITEM ? setItemData(json) : setPlaceData(json);
            })
            .catch((error) => {console.log(error)})
        });
      }

    const changeTab = (string) => {
        toggle(string);
    }

    return (
    <div className='text-center mt-4'>
        <Container className='text-center nav-container'>
            <Nav className="auto nav-container nav-manage">
                <Nav.Link className='m-2' onClick={() => {changeTab(PLAYER)}}>Players </Nav.Link>
                <Nav.Link className='m-2' onClick={() => {changeTab(ITEM)}}>Items </Nav.Link>
                <Nav.Link className='m-2' onClick={() => {changeTab(PLACE)}}>Places </Nav.Link>
            </Nav>
        </Container>

        {/* <div className='text-center nav-manage'>
            <a className='m-2' onClick={() => {changeTab(PLAYER)}}>Players </a>
            <a className='m-2' onClick={() => {changeTab(ITEM)}}>Items </a>
            <a className='m-2' onClick={() => {changeTab(PLACE)}}>Places </a>
        </div> */}
        {activeTab === PLAYER ? 
            <EditTable 
            getPlayersItemsPlaces={props.getPlayersItemsPlaces}
            type={activeTab} 
            data={playerData} 
            formValues={formValues} 
            getData={getData}/>
        : activeTab === ITEM ?
            <EditTable 
            getPlayersItemsPlaces={props.getPlayersItemsPlaces}
            type={activeTab} 
            data={itemData} 
            formValues={formValues} 
            getData={getData}/>
        :
            <EditTable 
            getPlayersItemsPlaces={props.getPlayersItemsPlaces}
            type={activeTab} 
            data={placeData} 
            formValues={formValues} 
            getData={getData}/>
        }
        <div>

        </div>
    </div>
  );
}

export default Edit;
