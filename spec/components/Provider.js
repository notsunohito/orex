import React from 'react'
import {expect} from 'chai'
import {shallow} from 'enzyme'
import {createStore, Provider} from '../../src/'


const HelloWorld = ({state, action})=> (
    <div>
        <p>{state.message}</p>
        <Button onClick={()=>action.message.update('Bye!')}/>
    </div>
)

describe('components', ()=> {
    describe('Provider', ()=> {
        it('Provides props{store, action} for child component', ()=> {
            const store = createStore({message: 'Hi!'})
            const wrapper = shallow(
                <Provider store={store}>
                    <HelloWorld />
                </Provider>
            )
            const {state, action} = wrapper.find(HelloWorld).props()
            expect(state.message).to.equal('Hi!')
            expect(action.message.update).to.be.a('function');
        })

        it('Allows you to pass the mapStoreToProps', ()=> {
            const store = createStore({message: 'Hi!'})
            const mapStoreToProps = (store)=>{
                return {
                    data: store.getState(),
                    proxy: store.getAction()
                }
            }
            const wrapper = shallow(
                <Provider store={store} mapStoreToProps={mapStoreToProps}>
                    <HelloWorld />
                </Provider>
            )
            const {data, proxy} = wrapper.find(HelloWorld).props()
            expect(data.message).to.equal('Hi!')
            expect(proxy.message.update).to.be.a('function');
        })
    })
})
