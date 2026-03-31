import { useRef, useState, useEffect } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [availablePlaces,setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState([]);

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
    modal.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current.close();
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
    modal.current.close();
  }

  return (
    <>
      <Modal ref={modal}>
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
