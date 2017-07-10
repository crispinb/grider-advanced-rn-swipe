//  Crispin Bennett ${Date}import React from 'react';
import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;


class Deck extends Component {
  // https://facebook.github.io/react/docs/react-component.html#defaultprops
  // an alternative would be https://www.npmjs.com/package/prop-types to type-check
  // prop types automatically, we may not want these callbacks to be compulsory
  static defaultProps = {
    // prevent crashes if the user doesn't supply the callback functions
    onSwipeRight: () => {
    },
    onSwipeLeft: () => {
    },
    renderNoMoreCards: () => {
    }
  };

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
    // index of the currently swipable item
    this.state = { index: 0 };
  }

  componentWillUpdate() {
    // workaround for android
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    LayoutAnimation.spring();
  }

  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(this.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[ this.state.index ];

    // SG uses a ternary here. Don't like. Ternaries are for expressions not statements IMO
    if (direction === 'right') {
      onSwipeRight(item);
    } else {
      onSwipeLeft(item);
    }

    // position currently has the value of the just-swiped card, so reset it
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
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
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, arrayIndex) => {
      if (arrayIndex < this.state.index) {
        return null;
      }

      if (arrayIndex === this.state.index) {
        return (
          < Animated.View
            key={item.id}
            {...this.panResponder.panHandlers}
            style={[ this.getCardStyle(), styles.cardStyle ]}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        )
      }

      return (
        // This could just be a View. But when it gets to the top of the stack,
        // the Card gets wrapped by an Animated.View, which forces rerendering
        // of the image. This can cause the newly-revealed card to flash
        <Animated.View
          key={item.id}
          style={[ styles.cardStyle, { top: 10 * (arrayIndex - this.state.index) } ]}>
          {this.props.renderCard(item)}
        </Animated.View>
      )
      // render cards with the lowest-indexed on top
    }).reverse()
  }
}


const styles = {
  cardStyle: {
    // enable stacking the cards rather than vertically listing
    position: 'absolute',
    width: SCREEN_WIDTH
  }
};

export default Deck;