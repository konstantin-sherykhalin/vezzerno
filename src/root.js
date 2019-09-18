import React from 'react';
import {Alert,Dimensions,StatusBar,ActivityIndicator,View} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import config from './config';
import API from './services/api';

import Map  from './components/map';
import Card from './components/card';

// Глобальные стили
EStyleSheet.build({
	$scale: 1*Dimensions.get('window').width/config.base_width,
});

// Полоска вверху экрана
StatusBar.setBarStyle('dark-content',true);

const styles = EStyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
});

export default class Root extends React.Component {
	state = {
		card_list: [],
		point_list: [],

		waiting: true,
		error: '',
	};

	async componentDidMount() {
		// await this.setState({waiting:true});
		await Promise.all([
			API('get_cards').then(({response,error}) => {
				if(response) {
					this.setState({card_list:response});
				}
				if(error) {
					console.log(error);
					this.setState({error:error.message});
				}
			}),
			API('get_points').then(({response,error}) => {
				if(response) {
					this.setState({point_list:response});
				}
				if(error) {
					console.log(error);
					this.setState({error:error.message});
				}
			}),
		]);
		if(this.state.error.length) Alert.alert('Ошибка',error.message);
		await this.setState({waiting:false});
	}

	render() {
		let {props,state} = this;

		return (
			<View style={styles.container}>
			{state.waiting ? (
				<ActivityIndicator size='large' />
			) : (
				<>
				<Map list={state.point_list} />
				<Card list={state.card_list} />
				</>
			)}
			</View>
		);
	}
}
