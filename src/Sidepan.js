import React, { Component } from 'react';

const styles = {
    container: {
        width: '100%',
        height: '100%'
    }
}

class Sidepan extends Component {
    render() {
        const { onClose } = this.props;

        return (
            <div style={styles.container}>
                <div onClick={onClose}>close</div>
            </div>
        );
    }
}

export default Sidepan;
