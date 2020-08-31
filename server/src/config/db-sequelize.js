const Sequelize = require('sequelize');
import config from './db-config';
const log4js = require('log4js');
const logsConfig = require('../lib/logs.js');
//加载配置文件
log4js.configure(logsConfig);
const debugLogger = log4js.getLogger('debugLogger');
console.log('pgsql连接成功');
export const dbSequelize = new Sequelize(config.database, config.user, config.password, {
	host: config.host,
	dialect: config.dialect,
	pool: {
		max: config.max,
		min: config.min,
		acquire: config.acquire,
		idle: config.idle
	},
	timezone: '+08:00', //东八时区 - 不然会相差8小时
	define: {
		// 取消orm框架自动添加时间戳
		timestamps: false,
		charset: 'utf8',
		// 取消创建表名复数形式
		freezeTableName: true,
		// 字段以下划线（_）来分割（默认是驼峰命名风格）
		'underscored': true
	},
	logging: (sql) => {
		debugLogger.debug(sql);
	}
});
