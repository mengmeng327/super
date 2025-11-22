import React from "react";

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">🎉 My Gemini App</h1>
      <p className="mb-6">你的应用已运行成功！这是一个可安装到 iPhone 的 PWA。</p>

      <button
        className="px-6 py-3 rounded-lg bg-blue-500 text-white shadow"
        onClick={() => alert("按钮功能可以自己继续扩展！")}
      >
        点击我
      </button>
    </div>
  );
}
