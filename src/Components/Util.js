export const getRandomTip = () => {
  const tips = [
    "💡 Tip: Stay updated with AI trends by following tech blogs",
    "🎯 Tip: Consider learning prompt engineering - it's a growing field",
    "📚 Tip: Python and Machine Learning are valuable skills",
    "💼 Tip: Many companies are hiring for AI-related positions",
    "🔍 Tip: Explore how AI tools can enhance your productivity",
    "🌱 Tip: Start with small AI projects to build your portfolio",
    "🤝 Tip: Join AI communities to network with professionals",
    "📱 Tip: Experiment with various AI apps to understand them",
    "🎓 Tip: Online courses are great for learning AI basics",
    "💪 Tip: Combine your expertise with AI for unique opportunities",
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};
