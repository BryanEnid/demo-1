import React, { useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { Button } from '@/chadcn/Button';
import { Typography } from '@/chadcn/Typography';
import { Separator } from '@/chadcn/Separator';
import { ObserveIcon } from '@/components/ObserveIcon';
import { useAuth } from '@/providers/Authentication';

export function SignIn() {
	const { user, login, isLoading } = useAuth();

	const handleSignIn = (type) => {
		login();
	};

	if (isLoading) return <></>;
	if (user) return <Navigate to={`/${user?.uid}`} />;

	return (
		<div className="flex flex-col h-screen items-center justify-center">
			<div className="grid md:grid-cols-2 w-full h-full">
				{/* <!-- Left Section --> */}
				<div className="flex flex-col gap-8 h-full bg-blue-600 text-white px-10 pb-10 md:px-20 md:py-10">
					<div className="basis-1/3 text-4xl font-bold mb-4 hidden md:block">Observe</div>

					<div className="flex basis-2/3 flex-col gap-6">
						<div className="mt-10 text-2xl md:text-4xl font-medium">Explore the Sea of Jobs</div>
						<div className="md:mt-4 text-xl">We curate career learning experiences for curious minds like yours</div>

						<div className="flex justify-center md:justify-start md:mt-8">
							<Button className="text-2xl p-8 px-12 font-medium text-blue-600 bg-white" variant="outline">
								<Typography variant="large">Access in Guest Mode</Typography>
							</Button>
						</div>
					</div>

					<div className="text-center md:text-start">
						<Typography variant="small">AI / VR enabled for career immersion purposes.</Typography>
					</div>
				</div>

				{/* <!-- Right Section --> */}
				<div className="flex flex-col items-center justify-center w-full h-full min-h-screen p-10">
					<div className="flex flex-grow flex-col justify-center items-center gap-8 w-full">
						<div className="flex flex-grow flex-col gap-8 justify-center items-center">
							<div>
								<ObserveIcon rounded size={70} />
							</div>

							<Typography variant="large">Welcome to Observe</Typography>
						</div>

						<Button
							className="text-md w-full font-medium text-white bg-blue-600 rounded-full md:max-w-sm"
							variant="outline"
							onClick={handleSignIn}
						>
							<Typography variant="large">Sign up</Typography>
						</Button>

						<div className="flex flex-row justify-center items-center w-full max-w-[300px]">
							<Separator />
							<span className="mx-4">or</span>
							<Separator />
						</div>

						<Button
							className="w-full font-medium text-blue-600 rounded-full md:max-w-sm"
							variant="outline"
							onClick={handleSignIn}
						>
							<Typography variant="large">Login</Typography>
						</Button>

						<div className="text-sm flex items-end text-blue-600 flex-grow flex-1">
							<a href="google.com">Terms of Use | Privacy Policy</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
