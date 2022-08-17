import logo from './logo.svg';
import './App.css';
import { Button, Col, Row, Dropdown, DropdownButton, Form } from "react-bootstrap";
import { useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { allStart, determine, init, solBet } from './utiles'
function App() {
  const amount = useRef();
  const wallet = useWallet();
  const [side, setSide] = useState(true);
  const [title, setTitle] = useState("FRONT");
  function onChange(val){

    if(val==="front"){
      setTitle("FRONT");
      setSide(true);
    } else if(val==="back"){
      setTitle("BACK");
      setSide(false);
    }
    
  }
  const bet = async () => {
    //await init(wallet);
    await solBet(wallet, side, amount.current.value*1000);
    console.log('bet: ', amount.current.value);
  }
  const start = async () => {
    await determine(wallet);
    console.log('Start betting...');
  }
  const myBet = async () => {
    await allStart(wallet, side, amount.current.value*1000);
    console.log('bet: ', amount.current.value,'at ', side);
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
        {/* <Col>
          <Button
            type="submit"
            onClick={bet}
          >Bet
          </Button>
        </Col> */}
        <Col>
          <DropdownButton title={title} onSelect={(evt) => onChange(evt)}>
            <Dropdown.Item eventKey="front">FRONT</Dropdown.Item>
            <Dropdown.Item eventKey="back">BACK</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col>
          <Button
            type="submit"
            onClick={myBet}
          >Bet!
          </Button>
        </Col>
      </Row>
      </header>
    </div>
  );
}

export default App;
