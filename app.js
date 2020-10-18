const util = require("util"),
      http = require("http"),
      puppeteer = require('puppeteer');
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.login('NzY3NDIxMTU3OTUxMjc1MDA4.X4xqpg.h-diN6oX8v0jrrszU7ND74PWRxY');

const commands = {
    "!serverstatus":
    {
        "function": function(message){
            (async function(){
                try {
                    const browser = await puppeteer.launch();
                    const [page] = await browser.pages();
            
                    await page.goto('https://www.xenrebirth.com/index.php', { waitUntil: 'networkidle0' });
            
                    const index_data = await page.evaluate(() => [
                        document.querySelectorAll('.srv-box2')[0].textContent,
                        document.querySelectorAll('.srv-box2')[1].textContent,
                    ]);

                    await browser.close();
                    message.channel.send('*' + index_data[0] + "* (" + index_data[1] + " Active)");

                } catch (err) {
                    console.error(err);
                }
            })();
        },
        "description": "Returns the server status and number of users online.",
        "type": "single"
    },
    "!worldboss":
    {
        "function": function(message){
            return (async function(){
                try {
                    const browser = await puppeteer.launch();
                    const [page] = await browser.pages();
            
                    await page.goto('https://www.xenrebirth.com/index.php?game-bosstimer/', { waitUntil: 'networkidle0' });
            
                    const worldboss_data = await page.evaluate(() => [
                        document.querySelectorAll('#event-listing .bossRow .event-name strong')[0].textContent,
                        document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[0].textContent,
                    ]);

                    await browser.close();
                    message.channel.send('*' + worldboss_data[0] + '* in __' + worldboss_data[1] + '__');

                } catch (err) {
                    console.error(err);
                }
            })();
        },
        "description": "Returns the next world boss' name and spawn time.",
        "type": "single"
    },
    "!worldbossalerts":
    {
        "function": function(message){
            var interval = setInterval (function () {
                (async function(){
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
                            message.channel.send('*' + worldboss_data[0] + '* in __' + string[1] + '__');
                        }

                        await browser.close();
                    } catch (err) {
                        console.error(err);
                    }
                })();
            }, 60000);
            message.channel.send('Now alerting channel 10 minutes before world bosses spawn.');
        },
        "description": "Begins alerting world boss notification whenever there is 10 minutes left til spawn.",
        "type": "looping"
    },
    "!next":
    {
        "function": function(message){
            return (async function(){
                try {
                    const browser = await puppeteer.launch();
                    const [page] = await browser.pages();
            
                    await page.goto('https://www.xenrebirth.com/index.php?game-bosstimer/', { waitUntil: 'networkidle0' });
            
                    const worldboss_data = await page.evaluate(() => [
                        document.querySelectorAll('#event-listing .bossRow .event-name strong')[1].textContent,
                        document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[1].textContent,
                        document.querySelectorAll('#event-listing .bossRow .event-name strong')[2].textContent,
                        document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[2].textContent,
                    ]);

                    await browser.close();
                    message.channel.send('*' + worldboss_data[0] + '* in __' + worldboss_data[1] + '__\n*' + worldboss_data[2] + '* in __' + worldboss_data[3] + '__');

                } catch (err) {
                    console.error(err);
                }
            })();
        },
        "description": "Returns the next 2 world bosses.",
        "type": "single"
    },
    "!servertime":
    {
        "function": function(message){
            (async function(){
                try {
                    const browser = await puppeteer.launch();
                    const [page] = await browser.pages();
            
                    await page.goto('https://www.xenrebirth.com/index.php?game-bosstimer/', { waitUntil: 'networkidle0' });
            
                    const worldboss_data = await page.evaluate(() => [
                        document.querySelectorAll('#event-servertime-c')[0].textContent,
                    ]);

                    await browser.close();
                    message.channel.send(worldboss_data[0]);

                } catch (err) {
                    console.error(err);
                }
            })();
        },
        "description": "Returns current server time.",
        "type": "single"
    },
};

client.on('message', message => {
    if(message.content === '!commands'){

        full_msg = "";
        sortable = [];

        for (var key in commands) {
            // skip loop if the property is from prototype
            if (!commands.hasOwnProperty(key)) continue;

            var obj = commands[key];
            sortable.push(key);
        }

        sortable.sort(function(a, b) {
            var x = a.toLowerCase();
            var y = b.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });

        sortable.forEach(function(entry) {
            full_msg += "__" + entry + "__: " + commands[entry]["description"] + '\n';
        });

        message.channel.send(full_msg);
    }
	else if(message.content in commands){
        commands[message.content]["function"](message);
	}
});