import React, { Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import AppRoutes from './routes';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
                <div className="min-h-screen bg-gray-50">
                    <AppRoutes />
                </div>
            </Suspense>
        </ErrorBoundary>
    );
};

export default App; 