const util = require("util"),
      http = require("http"),
      puppeteer = require('puppeteer');
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.login('NzY3NDIxMTU3OTUxMjc1MDA4.X4xqpg.h-diN6oX8v0jrrszU7ND74PWRxY');

client.on('message', message => {
    if (message.content === '!serverstatus') {

        (async function main() {
            try {
                const browser = await puppeteer.launch();
                const [page] = await browser.pages();
        
                await page.goto('https://www.xenrebirth.com/index.php', { waitUntil: 'networkidle0' });
        
                const index_data = await page.evaluate(() => [
                    document.querySelectorAll('.srv-box2')[0].textContent,
                    document.querySelectorAll('.srv-box2')[1].textContent,
                ]);

                message.channel.send(index_data[0] + " (" + index_data[1] + " Active)");

                await browser.close();
            } catch (err) {
                console.error(err);
            }
        })();
    } 
    else if(message.content === '!worldboss'){

        (async function main() {
            try {
                const browser = await puppeteer.launch();
                const [page] = await browser.pages();
        
                await page.goto('https://www.xenrebirth.com/index.php?game-bosstimer/', { waitUntil: 'networkidle0' });
        
                const worldboss_data = await page.evaluate(() => [
                    document.querySelectorAll('#event-listing .bossRow .event-name strong')[0].textContent,
                    document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[0].textContent,
                ]);

                message.channel.send(worldboss_data[0] + ' in ' + worldboss_data[1]);

                await browser.close();
            } catch (err) {
                console.error(err);
            }
        })();
    }
    else if(message.content === '!worldbossalerts'){
        var interval = setInterval (function () {
            (async function main() {
                try {
                    const browser = await puppeteer.launch();
                    const [page] = await browser.pages();
            
                    await page.goto('https://www.xenrebirth.com/index.php?game-bosstimer/', { waitUntil: 'networkidle0' });
            
                    const worldboss_data = await page.evaluate(() => [
                        document.querySelectorAll('#event-listing .bossRow .event-name strong')[0].textContent,
                        document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[0].textContent,
                    ]);

                    var string = worldboss_data[1];
                    string = string.split(/[ ,]+/);
                    
                    if(string[1] === '10m'){
                        message.channel.send(worldboss_data[0] + ' in ' + string[1]);
                    }
    
                    await browser.close();
                } catch (err) {
                    console.error(err);
                }
            })();
        }, 60000);  
    }
});