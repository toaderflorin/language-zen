import React, { Component, PropTypes } from 'react'

const stimuli = {
  none: 0,
  left: 1,
  right: 2
}

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: 'Wait...',
      showStimuli: stimuli.none
    }

    this.displaying = false
    this.keyHasBeenPressed = false
    this.displayNextTimeout = null
    this.afterOneSecTimeout = null
    this.showStimuliForMs = 1000.0
    this.history = []

    this.keyPressed = this.keyPressed.bind(this)
    this.displayNext = this.displayNext.bind(this)
    this.afterOneSec = this.afterOneSec.bind(this)
    this.getDelay = this.getDelay.bind(this)
    this.adjustDisplayTime = this.adjustDisplayTime.bind(this)
  }

  componentDidMount() {
    setTimeout(this.displayNext, this.getDelay())
    document.addEventListener("keydown", this.keyPressed);
  }

  displayNext() {
    const leftOrRight = Math.random() < 0.5 ? stimuli.left : stimuli.right

    this.setState({
      showStimuli: leftOrRight
    })

    this.displaying = true
    this.afterOneSecTimeout = setTimeout(this.afterOneSec, 3000)
  }

  getDelay() {
    return Math.random() * 2000 + 100
  }

  afterOneSec() {
    this.setState({
      showStimuli: 0
    })

    if (this.keyHasBeenPressed === false) {
      this.setState({
        message: 'Too late'
      })
    }

    this.displaying = false
    this.keyHasBeenPressed = false

    clearTimeout(this.afterOneSecTimeout)
    clearTimeout(this.displayNextTimeout)

    this.displayNextTimeouot = setTimeout(this.displayNext, this.getDelay())
  }

  adjustDisplayTime() {
    const lastItemsConsidered = 10

    if (this.history.length > lastItemsConsidered) {
      const lastHistory = this.history.slice(this.history.length - lastItemsConsidered)
      const lastHistoryMapped = lastHistory.map((i) => i ? 1 : 0)
      const average = lastHistoryMapped.reduce((a, b) => a + b, 0) / lastItemsConsidered

      console.log('Stats', average, this.showStimuliForMs)

      if (average < 0.75) {
        this.showStimuliForMs *= 1.03
      } else {
        console.log('decreasing')
        this.showStimuliForMs /= 1.03

        if (this.showStimuliFor < 100) {
          this.showStimuliFor = 100
        }
      }
    }
  }

  keyPressed(e) {
    const tooEarly = this.state.showStimuli === stimuli.none;

    if (!this.displaying) {
      this.setState({
        message: 'Be patient!'
      })
    } else {
      this.keyHasBeenPressed = true
      let stimuliForKey = stimuli.none;

      if (e.code === 'KeyG') {
        stimuliForKey = stimuli.left
      } else if (e.code === 'KeyH') {
        stimuliForKey = stimuli.right
      }

      const message = stimuliForKey === this.state.showStimuli ? 'Correct' : 'Incorrect'
      const isCorrect = stimuliForKey === this.state.showStimuli

      this.history.push(isCorrect)
      this.adjustDisplayTime()

      this.displaying = false;
      this.keyHasBeenPressed = false;

      this.setState({
        message,
        showStimuli: stimuli.none
      })
    }

    clearTimeout(this.displayNextTimeout)
    clearTimeout(this.afterOneSecTimeout)

    this.displayNextTimeout = setTimeout(this.displayNext, this.getDelay())
  }

  render() {
    return (
      <div tabIndex="0" className="content" onKeyPress={this.keyPressed}>
        <p>
          {this.state.message}
        </p>

        <div className="stimuli-container">
          <div className="stimuli" style={{visibility: this.state.showStimuli === stimuli.left ? 'visible' : 'hidden' }} ></div>
          <div className="stimuli" style={{visibility: this.state.showStimuli === stimuli.right ? 'visible' : 'hidden' }} ></div>
        </div>
      </div>
    )
  }
}
