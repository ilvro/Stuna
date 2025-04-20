#APP ID 1363613086413492355
#PUBLIC KEY 0797bed8caddd5675d310f06ffae42f0a501e1c6d49e3748a764e33bf40f3ee3
#https://discord.com/oauth2/authorize?client_id=1363613086413492355
#536988736

import discord
import os
import re
import csv
from discord.ext import commands
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

intents = discord.Intents.default()
intents.members = True
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

QUESTION_REGEX = re.compile(
    r"(\d{2}:\d{2})\s([^\s]+)\s\(([^)]+)\)\s?(.*)?"
)

CSV_FILE = 'questions.csv'

if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'emoji', 'test', 'question_number', 'field', 'comment'])


class discordClient(discord.Client):
    async def on_ready(self):
        print(f'Logged on as {self.user}!')

    async def on_message(self, message):
        if message.author == self.user:
            return
        
        match = QUESTION_REGEX.match(message.content)
        if match:
            timestamp, emoji, info_block, comment = match.groups()
            try:
                parts = [part.strip() for part in info_block.split('-')]
                test = parts[0]
                question_number = parts[1]
                field = parts[2]
            except:
                await message.channel.send("Formato invalido")
                return
            
            with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([timestamp, emoji, test, question_number, field, comment])

            await message.add_reaction('💾')

        #print(f'Message from {message.author}: {message.content}')
        await bot.process_commands(message)

@bot.command(name='import')
async def import_questions(ctx, arg=None):
    print('called import')  
    if arg is None:
        await ctx.send("⚠️ This will delete the current file and reimport all questions. Use `!import all` to reimport everything, `!import 7d` to reimport the last 7 days and `!import 2w` to reimport the last 2 weeks.")
        return
    
    time_filter = None
    if re.match(r"^-\d+[dwm]$", arg):  # ex: -7d, -2w, -1m
        num = int(re.findall(r'\d+', arg)[0])
        unit = arg[-1]

        now = datetime.now(timezone.utc)
        if unit == 'd':
            time_filter = now - timedelta(days=num)
        elif unit == 'w':
            time_filter = now - timedelta(weeks=num)
        elif unit == 'm':
            time_filter = now - timedelta(days=num * 30) 

    elif arg != "confirm":
        print(arg)
        await ctx.send("❌ Invalid argument.")
        return
    
    status_msg = await ctx.send("Resetting file...")

    # reset CSV file
    with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'emoji', 'test', 'question_number', 'field', 'comment'])

    await status_msg.edit(content='📁 File deleted. Reading channel messages...')
    count = 0

    # read channel messages
    async for message in ctx.channel.history(limit=None, oldest_first=True):
        if message.author.bot:
            continue
        if time_filter and message.created_at < time_filter:
            continue

        match = QUESTION_REGEX.match(message.content)
        if match:
            timestamp, emoji, info_block, comment = match.groups()
            try:
                parts = [part.strip() for part in info_block.split('-')]
                test = parts[0]
                question_number = parts[1]
                field = parts[2]

            except:
                continue

            with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([timestamp, emoji, test, question_number, field, comment])
            count += 1

        await status_msg.edit(content=f"⏳ Succesfully imported {count} questions.")

    await status_msg.edit(content=f"✅ Succesfully imported {count} questions.")

bot.run(TOKEN)