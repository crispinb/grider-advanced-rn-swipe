//  Crispin Bennett ${Date}import React from 'react';
import React, { Component } from 'react';
import { View, Animated } from 'react-native';

class Deck extends Component {

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