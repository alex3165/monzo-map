import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import config from "./monzo.json";
import Sidepan from './Sidepan';
import { Motion, spring } from 'react-motion';

const containerStyle = {
  height: "100vh",
  width: "100%"
};

function getTransactions() {
  const req = new Request(`https://api.monzo.com/transactions?expand[]=merchant&account_id=${config.accountId}`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${config.accessToken}`
    })
  });

  return fetch(req).then(res => res.json());
}

const styles = {
  sidepan: {
    width: 400,
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0
  }
}

class App extends Component {

  state = {
    transactions: {},
    selected: null
  };

  componentWillMount() {
    getTransactions().then(({ transactions }) => {
      const formattedTransaction = transactions.reduce((acc, next) => {
        acc[next.id] = next;
        return acc;
      }, {});

      this.setState({ transactions: formattedTransaction });
    });
  }

  onClose = () => {
    this.setState({
      selected: null
    });
  };

  onHover({ map }) {
    map.getCanvas().style.cursor = "pointer";
  }

  onEndHover({ map }) {
    map.getCanvas().style.cursor = "";
  }

  onMarkerClick(transaction) {
    this.setState({
      selected: transaction.id
    });

    console.log(transaction);
  }

  render() {
    const { selected, transactions } = this.state;

    return (
      <div>
        <ReactMapboxGl
          accessToken="pk.eyJ1IjoiYWxleDMxNjUiLCJhIjoiY2l4b3V1YjgxMDAxZzMycG94ajRydGJ2ciJ9.ENIGGEe_9pIKS3hZFY9teg"
          style="mapbox://styles/alex3165/cixouinss00332smv840072s6"
          containerStyle={containerStyle}>
          <Layer
            type="symbol"
            layout={{ "icon-image": "marker-15" }}>
            {
              Object.keys(transactions)
                .filter(tr => !!transactions[tr].merchant)
                .map((transactionId) => {
                  const transaction = transactions[transactionId];

                  return (
                    <Feature
                      key={transactionId}
                      coordinates={[transaction.merchant.address.longitude, transaction.merchant.address.latitude]}
                      onHover={this.onHover}
                      onEndHover={this.onEndHover}
                      onClick={this.onMarkerClick.bind(this, transaction)}/>
                  )
                })
            }
          </Layer>
        </ReactMapboxGl>
        {
            <Motion style={{ x: spring(selected ? 0 : -400) }}>
              {
                ({ x }) => (
                  <div style={{
                    ...styles.sidepan,
                    transform: `translate3d(${x}px, 0, 0)`,
                    WebkitTransform: `translate3d(${x}px, 0, 0)`
                  }}>
                    <Sidepan transaction={transactions[selected]} onClose={this.onClose}/>
                  </div>
                )
              }
            </Motion>
        }
      </div>
    );
  }
}

export default App;
