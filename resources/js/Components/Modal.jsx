import { Dialog, Transition } from '@headlessui/react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
    enterTransition = 'ease-out duration-300',
    leaveTransition = 'ease-in duration-200',
    minHeight = '10px', 
    maxHeight = '80vh' 
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} leave={leaveTransition}>
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 transition-all sm:px-0"
                onClose={close}
            >
                {/* Semi-transparent Overlay */}
                <Transition.Child
                    enter={enterTransition}
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave={leaveTransition}
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50" aria-hidden="true" />
                </Transition.Child>

                {/* Modal Content */}
                <Transition.Child
                    enter={enterTransition}
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave={leaveTransition}
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div
                        className={`mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full ${maxWidthClass}`}
                        style={{ minHeight, maxHeight }}
                    >
                        {/* Close Button */}
                        {closeable && (
                            <button
                                onClick={close}
                                className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700 text-lg font-semibold"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        )}
                        <div className="p-6">
                            {children}
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}