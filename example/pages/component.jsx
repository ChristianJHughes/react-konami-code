import React from 'react';
import Konami from 'react-konami-code';

export default class WithComponent extends React.Component {
  easterEgg = () => {
    alert('Hey, you typed the Konami Code!');
  }

  render = () => (
    <React.Fragment>
      <Konami action={this.easterEgg}>
        {"Hey, I'm an Easter Egg! Look at me!"}
      </Konami>
      <div>
        Type the Konami Code:
        <strong>↑ ↑ ↓ ↓ ← → ← → B A</strong>
      </div>
    </React.Fragment>
  )
}
