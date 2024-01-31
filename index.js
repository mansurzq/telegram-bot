const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6742130294:AAGPNPHmamA5np7s4qho8LhyDfIOWJVAPTQ'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, попробуй найти эту цифру!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай число', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Получить информацию о пользователе' },
        { command: '/game', description: 'Игра угадай цифру' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendVideo(chatId, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQgawKsoZp2QprscjlrVZZlIrhpIBGGwAyj4pJEfKJ0A&s')
            return bot.sendMessage(chatId, 'Вас приветствует Мансур!')
        }
        if (text === '/info') {
            const name = msg.from.first_name;
            const surname = msg.from.last_name;
            return bot.sendMessage(chatId, 'Тебя зовут: ' + name + ' ' + surname);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя пока не понимаю, напиши валидную команду!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const randomNumber = chats[chatId];
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === randomNumber) {
            return await bot.sendMessage(chatId, 'Congratulations! You win! You choose the number: ' + randomNumber, againOptions)
        } else {
            return await bot.sendMessage(chatId, 'К сожалению ты не угадал, попробуй заново! Цифра была:  ' + randomNumber, againOptions)
        }
    })
}

start()