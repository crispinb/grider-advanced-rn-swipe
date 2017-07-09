//  Crispin Bennett ${Date}import React from 'react';
import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;


class Deck extends Component {
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove:
          (event, gesture) => {
            // We're setting the absolute x/y to the gesture's
            // x/y diffs.
            // I presume this works because not setting a default in
            // new Animated.ValueXY() implicitly defines the starting
            // position as 0,0 ?
            position.setValue({ x: gesture.dx, y: gesture.dy })
          }
        ,
        onPanResponderRelease: (event, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            this.forceSwipe('right');
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            this.forceSwipe('left');
          } else {
            this.resetPosition();
          }
        }
      })
    ;

    // Grider puts the panResponder in state to follow convention
    // but this is more parsimonious
    this.panResponder = panResponder;
    this.position = position;
  }

  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(this.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start();
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  componentWillMount() {
  }

  render() {
    return (
      < Animated.View>
        {this.renderCards()
        }
      </
        Animated.View>
    )
      ;
  }

  getCardStyle() {
    const position = this.position;
    const rotate = position.x.interpolate({
      inputRange: [ -SCREEN_WIDTH * 1.5, 0, +SCREEN_WIDTH * 1.5 ],
      outputRange: [ '-120deg', '0deg', '120deg' ]
    });

    return {
      ...position.getLayout(),
      transform: [ { rotate } ]
    };
  }

  renderCards() {
    return this.props.data.map((item, index) => {
      // temporarily limiting animation to the first visible card
      if (index === 0
      ) {
        return (
          < Animated.View
            key={item.id
            }
            {...
              this.panResponder.panHandlers
            }
            style={this.getCardStyle()
            }
          >
            {
              this.props.renderCard(item)
            }
          </
            Animated.View>
        )
      }
      return this.props.renderCard(item);
    })
  }
}


const styles = {};

export default Deck;