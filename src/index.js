import React from "react"
import { render } from "react-dom"
import { Observable, BehaviorSubject } from "rxjs"
import {
  setObservableConfig,
  createEventHandler,
  mapPropsStream
} from "recompose"
import rxjsConfig from "recompose/rxjsObservableConfig"
import * as R from "ramda"
setObservableConfig(rxjsConfig)

//wow, did that just actually work...

const {
  handler: setState,
  stream: setState$
} = createEventHandler()

const {
  handler: input,
  stream: input$
} = createEventHandler()

const addMessage = () => setState({ message: "great" })

const onInput = event => input({ text: event.target.value })

const onInput$ = input$.delay(2000)

const state$ = setState$
  .merge(onInput$)
  .startWith({
    message: "hello",
    addMessage,
    onInput
  })
  .scan(R.merge)

const log = console.log.bind(console)

const propsAndState = mapPropsStream(props$ =>
  props$.combineLatest(state$, R.merge)
)

const App = props => (
  <div>
    <div>{props.message}</div>
    <button onClick={props.addMessage}>Set State</button>
    <div>{JSON.stringify(props)}</div>
    <input type="text" onInput={props.onInput} />
    <div>{props.text}</div>
  </div>
)

const StreamApp = propsAndState(App)

render(<StreamApp />, document.getElementById("root"))
