require('dotenv').config()

const FormData = require('form-data');
const axios = require('axios');
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.TOKEN)

const removeBg = async function (url) {

    const formData = new FormData();
    formData.append('image_url', url)

    const res = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {

        headers: { ...formData.getHeaders(), 'X-Api-Key': process.env.REMOVE_BG_TOKEN },
        responseType: 'arraybuffer'
    })

    return res.data

}


bot.command('start', (ctx) => {
    ctx.reply('hello to modos coding channel')
})

bot.on('photo', async (ctx) => {

    const file_id = ctx.update.message.photo[ctx.update.message.photo.length - 1].file_id
    const file_path = (await ctx.telegram.getFile(file_id)).file_path
    const url = `https://api.telegram.org/file/bot${process.env.TOKEN}/${file_path}`

    const photo = await removeBg(url)
    ctx.replyWithDocument({ source: photo, filename: `${Date.now()}.png` })

})

bot.launch()