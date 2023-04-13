// ログ出力　https://qiita.com/oret/items/32291e1afee55e0f8526
// ログ出力  https://qiita.com/Kento75/items/3c6ae1ba1b433ae433a3
var log4js = require('log4js');
var logger = exports = module.exports = {};
log4js.configure({
    "appenders": {
        "access": {
            "type":     "dateFile",
            "filename": "./logs/access.log"
        },
        "error": {
            "type":     "dateFile",
            "filename": "./logs/error.log"
        },
        "system": {
            "type":     "dateFile",
            "filename": "./logs/system.log"
        },
        "console": {
            "type": "console"
        },
    },
    "categories": {
        "default": {
            "appenders": [
                "access"
                ,"console"
            ]
            ,"level": "INFO"
        },
        "access": {
            "appenders": [
                "access"
                ,"console"
            ]
            ,"level": "INFO"
        },
        "system": {
            "appenders": [
                "system"
                ,"console"
            ]
            ,"level": "ALL"
        },
        "error": {
            "appenders": [
                "error"
                ,"console"
            ]
            ,"level": "WARN"
        }
    }
});

// logger.request = log4js.getLogger('request');
logger.access = log4js.getLogger('access');
logger.system = log4js.getLogger('system');
logger.error  = log4js.getLogger('error');