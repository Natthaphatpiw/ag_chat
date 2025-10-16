export const Header = () => {
  return (
    <div className="fixed right-0 left-0 w-full top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-border z-50">
      <div className="flex justify-between items-center p-4 max-w-5xl mx-auto">
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              AI Medical Assistant
            </h1>
            <p className="text-xs text-muted-foreground">
              ที่ปรึกษาสุขภาพอัจฉริยะ
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-secondary-foreground">ออนไลน์</span>
          </div>
        </div>
      </div>
    </div>
  );
};
