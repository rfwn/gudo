import { TextChannel, ThreadChannel, DMChannel, NewsChannel, Collection, Message } from 'discord.js';

export async function sendLongMessage(
  content: string,
  channelOrThread: TextChannel | ThreadChannel | DMChannel | NewsChannel
): Promise<void> {
  const MAX_LENGTH = 2000;
  let messages: string[] = [];
  let currentMessage = '';
  let inCodeBlock = false;

  // Split the content by newline to help find good breaking points
  const lines = content.split('\n');

  for (let line of lines) {
    // Check if this line starts or ends a code block
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock; // Toggle the code block state
    }

    // If adding this line would exceed the limit
    if (currentMessage.length + line.length + 1 > MAX_LENGTH) {
      // If we're in the middle of a code block, close it, send, then reopen it
      if (inCodeBlock) {
        currentMessage += '\n```'; // Close code block
        messages.push(currentMessage);
        currentMessage = '```'; // Reopen code block
      } else {
        messages.push(currentMessage); // Send the current message
        currentMessage = ''; // Start a new message
      }
    }

    // Add the line to the current message (with a newline if it's not empty)
    currentMessage += (currentMessage.length > 0 ? '\n' : '') + line;
  }

  // Push any remaining content
  if (currentMessage.length > 0) {
    messages.push(currentMessage);
  }

  // Send each message using the provided channel or thread object
  for (let message of messages) {
    await channelOrThread.send(message); // Send each message asynchronously
  }
}

export async function fetchAllMessagesFromThread(thread: ThreadChannel): Promise<Message[]> {
  let allMessages: Message[] = [];
  let lastMessageId: string | undefined;

  // Loop to fetch messages in batches of up to 100 messages
  while (true) {
      const options = { limit: 100, before: lastMessageId };
      const fetchedMessages = await thread.messages.fetch(options);

      // Convert the collection to an array and add it to the result
      allMessages = allMessages.concat([...fetchedMessages.values()]);

      // Break the loop if there are no more messages to fetch
      if (fetchedMessages.size < 100) {
          break;
      }

      // Set the ID of the last fetched message to continue fetching older messages
      lastMessageId = fetchedMessages.last()?.id;
  }

  return allMessages;
}