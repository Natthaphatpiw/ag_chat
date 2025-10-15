export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="text-center p-8 bg-white rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Medical Chatbot Backend
        </h1>
        <p className="text-gray-600 mb-2">Backend API is running on port 8000</p>
        <p className="text-sm text-gray-500">API Endpoint: /api/chat</p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">Online</span>
        </div>
      </div>
    </div>
  );
}
