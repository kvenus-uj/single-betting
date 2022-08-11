import logo from './logo.svg';
import './App.css';
import { Button, Col, Row, Dropdown, DropdownButton, Form } from "react-bootstrap";
import { useRef, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
function App() {
  const amount = useRef();
  const [side, setSide] = useState("FRONT");
  function onChange(val){

    if(val==="front"){
      setSide("FRONT");
    } else if(val==="back"){
      setSide("BACK");
    }
    
  }
  const bet = async () => {
    console.log('bet: ', amount.current.value);
  }
  const start = async () => {
    console.log('Start betting...');
  }
  return (
    <div className="App">
      <header className="App-header">
        <WalletMultiButton className="wallet-btn"/>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This is simple betting test UI.
        </p>
        <Row>
        <Col>
          <Form.Control
            type="number"
            ref={amount}
            placeholder="SOL for Betting"
          />
        </Col>
        <Col>
          <Button
            type="submit"
            onClick={bet}
          >Bet
          </Button>
        </Col>
        <Col>
          <DropdownButton title={side} onSelect={(evt) => onChange(evt)}>
            <Dropdown.Item eventKey="front">FRONT</Dropdown.Item>
            <Dropdown.Item eventKey="back">BACK</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col>
          <Button
            type="submit"
            onClick={start}
          >Start!
          </Button>
        </Col>
      </Row>
      </header>
    </div>
  );
}

export default App;
