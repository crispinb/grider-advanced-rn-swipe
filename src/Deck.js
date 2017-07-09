//  Crispin Bennett ${Date}import React from 'react';
import React, { Component } from 'react';
import {
  View, Animated,
  PanResponder
} from 'react-native';

class Deck extends Component {
  constructor(props){
    super(props);
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        console.log(gesture);
      },
      onPanResponderRelease: () => {}
    });

    // Grider puts the panResponder in state to follow convention
    // but this is more parsimonious
    this.panResponder = panResponder;
  }

  componentWillMount() {
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
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