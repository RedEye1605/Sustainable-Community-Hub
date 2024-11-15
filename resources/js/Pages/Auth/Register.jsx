import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, useForm } from '@inertiajs/react';

export default function Register({ onLoginClick }) { 
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        requested_role: '',
        reason: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            data,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="w-full max-w-sm p-4">
            <Head title="Register" />

            {/* Logo di bagian atas */}
            <div className="flex justify-center mb-6">
                <ApplicationLogo className="h-16 w-16" />
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="requested_role" value="Request Role (Optional)" />
                    <select
                        id="requested_role"
                        name="requested_role"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={data.requested_role}
                        onChange={(e) => setData('requested_role', e.target.value)}
                    >
                        <option value="">Select Role</option>
                        <option value="pengelola proyek">Project Manager</option>
                        <option value="donatur receiver">Donation Receiver</option>
                    </select>
                    <InputError message={errors.requested_role} className="mt-2" />
                </div>

                {/* Input Reason akan muncul jika role dipilih */}
                {data.requested_role !== '' && (
                    <div className="mt-4">
                        <InputLabel htmlFor="reason" value="Reason for requesting this role" />
                        <TextInput
                            id="reason"
                            type="text"
                            name="reason"
                            value={data.reason}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('reason', e.target.value)}
                            required
                        />
                        <InputError message={errors.reason} className="mt-2" />
                    </div>
                )}

                <div className="mt-4 flex items-center justify-end">
                    {/* Tambahkan log untuk debugging */}
                    <button
                        type="button"
                        onClick={() => {
                            console.log("Already registered? clicked"); // Debug log
                            if (onLoginClick) onLoginClick();
                        }}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </button>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
