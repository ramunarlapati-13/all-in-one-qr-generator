import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.state = { hasError: true, error, errorInfo };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4">
                    <div className="glass-card max-w-md w-full rounded-3xl p-8 text-center border border-white/10">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} className="text-red-500" />
                        </div>

                        <h2 className="text-2xl font-black mb-3 text-white">Something Went Wrong</h2>
                        <p className="text-gray-400 mb-6">
                            The application encountered an error. Please try refreshing the page.
                        </p>

                        {this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300 mb-2">
                                    Show Error Details
                                </summary>
                                <pre className="bg-black/50 p-4 rounded-xl text-xs text-red-400 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            className="primary-btn flex items-center justify-center gap-2 mx-auto"
                        >
                            <RefreshCw size={18} /> Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
