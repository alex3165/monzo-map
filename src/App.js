import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import config from "./monzo.json";
import Sidepan from './Sidepan';
import { Motion, spring } from 'react-motion';
import moment from 'moment';
import { filter } from 'lodash';

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

const sidepanWidth = 500;

const styles = {
  sidepan: {
    width: sidepanWidth,
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    borderRight: '1px solid rgb(80%, 80%, 80%)'
  }
}

class App extends Component {

  state = {
    transactions: {},
    selected: [],
    closed: false,
    dateFilter: []
  };

  componentWillMount() {
    getTransactions().then(({ transactions }) => {
      const formattedTransaction = transactions
      .sort((tr1, tr2) => {
        const res = moment(tr1.created).isBefore(moment(tr2.created));
        return res ? 1 : -1;
      })
      .reduce((acc, next) => {
        acc[next.id] = next;
        return acc;
      }, {});

      this.setState({ transactions: formattedTransaction });
    });
  }

  onClose = () => {
    this.setState({
      closed: true
    });
  };

  onHover({ map }) {
    map.getCanvas().style.cursor = "pointer";
  }

  onEndHover({ map }) {
    map.getCanvas().style.cursor = "";
  }

  onToggleSelect(transactionId) {
    const { selected } = this.state;
    if (selected.includes(transactionId)) {
      this.setState({
        selected: selected.filter(trId => trId !== transactionId),
        closed: false
      });
    } else {
      this.setState({
        selected: selected.concat(transactionId),
        closed: false
      });
    }
  };

  onDateChange = (dates) => {
    this.setState({
      dateFilter: dates
    });

    console.log(dates);
  };

  render() {
    const { selected, closed, dateFilter } = this.state;
    let { transactions } = this.state;

    console.log(selected);

    if (dateFilter[0] && dateFilter[1]) {
      transactions = filter(transactions, tr => {
        const trDate = moment(tr.created);
        const min = moment(dateFilter[0]);
        const max = moment(dateFilter[1]);

        return trDate.isAfter(min) && trDate.isBefore(max);
      });
    }

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
                      onClick={this.onToggleSelect.bind(this, transaction.id)}/>
                  )
                })
            }
          </Layer>
        </ReactMapboxGl>
        {
            <Motion style={{ x: spring(closed ? - sidepanWidth : 0) }}>
              {
                ({ x }) => (
                  <div style={{
                    ...styles.sidepan,
                    transform: `translate3d(${x}px, 0, 0)`,
                    WebkitTransform: `translate3d(${x}px, 0, 0)`
                  }}>
                    <Sidepan
                      transactions={transactions}
                      selected={selected}
                      onToggleSelect={this.onToggleSelect.bind(this)}
                      onClose={this.onClose}
                      onDateChange={this.onDateChange}/>
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
