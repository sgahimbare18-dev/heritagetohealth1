const axios = require('axios');
const ChatLog = require('../models/ChatLog');

const chatWithAmani = async (req, res) => {
  const { message, userId } = req.body;

  try {
    const systemPrompt = `You are Amani, the Heritage to Health virtual guide.
Your mission is to educate visitors about reproductive health, menstrual hygiene, and cultural practices that connect heritage with modern health.
Speak in a warm, respectful, and educational tone.
Never offer medical diagnosis or prescriptions.
Always encourage users to seek professional healthcare for personal medical issues.
Focus on empowering Maasai girls and women through education, awareness, and sustainable solutions like reusable pads.`;

    const aiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const reply = aiResponse.data.choices[0].message.content;

    // Save to database
    const chatLog = new ChatLog({
      userId: userId || 'anonymous',
      message,
      reply,
    });
    await chatLog.save();

    res.json({ reply });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Chatbot failed to respond' });
  }
};

module.exports = { chatWithAmani };
