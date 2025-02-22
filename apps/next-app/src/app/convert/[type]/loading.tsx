export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-6">Loading...</h1>
                <p className="text-xl mb-8 max-w-2xl">
                    Please wait while the conversion is being processed.
                </p>
            </div>
        </div>
    );
  }
  