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
    merchant: {
      marginBottom: 0
    },
    controlPanel: {},
    transaction: {
        width: 440,
        height: 60,
        border: '1px solid rgb(80%, 80%, 80%)',
        borderRadius: 5,
        margin: '10px auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 10px',
        cursor: 'pointer'
    },
    selected: {
        border: '1px solid #42A3F7',
    },
    transactionsContainer: {
        overflow: 'auto',
        height: 500
    },
    negativeAmount: {
      color: '#F06452'
    },
    positiveAmount: {
      color: '#4DEAAB'
    }
}

class Sidepan extends Component {
    render() {
        const { onClose, onDateChange, transactions, selected, onToggleSelect } = this.props;
        const sortedKeys = Object.keys(transactions).reduce((acc, next) => {
            if (selected.includes(next)) {
                acc.unshift(next);
            } else {
                acc.push(next)
            }

            return acc;
        }, []);

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
                        sortedKeys.map(trId => {
                            const tr = transactions[trId];

                            return (
                                <div
                                    key={trId} 
                                    style={{
                                        ...styles.transaction,
                                        ...(selected.includes(trId) && styles.selected)
                                    }}
                                    onClick={onToggleSelect.bind(this, trId)}>
                                    <h4 style={styles.merchant}>{ tr.merchant && tr.merchant.name }</h4>
                                    <div style={{
                                      ...(tr.amount > 0 ? styles.positiveAmount : styles.negativeAmount)
                                    }}>{ tr.amount * 0.01 } £</div>
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
