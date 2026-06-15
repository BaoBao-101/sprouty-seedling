import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-sky-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <span className="text-7xl block mb-6" style={{ animation: "float 3s ease-in-out infinite" }}>
              🌱
            </span>
            <h1 className="font-display text-3xl text-gray-800 mb-3">
              Ôi, cây bị nhéo rồi!
            </h1>
            <p className="text-gray-500 font-medium mb-2">
              Đã xảy ra lỗi không mong muốn. Đừng lo — Cây Kỷ Niệm vẫn an toàn! 💚
            </p>
            {this.state.error && import.meta.env.DEV && (
              <p className="text-xs text-gray-400 font-mono bg-gray-100 rounded-2xl px-4 py-2 mb-6 text-left break-words">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-2xl transition-all active:scale-95 shadow-lg shadow-green-200"
            >
              🏠 Về trang chủ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
