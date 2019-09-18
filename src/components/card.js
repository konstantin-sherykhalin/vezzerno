import React from 'react';
import {Animated,Easing,Dimensions,PanResponder,FlatList,ScrollView,Text,TouchableWithoutFeedback,View} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
	container: {
		position: 'absolute', left: 0, top: 0,
		width: '100%',
		backgroundColor: '#ecedf1',
	},

	edge: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 20, width: '100%',
	},
	edge_button: {
		height: 4, width: 26,
		borderRadius: 3,
		backgroundColor: '#6c6f88',
	},

	card_list: {
		flex: 1,
		marginHorizontal: 12,
	},
	card: {
		position: 'relative',
		width: '100%',
		padding: 10,
		borderRadius: 8,
		backgroundColor: '#fff',
        shadowOffset: {height:0,width:0},
        shadowRadius: 20,
		shadowOpacity: 1,
        shadowColor: "rgba(103,116,150,0.13)",
        elevation: 1,
	},
	card_tick: {
		position: 'absolute', top: 3, left: 3,
		height: 13, width: 13,
		borderRadius: 8,
		backgroundColor: '#5fc8ed',
	},
	card_title: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignSelf: 'center',
		width: '100%',
		paddingHorizontal: 9,
	},
	card_title_element: {
		alignItems: 'center',
		width: 110,
	},
	card_title_element_main: {
		fontSize: 15,
		lineHeight: 19,
	},
	card_title_element_sub: {
		color: '#6c6f88',
		fontSize: 10,
		lineHeight: 12,
	},
	card_title_separator: {
		height: 34, width: 1,
		backgroundColor: '#bfbfbf',
	},
	card_address: {
		paddingVertical: 12, paddingHorizontal: 10,
	},
	card_address_element: {
		flexDirection: 'row',
		alignItems: 'baseline',
	},
	card_address_element_icon: {
		height: 10, width: 10,
		marginRight: 10,
		borderRadius: 5,
		backgroundColor: '#bebfce',
	},
	card_address_element_text: {
		flex: 1,
		color: '#6c6f88',
		fontSize: 14,
		lineHeight: 17,
	},
	card_date: {
		marginHorizontal: 32,
	},
	card_date_text: {
		color: '#6c6f88',
		fontSize: 12,
		lineHeight: 14,
	},

	separator: {
		height: 10,
	},
});

const window_height	= Dimensions.get('window').height;
const base_height	= 225;
const base_top   	 = 100;

export default class Card extends React.Component {
	state = {
		top: window_height-base_height,
		height: base_height,
		position: 0,
	};
	// top = new Animated.Value(window_height-base_height);
	pan_responder = PanResponder.create({
		// onStartShouldSetPanResponder:			(e,gesture_state) => true,
		// onStartShouldSetPanResponderCapture:	(e,gesture_state) => true,
		onMoveShouldSetPanResponder:			(e,gesture_state) => true,
		onMoveShouldSetPanResponderCapture:		(e,gesture_state) => true,
		// onPanResponderGrant: (e,gesture_state) => {},
		onPanResponderMove: //Animated.event([null,{moveY:this.state.top}]),
		(e,gesture_state) => {
			// console.log(JSON.stringify(gesture_state,null,4));
			if(gesture_state.moveY>base_top && gesture_state.moveY<window_height-base_height) {
				this.setState({top:gesture_state.moveY,height:window_height-gesture_state.moveY});
				// this.top = new Animated.Value(gesture_state.moveY);
			}
		},
		onPanResponderRelease: (e,gesture_state) => {
			// console.log(gesture_state.moveY);
			// Сверху
			if(this.state.position) {
				if(gesture_state.moveY>base_top) {
					this.setState({position:0,top:window_height-base_height,height:base_height});
				}

			// Снизу
			} else {
				if(gesture_state.moveY<Dimensions.get('window').height-base_height) {
					this.setState({position:1,top:base_top,height:Dimensions.get('window').height-base_top});
				}
			}
		},
	});

	render() {
		let {props,state} = this;
		// console.log(props.list[0]);

		return (
			<View style={[styles.container,{top:state.top,height:state.height}]}>
				<View style={styles.edge} {...this.pan_responder.panHandlers}>
					<View style={styles.edge_button} />
				</View>
				<FlatList
					contentContainerStyle={styles.card_list}
					data={props.list}
					renderItem={({item}) => (
						<View style={styles.card}>
							<View style={styles.card_tick} />
							<View style={styles.card_title}>
								<View style={styles.card_title_element}>
									<Text style={styles.card_title_element_main}>{item.cargo.type.name}</Text>
									<Text style={styles.card_title_element_sub}>{item.cargo.weight} т</Text>
								</View>
								<View style={styles.card_title_separator} />
								<View style={styles.card_title_element}>
									<Text style={styles.card_title_element_main}>{item.direction.distance} км</Text>
								</View>
								<View style={styles.card_title_separator} />
								<View style={styles.card_title_element}>
									<Text style={styles.card_title_element_main}>{item.payment.price} {item.payment.type.name}</Text>
									<Text style={styles.card_title_element_sub}>{item.payment.price_per_km} {item.payment.type.name}/км</Text>
								</View>
							</View>
							<View style={styles.card_address}>
								<View style={styles.card_address_element}>
									<View style={styles.card_address_element_icon} />
									<Text style={styles.card_address_element_text} numberOfLines={1}>{item.direction.from.address}</Text>
								</View>
								<View style={styles.card_address_element}>
									<View style={styles.card_address_element_icon} />
									<Text style={styles.card_address_element_text} numberOfLines={1}>{item.direction.to.address}</Text>
								</View>
							</View>
							<View style={styles.card_date}>
								<Text style={styles.card_date_text}>{item.delivery_time.from} — {item.delivery_time.to}</Text>
							</View>
						</View>
					)}
					ItemSeparatorComponent={_ => (<View style={styles.separator} />)}
					keyExtractor={item => item.id}
				/>
			</View>
		);
	}
}
