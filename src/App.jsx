import { useRef, useState, useEffect } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];

const storedPlaces = storedIds.map(id =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  
  
  const selectedPlace = useRef();
 const [modalISOpen, setModalIsOpen]=  useState(false)
  const [availablePlaces,setAvailablePlaces] = useState([]);
 const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

useEffect(() =>{
     //navigator provided by the browser to get the user's location we are using here the callback funcn 
  //as the location will be fetched and provided in a couple of seconds


  //we have added this to the useEffect and it will not be in infinite loop as this will be executed 
  //MOST IMPORTANT after every component execution This will be executed only after the app component function executes completely
  navigator.geolocation.getCurrentPosition((position)=>{
    const sortedPlaces=sortPlacesByDistance(AVAILABLE_PLACES,
      position.coords.latitude,
      position.coords.longitude
    );
    setAvailablePlaces(sortedPlaces);
  });
},[]);
  



  function handleStartRemovePlace(id) {
    setModalIsOpen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
   setModalIsOpen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
   const storedIds = JSON.parse( localStorage.getItem('selectedPlaces')) || [];
   if(storedIds.indexOf(id) ===-1){
    localStorage.setItem('selectedPlaces',JSON.stringify([id,...storedIds])
    );
   }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false)
    const storedIds = JSON.parse( localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem('selectedPlaces',JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current )))
  }

  return (
    <>
      <Modal  open={modalISOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={AVAILABLE_PLACES}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
