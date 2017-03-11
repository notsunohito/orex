import React, {Component} from 'react'


export default class Provider extends Component {
    constructor(props) {
        super(props)
        this.state = props.store.getState()
        this.action = props.store.getAction()
        props.store.subscribe((nextState)=> {
            this.setState(nextState)
        })
    }
    render() {
        return React.createElement(
            this.props.children.type,
            {
                state: this.state,
                action: this.action
            },
            null
        )
    }
}
