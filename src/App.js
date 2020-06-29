import React from 'react';
import './App.css';
import CountriesAggregatedChart from './CountriesAggregatedChart.js';
import { Container } from 'react-bootstrap';

function App() {
    return (
        <div className="App">
            <Container style={ { height: '1000px' } }>
                <h1> Wear a mask! </h1>
                <CountriesAggregatedChart/>
            </Container>
        </div>
    );
}

export default App;
