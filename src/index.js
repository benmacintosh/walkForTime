import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAahXkgMEG6si7KMLfL1S9N-GKmv6SQLow&sensor=false&libraries=places&callback=placesSearch"
        async defer></script>
        
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
