//  Crispin Bennett ${Date}import React from 'react';
import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder
} from 'react-native';

class Deck extends Component {
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // We're setting the absolute x/y to the gesture's
        // x/y diffs.
        // I presume this works because not setting a default in
        // new Animated.ValueXY() implicitly defines the starting
        // position as 0,0 ?
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: () => {
      }
    });

    // Grider puts the panResponder in state to follow convention
    // but this is more parsimonious
    this.panResponder = panResponder;
    this.position = position;
  }

  componentWillMount() {
  }

  render() {
    return (
      // We will eventually be wiring the panResponder to individual
      // cards.
      <Animated.View
        style={this.position.getLayout()}
        {...this.panResponder.panHandlers}>
        {this.renderCards()}
      </Animated.View>
    );
  }

  renderCards() {
    return this.props.data.map(item => {
      return this.props.renderCard(item);
    })
  }
}


const styles = {};

export default Deck;