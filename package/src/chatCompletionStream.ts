import { ChatCompletionRequest, SupportedChatCompletionMessageParam, chatCompletionStream } from "ai-pay";
import { useCallback, useState } from "react";

export function useChatCompletionSingleQuestion(
  modelConfig: Omit<ChatCompletionRequest, "messages"> = {
    model: "gpt-3.5-turbo",
  },
  systemPrompt: string | undefined = undefined,
  debugErrors: boolean = false
): {
  loading: boolean;
  error: string | undefined;
  streamingResponse: string | undefined;
  askQuestion: (question: string) => void;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [streamingResponse, setStreamingResponse] = useState<string | undefined>(undefined);

  const askQuestion = useCallback(async (question: string) => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      setStreamingResponse("");

      let modelOutput = "";

      let messages: SupportedChatCompletionMessageParam[] = [{
        role: "user",
        content: question,
      }];

      if (systemPrompt) {
        messages = [{
          role: "system",
          content: systemPrompt,
        },
        ...messages];
      }
  
      const response = await chatCompletionStream({
        ...modelConfig,
        messages,
      }, 
      (response) => {
        if (response.choices[0].delta.content) {
          modelOutput += response.choices[0].delta.content;
          setStreamingResponse(modelOutput);
        }
      });
  
      setError(response.error);
  
      if (response.debugError && debugErrors) {
        console.error("ai-pay-react-chat debug error: ", response.debugError);
      }
    } catch (e) {
      setError("Failed to send message to chat completion model");
    }
    
    setLoading(false);

  }, [setError, setLoading, loading, systemPrompt, modelConfig, debugErrors, setStreamingResponse]);

  return {
    loading,
    error,
    streamingResponse,
    askQuestion
  };
}
  

export function useChatCompletionStream(
  modelConfig: Omit<ChatCompletionRequest, "messages"> = {
    model: "gpt-3.5-turbo",
  },
  initialMessages: SupportedChatCompletionMessageParam[] = [],
  debugErrors: boolean = false
): {
  loading: boolean;
  error: string | undefined;
  messages: SupportedChatCompletionMessageParam[];
  streamingResponse: string | undefined;
  sendMessage: (messages: string) => void;
  deleteMessages: (startIndex: number) => void;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<SupportedChatCompletionMessageParam[]>(initialMessages);
  const [streamingResponse, setStreamingResponse] = useState<string | undefined>(undefined);

  const sendMessage = useCallback(async (message: string) => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const newMessages: SupportedChatCompletionMessageParam[] = [
        ...messages,
        {
          role: "user",
          content: message,
        }
      ];
  
      setMessages(newMessages);
      setStreamingResponse("");

      let modelOutput = "";
  
      const response = await chatCompletionStream({
        ...modelConfig,
        messages: newMessages,
      }, 
      (response) => {
        if (response.choices[0].delta.content) {
          modelOutput += response.choices[0].delta.content;
          setStreamingResponse(modelOutput);
        }
      });
  
      setError(response.error);
  
      if (response.debugError && debugErrors) {
        console.error("ai-pay-react-chat debug error: ", response.debugError);
      }

      setStreamingResponse(undefined);
  
      if (response.error === undefined) {
        newMessages.push({
          role: "assistant",
          content: modelOutput,
        });
  
        setMessages(newMessages);
      }
    } catch (e) {
      setError("Failed to send message to chat completion model");
    }
    
    setLoading(false);

  }, [setMessages, setError, setLoading, loading, messages]);

  const deleteMessages = useCallback((startIndex: number) => {
    const newMessages = messages.slice(startIndex);
    setMessages(newMessages);
  }, [setMessages, messages]);

  return {
    loading,
    error,
    messages,
    streamingResponse,
    sendMessage,
    deleteMessages,
  };
}