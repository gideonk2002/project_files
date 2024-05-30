IQ_Retaliation Telegram Bot
IQ_Retaliation is a Telegram bot that provides a memory challenge game. Users can choose between two modes: Basic and Timer. The game presents a grid with highlighted positions, which the user must memorize and input correctly to progress through the levels.

Features
Basic Mode: No time limit for memorizing the highlighted positions.
Timer Mode: Limited time for memorizing the highlighted positions.
Multi-level gameplay: Each level increases the grid size and the number of highlighted positions.
Score Tracking: Users' scores are tracked and used to determine their IQ level.
Requirements
To run this bot, you need to have the following libraries installed:

python-telegram-bot==13.12
python-dotenv
requests
You can install the required libraries using the following command:

Copy code
pip install python-telegram-bot python-dotenv requests
Installation
Clone the repository:

Copy code
git clone https://github.com/yourusername/IQ_Retaliation.git
cd IQ_Retaliation
Create a virtual environment (optional but recommended):

Copy code
python -m venv venv
source venv/bin/activate   # On Windows use `venv\Scripts\activate`
Install dependencies:

Copy code
pip install -r requirements.txt
Set up your environment variables:

Create a .env file in the project root directory and add your Telegram bot API token:

env
Copy code
BOT_TOKEN='6469624575:AAGuw98WsmusjJ_FKrt161xUu3ykY3zTlKc'
Run the bot:

Copy code
python bot.py
Usage:
GO TO TELEGRAM APP SEARCH "IQ_Retaliation_Bot", IN THAT FOLLOW THE INSTRUCTIONS

Start a chat with your bot on Telegram.
Use the /start command to begin.
Choose a game mode: /basic or /timer.
Follow the instructions to play the game.
Use the /quit command to end the game at any time.
Commands
/start - Initialize the bot and show game mode options.
/basic - Start a game in Basic Mode.
/timer - Start a game in Timer Mode.
/start_round - Start a new round.
/quit - Quit the current game.
How to Play
Choose a game mode.
Memorize the highlighted positions in the grid.
Enter the positions row-wise separated by spaces (e.g., '1 2 3').
Progress through levels and rounds by correctly inputting the highlighted positions.
The game tracks your score and determines your IQ level based on your performance.
Contributing
Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

