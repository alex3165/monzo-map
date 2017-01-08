import React, { Component } from 'react';
import { DateRangePicker } from "@blueprintjs/datetime";
import '@blueprintjs/datetime/dist/blueprint-datetime.css';
import './datetime.css';

const styles = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    controlPanel: {},
    transaction: {
        width: 440,
        height: 60,
        border: '1px solid rgb(80%, 80%, 80%)',
        borderRadius: 5,
        margin: 'auto'
    },
    transactionsContainer: {
        overflow: 'auto',
        height: 500
    }
}

class Sidepan extends Component {
    render() {
        const { onClose, onDateChange, transactions } = this.props;

        return (
            <div style={styles.container}>
                <div style={styles.controlPanel}>
                    <div onClick={onClose}>close</div>
                    <DateRangePicker
                        onChange={onDateChange}
                    />
                </div>
                <div style={styles.transactionsContainer}>
                    {
                        Object.keys(transactions).map(trId => {
                            const tr = transactions[trId].merchant;
                            return (
                                <div key={trId} style={styles.transaction}>
                                {
                                    tr && tr.name
                                }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Sidepan;
