const vscode = require('vscode');
const AJAX = require('./src/util/axios');
console.log('jijin - 扩展已被执行');

function activate(context) {
	console.log('jijin - 扩展已激活');

	let timer;

	const barItemStart = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right)

	barItemStart.text = `$(graph)`;
	barItemStart.tooltip = 'vscode jijin'
	barItemStart.command = 'jijin.login'
	barItemStart.show()

	let login = vscode.commands.registerCommand('jijin.login', () => {
		const jijinConfig = vscode.workspace.getConfiguration('jijin')

		if (!jijinConfig.list || !jijinConfig.list[0]) {
			vscode.window.showErrorMessage('vscode Jijin 开启失败，配置项填写有误，请查看jijin配置项是否正确')
			return
		}

		let collection = vscode.languages.createDiagnosticCollection('jijin');
		let uri = vscode.window.activeTextEditor.document.uri;

		// 请求函数
		const requestFun = () => {
			// 请求基金列表
			let requestList = []
			// 输出日志列表
			let logList = []

			jijinConfig.list.map(FCODE => {
				requestList.push(new Promise((resolve, reject) => {
					AJAX({
						FCODE,
					}).then(res => {
						resolve(res)
					})
					.catch(err => {
						reject(err)
					})
				}))
			})
			Promise.all(requestList).then(res => {

				res.map(item => {
					const data = item.data.Datas[item.data.Datas.length - 1]
					const title = item.data.Expansion.SHORTNAME
					const strArr = data.split(',')
					const value = strArr[strArr.length - 1]
					const isGreen = value.includes('-')

					logList.push({
						message: value,
						severity: isGreen ? 2 : 0,
						code: strArr[1],
						source: title,
					})
				})

				console.log('查询成功！')
				collection.clear()
				collection.set(uri, logList)
			})
		}
		
		vscode.window.showInformationMessage('是否启动vscode Jijin服务？', '是', '否').then(result => {
			if (result === '是') {

				barItemStart.text = `$(circle-slash)`
				barItemStart.command = 'jijin.close'

				timer = setInterval(requestFun, 5000)
				// 第一次执行
				requestFun()
			}
		})
	})
	let close = vscode.commands.registerCommand('jijin.close', () => {
		vscode.window.showInformationMessage('是否关闭vscode Jijin服务？', '是', '否').then(result => {
			if (result === '是') {
				clearInterval(timer)
				barItemStart.text = `$(graph)`
				barItemStart.command = 'jijin.login'
			}
		})
	})
	context.subscriptions.push(login, close);
}

function deactivate() {
	console.log('jijin - 扩展已退出')
}

exports.activate = activate;

module.exports = {
	activate,
	deactivate
}