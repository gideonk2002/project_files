import random
import time
from telegram import Bot, Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext, CallbackQueryHandler
from telegram.error import TelegramError

# Add game modes as constants
MODE_BASIC = "basic"
MODE_TIMER = "timer"

# Initialize the Telegram Bot with your API token
bot_token = '6469624575:AAGuw98WsmusjJ_FKrt161xUu3ykY3zTlKc'
bot = Bot(token=bot_token)

# Define game variables
class Game:
    def __init__(self, mode):
        self.mode = mode
        self.levels = [
            {"grid_size": 4, "highlighted": 2, "rounds": 2, "memorization_time": 3},
            {"grid_size": 6, "highlighted": 3, "rounds": 2, "memorization_time": 5},
            {"grid_size": 8, "highlighted": 4, "rounds": 2, "memorization_time": 6},
            {"grid_size": 10, "highlighted": 5, "rounds": 2, "memorization_time": 8},
            {"grid_size": 12, "highlighted": 6, "rounds": 2, "memorization_time": 9},
            {"grid_size": 14, "highlighted": 7, "rounds": 2, "memorization_time": 11}
        ]
        self.current_level = 0
        self.current_round = 0
        self.score = 0
        self.total_positions = sum([level["highlighted"] for level in self.levels])
        self.chat_id = None
        self.remaining_chances = 3  # Chances for correct guessing
        self.game_started = False  # Flag to check if the game is in progress

    def generate_grid(self):
        grid_size = self.levels[self.current_level]["grid_size"]
        highlighted = self.levels[self.current_level]["highlighted"]
        self.grid = [[0] * grid_size for _ in range(grid_size)]
        highlighted_cells = random.sample(range(grid_size * grid_size), highlighted)
        for cell in highlighted_cells:
            row = cell // grid_size
            col = cell % grid_size
            self.grid[row][col] = 1

    def start_round(self):
        self.generate_grid()
        grid_size = self.levels[self.current_level]["grid_size"]
        highlighted = self.levels[self.current_level]["highlighted"]
        memorization_time = self.levels[self.current_level]["memorization_time"]
        message_text = (
            f"Level {self.current_level + 1}, Round {self.current_round + 1}\n"
            f"Memorize the highlighted positions for {memorization_time} seconds:\n"
        )
        for row in self.grid:
            row_str = " ".join(["◼️" if val == 1 else "◻️" for val in row])
            message_text += f"{row_str}\n"

        try:
            # Send the grid message
            message = bot.send_message(chat_id=self.chat_id, text=message_text)

            # Sleep for the memorization time
            time.sleep(memorization_time)

            # Delete the grid message
            bot.delete_message(chat_id=self.chat_id, message_id=message.message_id)

            # Continue with the rest of the round
            bot.send_message(
                chat_id=self.chat_id,
                text="Time's up! Now enter the positions row-wise separated by spaces (e.g., '1 2 3'). "
                     "You can also type /quit to end the game."
            )
        except TelegramError as e:
            print(f"An error occurred: {e}")

    def check_answer(self, user_input):
        user_positions = [int(pos) for pos in user_input.split()]
        grid_size = self.levels[self.current_level]["grid_size"]
        highlighted_positions = [(cell // grid_size, cell % grid_size) for cell in range(grid_size * grid_size) if self.grid[cell // grid_size][cell % grid_size] == 1]
        correct_positions = 0
        for pos in user_positions:
            row = (pos - 1) // grid_size
            col = (pos - 1) % grid_size
            if (row, col) in highlighted_positions:
                correct_positions += 1
        return correct_positions == len(highlighted_positions)

def determine_iq_level(score, total_positions):
    iq_levels = [
        (0, 12, "Poor IQ"),
        (13, 24, "Low IQ"),
        (25, 36, "Average IQ"),
        (37, 42, "High IQ"),
        (43, 48, "Extreme IQ"),
        (49, total_positions, "Mastermind IQ")
    ]
    for low, high, level in iq_levels:
        if low <= score <= high:
            return level

# Create a dictionary to store game instances for each user
games = {}

# Define the command handlers
def start(update: Update, context: CallbackContext):
    chat_id = update.message.chat_id
    update.message.reply_text("Welcome to IQ_Retaliation!\nChoose a game mode:\n"
                              "/basic - Basic Mode (No time limit, 3 chances)\n"
                              "/timer - Timer Mode (With memorization time and 3 chances)")

# Define the command handlers for /basic and /timer
def basic_mode(update: Update, context: CallbackContext):
    play_game(update, context, MODE_BASIC)

def timer_mode(update: Update, context: CallbackContext):
    play_game(update, context, MODE_TIMER)

# Define the play_game function to handle game mode selection
def play_game(update: Update, context: CallbackContext, mode):
    chat_id = update.message.chat_id

    if chat_id in games:
        # A game is already in progress, reset it if the user chooses a different mode
        current_game = games[chat_id]
        if current_game.mode != mode:
            del games[chat_id]  # Delete the current game
        else:
            update.message.reply_text("You are already in a game. Use /quit to end it before starting a new one.")
            return

    current_game = Game(mode)
    current_game.chat_id = chat_id
    games[chat_id] = current_game

    # Provide a gameplay guide for the selected mode
    gameplay_guide = (
        f"Welcome to IQ_Retaliation {mode.capitalize()} Mode!\n\n"
        "In this mode, "
    )

    if mode == MODE_BASIC:
        gameplay_guide += (
            "you have no time limit to memorize the highlighted positions. "
            "You will be given only one chance to enter the positions you memorized, "
            "separated by spaces. You have 3 chances in total.\n\n"
        )
    else:
        gameplay_guide += (
            "you will be presented with a grid of positions, some of which are highlighted. "
            "Your task is to memorize the highlighted positions within a limited time. "
            "Once the time is up, you will need to enter the positions you memorized, "
            "separated by spaces. You have 3 chances in total.\n\n"
            "For example, if you memorized positions 1, 2, and 3, you would enter: '1 2 3'\n\n"
        )

    gameplay_guide += "You can also type /quit at any time to end the game.\n\n" "Type /start_round to start the game!"
    update.message.reply_text(gameplay_guide)
# Define the play function to handle game mode selection
def play(update: Update, context: CallbackContext):
    chat_id = update.message.chat_id
    mode = context.args[0].lower() if len(context.args) > 0 else None

    if chat_id in games:
        # A game is already in progress, reset it if the user chooses a different mode
        current_game = games[chat_id]
        if current_game.mode != mode:
            del games[chat_id]  # Delete the current game
        else:
            update.message.reply_text("You are already in a game. Use /quit to end it before starting a new one.")
            return

    if mode not in [MODE_BASIC, MODE_TIMER]:
        update.message.reply_text("Invalid game mode. Choose either /basic or /timer.")
        return

    current_game = Game(mode)
    current_game.chat_id = chat_id
    games[chat_id] = current_game

    # Provide a gameplay guide for the selected mode
    gameplay_guide = (
        f"Welcome to IQ_Retaliation {mode.capitalize()} Mode!\n\n"
        "In this mode, "
    )

    if mode == MODE_BASIC:
        gameplay_guide += (
            "you have no time limit to memorize the highlighted positions. "
            "You will be given only one chance to enter the positions you memorized, "
            "separated by spaces. You have 3 chances in total.\n\n"
        )
    else:
        gameplay_guide += (
            "you will be presented with a grid of positions, some of which are highlighted. "
            "Your task is to memorize the highlighted positions within a limited time. "
            "Once the time is up, you will need to enter the positions you memorized, "
            "separated by spaces. You have 3 chances in total.\n\n"
            "For example, if you memorized positions 1, 2, and 3, you would enter: '1 2 3'\n\n"
        )

    gameplay_guide += "You can also type /quit at any time to end the game.\n\n" "Type /start_round to start the game!"
    update.message.reply_text(gameplay_guide)

# Define the start_round function to adapt to the selected game mode
def start_round(update: Update, context: CallbackContext):
    chat_id = update.message.chat_id
    if chat_id not in games:
        update.message.reply_text("Type /start to choose a game mode.")
        return
    current_game = games[chat_id]

    if current_game.mode == MODE_TIMER:
        # Include memorization time and deletion of grid message
        current_game.generate_grid()
        grid_size = current_game.levels[current_game.current_level]["grid_size"]
        highlighted = current_game.levels[current_game.current_level]["highlighted"]
        memorization_time = current_game.levels[current_game.current_level]["memorization_time"]
        message_text = (
            f"Level {current_game.current_level + 1}, Round {current_game.current_round + 1}\n"
            f"Memorize the highlighted positions for {memorization_time} seconds:\n"
        )
        for row in current_game.grid:
            row_str = " ".join(["◼️" if val == 1 else "◻️" for val in row])
            message_text += f"{row_str}\n"

        try:
            # Send the grid message
            message = bot.send_message(chat_id=chat_id, text=message_text)

            # Sleep for the memorization time
            time.sleep(memorization_time)

            # Delete the grid message
            bot.delete_message(chat_id=chat_id, message_id=message.message_id)

            # Continue with the rest of the round
            bot.send_message(
                chat_id=chat_id,
                text="Time's up! Now enter the positions row-wise separated by spaces (e.g., '1 2 3'). "
                     "You can also type /quit to end the game."
            )
        except TelegramError as e:
            print(f"An error occurred: {e}")
    else:
        # Exclude memorization time and deletion of grid message
        current_game.generate_grid()
        grid_size = current_game.levels[current_game.current_level]["grid_size"]
        highlighted = current_game.levels[current_game.current_level]["highlighted"]
        message_text = (
            f"Level {current_game.current_level + 1}, Round {current_game.current_round + 1}\n"
            "Memorize the highlighted positions (no time limit):\n"
        )
        for row in current_game.grid:
            row_str = " ".join(["◼️" if val == 1 else "◻️" for val in row])
            message_text += f"{row_str}\n"

        # Send the grid message
        message = bot.send_message(chat_id=chat_id, text=message_text)

        # Continue with the rest of the round
        bot.send_message(
            chat_id=chat_id,
            text="Enter the positions row-wise separated by spaces (e.g., '1 2 3'). "
                 "You can also type /quit to end the game."
        )

# Define the answer function to handle user input and scoring
def answer(update: Update, context: CallbackContext):
    chat_id = update.message.chat_id
    if chat_id not in games:
        update.message.reply_text("Type /start to choose a game mode.")
        return
    current_game = games[chat_id]
    user_input = update.message.text

    if current_game.remaining_chances <= 0:
        update.message.reply_text("No more chances left for this round. Starting a new round.")
        current_game.current_round += 1
        current_game.remaining_chances = 3
        if current_game.current_round >= current_game.levels[current_game.current_level]["rounds"]:
            current_game.current_round = 0
            current_game.current_level += 1

        if current_game.current_level >= len(current_game.levels):
            final_score = current_game.score
            total_positions = current_game.total_positions
            iq_level = determine_iq_level(final_score, total_positions)
            update.message.reply_text(f"Congratulations! You've completed all levels.\n"
                                      f"Final score: {final_score}\nIQ Level: {iq_level}")
            del games[chat_id]
            return

        start_round(update, context)
        return

    if not current_game.check_answer(user_input):
        current_game.remaining_chances -= 1
        update.message.reply_text(f"Incorrect answer. {current_game.remaining_chances} "
                                  f"{'chance' if current_game.remaining_chances == 1 else 'chances'} left. "
                                  "Try again or type /quit to end the game.")
        return

    current_game.score += current_game.levels[current_game.current_level]["highlighted"]
    current_game.current_round += 1
    current_game.remaining_chances = 3
    if current_game.current_round >= current_game.levels[current_game.current_level]["rounds"]:
        current_game.current_round = 0
        current_game.current_level += 1

    if current_game.current_level >= len(current_game.levels):
        final_score = current_game.score
        total_positions = current_game.total_positions
        iq_level = determine_iq_level(final_score, total_positions)
        update.message.reply_text(f"Congratulations! You've completed all levels.\n"
                                  f"Final score: {final_score}\nIQ Level: {iq_level}")
        del games[chat_id]
        return

    start_round(update, context)

# Define the quit_game function to end the game and provide the final score
def quit_game(update: Update, context: CallbackContext):
    chat_id = update.message.chat_id
    if chat_id in games:
        final_score = games[chat_id].score
        total_positions = games[chat_id].total_positions
        iq_level = determine_iq_level(final_score, total_positions)
        update.message.reply_text(f"Game over! Your final score: {final_score}\nIQ Level: {iq_level}")
        del games[chat_id]
    else:
        update.message.reply_text("No active game to quit. Type /start to begin.")

# Define the callback_query_handler for handling button clicks
def callback_query_handler(update: Update, context: CallbackContext):
    query = update.callback_query
    chat_id = query.message.chat_id

    if query.data == MODE_BASIC or query.data == MODE_TIMER:
        mode = query.data
        if chat_id in games:
            # A game is already in progress, reset it if the user chooses a different mode
            current_game = games[chat_id]
            if current_game.mode != mode:
                del games[chat_id]  # Delete the current game
            else:
                query.answer("You are already in a game. Use /quit to end it before starting a new one.")
                return

        current_game = Game(mode)
        current_game.chat_id = chat_id
        games[chat_id] = current_game

        # Provide a gameplay guide for the selected mode
        gameplay_guide = (
            f"Welcome to IQ_Retaliation {mode.capitalize()} Mode!\n\n"
            "In this mode, "
        )

        if mode == MODE_BASIC:
            gameplay_guide += (
                "you have no time limit to memorize the highlighted positions. "
                "You will be given only one chance to enter the positions you memorized, "
                "separated by spaces. You have 3 chances in total.\n\n"
            )
        else:
            gameplay_guide += (
                "you will be presented with a grid of positions, some of which are highlighted. "
                "Your task is to memorize the highlighted positions within a limited time. "
                "Once the time is up, you will need to enter the positions you memorized, "
                "separated by spaces. You have 3 chances in total.\n\n"
                "For example, if you memorized positions 1, 2, and 3, you would enter: '1 2 3'\n\n"
            )

        gameplay_guide += "You can also type /quit at any time to end the game.\n\n" "Type /start_round to start the game!"
        query.message.reply_text(gameplay_guide)

# Initialize the Updater and add handlers
updater = Updater(token=bot_token, use_context=True)
dispatcher = updater.dispatcher
dispatcher.add_handler(CommandHandler("start", start))
dispatcher.add_handler(CommandHandler("play", play, pass_args=True))
dispatcher.add_handler(CommandHandler("basic", basic_mode))
dispatcher.add_handler(CommandHandler("timer", timer_mode))
dispatcher.add_handler(CommandHandler("start_round", start_round))
dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, answer))
dispatcher.add_handler(CommandHandler("quit", quit_game))
dispatcher.add_handler(CallbackQueryHandler(callback_query_handler))

# Start the bot
updater.start_polling()
updater.idle()
