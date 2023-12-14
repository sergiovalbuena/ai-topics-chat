"use client";

import { useState, useEffect } from "react";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const model = new OpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  temperature: 0.9,
});

const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory: memory });

const run = async (input: string) => {
  const response = await chain.call({ input: input });
  //console.log(output);
  return response.response;
};

const categories = [
  { label: "Sport", value: "sport" },
  { label: "Politics", value: "politics" },
  { label: "Science", value: "science" },
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health", value: "health" },
  { label: "World", value: "world" },
];

const Main = () => {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("");
  const [output, setOutput] = useState("");

  const askFirstQuestion = async () => {
    const firstQuestion = await run(
      `Ask a trivia quesiton on the ${category} category`
    );
    setOutput(firstQuestion);
  };

  useEffect(() => {
    if (category !== "") {
      askFirstQuestion();
    }
  }, [category]);

  const handleCategoryChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await run(
      `AI: ${output} \n You: ${input}\n AI: Evaluate the answer and ask another trivia question`
    );
    setOutput(result);
    setInput("");
  };

  return (
    <div className="container mx-auto p-4 w-full sm:w-11/12 md:w-3/4 lg:w-2/3 ">
      <h1 className="text-2xl font-bold md-4">Quiz AI Bot Game Show</h1>
      <form onSubmit={handleCategoryChange} className="space-y-4">
        <select
          value={category}
          className="border border-gray-400 p-2 w-full rounded"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        {output && (
          <div className="mt-4">
            <h2 className="text-xl font-bold">AI: {output}</h2>
          </div>
        )}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-400 p-2 w-full rounded"
          placeholder="Enter your answer here"
        />

        <button
          type="submit"
          className="bg-blue-400 text-white p-2 w-full rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Main;
