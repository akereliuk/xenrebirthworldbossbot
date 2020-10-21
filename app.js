const util = require("util"),
      http = require("http"),
      puppeteer = require('puppeteer'),
      cron = require('node-cron'),
      delay = require('delay');
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
            recursiveTry(getServerStatus, message);
        },
        "description": "Returns the server status and number of users online.",
        "type": "single"
    },
    "!worldboss":
    {
        "function": function(message){
            recursiveTry(getWorldBoss, message);
        },
        "description": "Returns the next world boss' name and spawn time.",
        "type": "single"
    },
    "!worldbossalerts":
    {
        "function": function(message){
            cron.schedule('50 * * * *', () => {
                recursiveTry(getWorldBossAlerts, message);
            });
            message.channel.send('Now alerting channel 10 minutes before world bosses spawn.');
        },
        "description": "Begins alerting world boss notification whenever there is 10 minutes left til spawn.",
        "type": "looping"
    },
    "!next":
    {
        "function": function(message){
            recursiveTry(getNext, message);
        },
        "description": "Returns the next 2 world bosses.",
        "type": "single"
    },
    "!servertime":
    {
        "function": function(message){
            recursiveTry(getServerTime, message);
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

async function getServerTime(){
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://www.xenrebirth.com/index.php?game-bosstimer/', { waitUntil: 'networkidle0' });

        await page.waitForSelector('#event-servertime-c');

        const server_time = await page.evaluate(() => {
            if(typeof document.querySelectorAll('#event-servertime-c')[0] === "undefined"){
                return 0;
            }
            else{
                return document.querySelectorAll('#event-servertime-c')[0].textContent;
            }
        });

        await browser.close();
        return server_time;

    } catch (err) {
        console.error(err);
    }
}

async function getWorldBoss(){
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://www.xenrebirth.com/index.php?game-bosstimer/', { waitUntil: 'networkidle0' });

        await page.waitForSelector('#event-listing');

        const worldboss_data = await page.evaluate(() => {
            if(typeof document.querySelectorAll('#event-listing .bossRow .event-name strong')[0] === "undefined"
                || document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[0] === "undefined"){
                return 0;
            }
            else{

                wb_array = [
                    document.querySelectorAll('#event-listing .bossRow .event-name strong')[0].textContent,
                    document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[0].textContent
                ];

                return '*' + wb_array[0] + '* in __' + wb_array[1] + '__';
            }
        });

        await browser.close();
        return worldboss_data;

    } catch (err) {
        console.error(err);
    }
}

async function getNext(){
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://www.xenrebirth.com/index.php?game-bosstimer/', { waitUntil: 'networkidle0' });

        await page.waitForSelector('#event-listing');

        const worldboss_data = await page.evaluate(() => {
            if(typeof document.querySelectorAll('#event-listing .bossRow .event-name strong')[1] === "undefined"
                || document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[1] === "undefined"
                || document.querySelectorAll('#event-listing .bossRow .event-name strong')[2] === "undefined"
                || document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[2] === "undefined"){
                return 0;
            }
            else{

                wb_array = [
                    document.querySelectorAll('#event-listing .bossRow .event-name strong')[1].textContent,
                    document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[1].textContent,
                    document.querySelectorAll('#event-listing .bossRow .event-name strong')[2].textContent,
                    document.querySelectorAll('#event-listing .bossRow .columnTime .event-ctimer')[2].textContent
                ];

                return '*' + wb_array[0] + '* in __' + wb_array[1] + '__\n*' + wb_array[2] + '* in __' + wb_array[3] + '__';
            }
        });

        await browser.close();
        return worldboss_data;

    } catch (err) {
        console.error(err);
    }
}

async function getWorldBossAlerts(){

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.xenrebirth.com/index.php?game-bosstimer/', { waitUntil: 'networkidle0' });

        await page.waitForSelector('#event-listing');

        const curr_alert = await page.evaluate(() => {
            if(typeof document.querySelectorAll("#event-listing .bossRow .event-name strong")[0] === "undefined"){
                return 0;
            }
            else{
                return "*" + document.querySelectorAll("#event-listing .bossRow .event-name strong")[0].textContent + "* in __10m__";
            }
        });

        await browser.close();
        return curr_alert;

    } catch (err) {
        console.error(err);
    }
}

async function getServerStatus(){

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://www.xenrebirth.com/index.php', { waitUntil: 'networkidle0' });

        await page.waitForSelector('.srv-box2');
        
        const index_data = await page.evaluate(() => {
            if(typeof document.querySelectorAll('.srv-box2')[0] === "undefined" ||
            typeof document.querySelectorAll('.srv-box2')[1].textContent === "undefined"){
                return 0;
            }
            else{
                return document.querySelectorAll('.srv-box2')[0].textContent + " (" + document.querySelectorAll('.srv-box2')[1].textContent + " Active)";
            }
        });

        await browser.close();
        return index_data;

    } catch (err) {
        console.error(err);
    }
}

async function recursiveTry(_func, full_msg){
    test = await _func();
    if(!test){
        recursiveTry(_func, full_msg);
    }
    else{
        message.channel.send(full_msg);
    }
}