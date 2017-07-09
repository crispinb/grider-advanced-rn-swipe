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
      <Animated.View>
        {this.renderCards()}
      </Animated.View>
    );
  }

  renderCards() {
    return this.props.data.map((item, index) => {
      // temporarily limiting animation to the first visible card
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            {...this.panResponder.panHandlers}
            style={this.position.getLayout()}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        )
      }
      return this.props.renderCard(item);
    })
  }
}


const styles = {};

export default Deck;