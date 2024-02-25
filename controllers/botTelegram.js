const telegramLib = require('node-telegram-bot-api')
require('dotenv').config()
const token = process.env.TLG_TOKEN

class SendBotMessage {
    #bot = new telegramLib(token, { polling: false })
    constructor(idMsg, msg) {
        this.idMsg = idMsg
        this.msg = msg

    }

    sendMessage() {
        this.#bot.sendMessage(this.idMsg, this.msg).then(() => {
            return `${process.env.URL_CHAT}${process.env.TLG_TOKEN}/sendMessage?chat_id=${this.idMsg}&text=${this.msg}`
        }).catch(err => {
            throw err
        })
    }
}

module.exports = { SendBotMessage }