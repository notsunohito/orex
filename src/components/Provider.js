import React, {Component} from 'react'


export default class Provider extends Component {
    constructor(props) {
        super(props)
        this.mapStoreToProps = this.props.mapStoreToProps || defaultMapStoreToProps
        props.store.subscribe((nextState)=> {
            this.setState(nextState)
        })
    }
    render() {
        const childProps = this.mapStoreToProps(this.props.store)
        return React.createElement(
            this.props.children.type,
            childProps,
            null
        )
    }
}

function defaultMapStoreToProps(store) {
    return {
        state: store.getState(),
        action: store.getAction()
    }
}
