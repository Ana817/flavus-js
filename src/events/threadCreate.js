//The Module
module.exports = async (client, thread) => {
  try {
    if (thread.joinable && !thread.joined) {
      await thread.join();
    }
  } catch (e) {
    console.log(String(e).grey)
  }
}

/**
 * @INFO
 * Code by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 */
