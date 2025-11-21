import { GoogleGenAI } from "@google/genai";
import { CodeExecutionResult } from "../types";

// Initialize Gemini Client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const explainCode = async (code: string, context: string): Promise<string> => {
  const client = getAiClient();
  if (!client) return "API Key 缺失。请配置环境变量。";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      上下文: 用户正在学习 Go 语言。他们当前正在浏览关于 "${context}" 的课程。
      
      用户代码:
      \`\`\`go
      ${code}
      \`\`\`
      
      任务: 请用通俗易懂的**中文**解释这段代码做了什么。重点解释与上下文相关的概念。保持在 150 字以内。
      风格: 像一位耐心的老师，清晰、鼓励。
    `;
    
    const response = await client.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "无法生成解释。";
  } catch (error) {
    console.error("Error explaining code:", error);
    return "抱歉，分析代码时出现错误。";
  }
};

export const simulateRun = async (code: string): Promise<CodeExecutionResult> => {
  const client = getAiClient();
  if (!client) return { output: "", error: "API Key missing." };

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      你是一个 Go (Golang) 编译器和运行时模拟器。
      
      待执行代码:
      \`\`\`go
      ${code}
      \`\`\`
      
      任务: 预测这段代码的标准输出 (stdout)。
      规则:
      1. 只返回输出的文本内容。
      2. 如果有编译错误或运行时错误，返回以 "compile error:" 或 "runtime error:" 开头的错误信息 (错误信息内容可以用中文简述)。
      3. 不要使用 Markdown 代码块包裹，只返回纯文本。
    `;

    const response = await client.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text || "";
    
    if (text.toLowerCase().includes("error:")) {
        return { output: "", error: text };
    }

    return { output: text };
  } catch (error) {
    console.error("Error running code:", error);
    return { output: "", error: "模拟运行失败，API 连接错误。" };
  }
};

export const chatWithTutor = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
    const client = getAiClient();
    if (!client) return "API Key 缺失。";

    try {
        const chat = client.chats.create({
            model: "gemini-2.5-flash",
            history: history,
            config: {
                systemInstruction: "你是一只名叫 'GoBot' 的 Go 语言助教。你的目标是帮助用户学习 Golang。请用中文回答所有问题。回答要简洁、专业且富有鼓励性。如果涉及代码示例，请确保符合 Go 的最佳实践 (Idiomatic Go)。"
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text || "我没有听清，请再说一遍。";
    } catch (e) {
        console.error(e);
        return "连接助教时发生错误。";
    }
}