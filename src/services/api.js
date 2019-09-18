import {NetInfo} from 'react-native';

export default async function(method) {
	if(methods.indexOf(method) != -1) {
		// console.log("API: "+method);
		try {
			let urls = {
				get_cards: 'https://app.vezzer.no/example.json',
				get_points: 'https://app.vezzer.no/example_geo.json',
			};
			let res = await fetch(urls[method]);

			if(res.status == 200) {
				let data = await res.json();
				return {response:data};
			} else if(res.status == 500) {
				return {error:{code:res.status,message:'Сервер не доступен'}};
			} else {
				console.log(res);

				let connection_info = await NetInfo.getConnectionInfo();
				if(connection_info.type == 'none') return {error:{message:'Нет интернета'}};

				return {error:{code:res.status,message:'Проблемы со связью'}};
			}
		} catch(e) {
			console.log(e);
			return {error:{message:'Не удается выполнить запрос'}};
		}
	} else {
		console.log("Неизвестный метод АПИ: ",method);
	}
}

var methods = [
	'get_cards',
	'get_points',
];
