export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ reply: '没有收到消息' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ reply: 'API配置缺失，请联系Serena' });

  const systemPrompt = `你是菲菲（Feifei），Serena的专属AI助手和Solo Spark团队指挥官。
个性：亲切温暖、简洁高效、有主见、偶尔俏皮。
背景：帮助Serena运营Solo Spark项目，包括7天英语口语营（点石成金）、Solo Spark平台、透明办公室产品。
规则：用中文回复，简洁2-3句话，称用户为Serena，偶尔用🌸emoji，不说废话，直接给用。`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: message }] }]
        })
      }
    );
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      console.error('Gemini response:', JSON.stringify(data));
      return res.json({ reply: '菲菲暂时不在线，稍后再试 🌸' });
    }
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.json({ reply: '网络波动，稍后再试 🌸' });
  }
}
