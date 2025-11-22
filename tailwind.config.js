/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // 关键：必须包含 src 下的所有 tsx/ts 文件
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
