# https://discord.com/oauth2/authorize?client_id=1363613086413492355&permissions=125952&scope=bot

import discord
import os
import re
import csv
import pytz
from discord.ext import commands
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from time import sleep

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

LOCAL_TIMEZONE = pytz.timezone('America/Sao_Paulo')

intents = discord.Intents.default()
intents.members = True
intents.messages = True
intents.message_content = True
intents.guilds = True
bot = commands.Bot(command_prefix='!', intents=intents)

QUESTION_REGEX = re.compile(
    r"(\d{2}:\d{2})\s+([^\s]+)\s+\(([^)]+)\)\s*(.*)?", 
    re.DOTALL
)

CSV_FILE = 'questions.csv'

def convert_to_local_time(utc_datetime):
    return utc_datetime.replace(tzinfo=timezone.utc).astimezone(LOCAL_TIMEZONE)

if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['created_at', 'timestamp', 'emoji', 'test', 'question_number', 'field', 'comment', 'image_url'])


class discordClient(discord.Client):
    async def on_ready(self):
        print(f'Logged on as {self.user}!')


@bot.command(name='import')
async def import_questions(ctx, arg=None):
    if arg is None:
        await ctx.send("⚠️ This will delete the current file and reimport all questions. Use `!import all` to reimport everything, `!import -7d` to reimport the last 7 days and `!import -2w` to reimport the last 2 weeks.")
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

    elif arg != "all":
        print(arg)
        await ctx.send("❌ Invalid argument.")
        return
    
    status_msg = await ctx.send("Resetting file...")

    # reset CSV file
    with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['created_at', 'timestamp', 'emoji', 'test', 'question_number', 'field', 'comment', 'image_url'])

    await status_msg.edit(content='📁 File deleted. Reading channel messages...')
    count = 0
    processed = 0
    
    # use larger batch size to reduce API calls (discord.py batch size is 100)
    batch_size = 250
    csv_rows = []
    last_message = None 
    
    while True:
        # get a batch of messages
        messages = []
        async for message in ctx.channel.history(limit=batch_size, before=last_message):
            messages.append(message)
        
        if not messages:
            break 
            
        processed += len(messages)
        await status_msg.edit(content=f"⏳ Processing... ({processed} messages scanned, {count} questions found)")
        
        # process message batch
        for message in messages:
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

                image_url = None
                if message.attachments:
                    image_url = message.attachments[0].url

                local_time = convert_to_local_time(message.created_at)
                csv_rows.append([local_time.isoformat(), timestamp, emoji, test, question_number, field, comment, image_url])
                count += 1
        
        # write batch to CSV
        if len(csv_rows) >= 100:
            with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerows(csv_rows)
            csv_rows = [] # clear for next batch
            
        if messages:
            last_message = messages[-1]
    
    # write remaining rows
    if csv_rows:
        with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerows(csv_rows)
    
    await status_msg.edit(content=f"✅ Successfully imported {count} questions from {processed} messages.")
    sleep(3)
    await status_msg.delete()
    await ctx.message.delete()

@bot.event
async def on_message(message):
    if message.author.bot:
        return
    
    match = QUESTION_REGEX.match(message.content)
    if match:
        timestamp, emoji, info_block, comment = match.groups()
        try:
            parts = [part.strip() for part in info_block.split('-')]
            test = parts[0]
            question_number = parts[1]
            field = parts[2]
        except Exception as e:
            print(f"Error parsing message: {e}")
            return

        image_url = None
        if message.attachments:
            image_url = message.attachments[0].url

        local_time = convert_to_local_time(message.created_at)
        new_row = [local_time.isoformat(), timestamp, emoji, test, question_number, field, comment, image_url]

        # read all current rows
        with open(CSV_FILE, mode='r', newline='', encoding='utf-8') as f:
            reader = list(csv.reader(f))
            header = reader[0]
            existing_rows = reader[1:]

        # prepend the new row
        with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(header)
            writer.writerow(new_row)
            writer.writerows(existing_rows)


    await bot.process_commands(message)

@bot.event
async def on_message_delete(message):
    if message.author.bot:
        return
    
    match = QUESTION_REGEX.match(message.content)
    if match:
        timestamp, emoji, info_block, comment = match.groups()
        try:
            parts = [part.strip() for part in info_block.split('-')]
            test = parts[0]
            question_number = parts[1]
            field = parts[2]
        except Exception as e:
            print(f"Error parsing message: {e}")
            return

        image_url = None
        if message.attachments:
            image_url = message.attachments[0].url

        local_time = convert_to_local_time(message.created_at)
        formatted_msg = [local_time.isoformat(), timestamp, emoji, test, question_number, field, comment, image_url]
        stringified_row = []
        for item in formatted_msg:
            if item is None:
                stringified_row.append('')
            else:
                stringified_row.append(str(item))

        comparison = ','.join(stringified_row)

        with open(CSV_FILE, mode='r', newline='', encoding='utf-8') as f:
            rows = list(csv.reader(f))
            header = rows[0]
            data = rows[1:]

        # get the csv but without the row to be deleted
        filtered_data = [row for row in data if ','.join(row) != comparison]

        # rewrite csv with the filtered row
        with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(header)
            writer.writerows(filtered_data)
    



bot.run(TOKEN)