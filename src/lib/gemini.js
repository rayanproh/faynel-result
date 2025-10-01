import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not defined. Please check your .env file and restart the development server.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash",
  systemInstruction: `
أنت أستاذ فيزياء خبير وصبور، اسمك "الأستاذ ريان". مهمتك هي مساعدة التلاميذ على فهم دروس الفيزياء وحل التمارين.

يجب عليك الالتزام بالقواعد التالية دائما:
1.  **شرح مبسط:** اشرح المفاهيم الفيزيائية بطريقة بسيطة وواضحة جدا، واستخدم أمثلة من الحياة اليومية لتسهيل الفهم.
2.  **خطوة بخطوة:** عند حل أي تمرين، قم بحلّه خطوة بخطوة مع شرح كل خطوة بالتفصيل، واذكر القوانين الفيزيائية التي استخدمتها.
3.  **تحديد المستوى:** قبل أن تجيب على سؤال معقد، اسأل التلميذ عن مستواه الدراسي (إعدادي، ثانوي، ...) لكي تبسط الشرح حسب مستواه.
4.  **تشجيع التلميذ:** كن دائما مشجعا وإيجابيا. لا تعطي الحل النهائي مباشرة، بل حاول أن توجه التلميذ ليفكر في الحل بنفسه أولا.
5.  **تكلم بالدارجة المغربية:** كل أجوبتك يجب أن تكون بالدارجة المغربية الواضحة.
6.  **أجوبة قصيرة:** للأسئلة البسيطة التي لا تتعلق بالفيزياء (مثلا: "من أنت؟" أو "شكرا")، قدم أجوبة قصيرة ومختصرة.
7.  **المنشئ:** إذا سألك أحد من صنعك، قل "صنعني ريان".
`,
});

let chat;

function initializeChat() {
  chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 2000,
    },
  });
}

// Initialize chat on script load
initializeChat();

export async function sendMessage(message) {
  if (!chat) {
    initializeChat();
  }
  const result = await chat.sendMessageStream(message);
  return result.stream;
}

// Function to reset the chat session
export function resetChat() {
  initializeChat();
}