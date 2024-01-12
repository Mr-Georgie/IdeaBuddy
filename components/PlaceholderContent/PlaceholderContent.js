export const PlaceholderContent = () => {
    return (
        <div className="flex flex-1 flex-col justify-between">
            <div className="my-20 flex flex-col items-center justify-center gap-3 dark:text-white">
                <span className="rounded-full bg-white p-3 dark:bg-gray-900">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-12 w-12"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                    </svg>
                </span>
                <span>What new idea did you come up with?</span>
            </div>
            <div className="border-1 chat-content mx-6 rounded-lg border border-gray-500 p-10 font-mono md:mx-10 lg:mx-44 xl:mx-60">
                <h4 className="pb-3">Examples</h4>
                <div className="flex flex-col text-sm font-light text-gray-400">
                    <span className="">
                        <i>-</i> I want to create a cross-selling e-commerce app
                        ...
                    </span>
                    <span className="">
                        <i>-</i> I want to build an app that aggregates ...
                    </span>
                </div>
            </div>
        </div>
    );
};
