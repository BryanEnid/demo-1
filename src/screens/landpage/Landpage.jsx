import React from 'react';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { Icon } from '@iconify/react';
import { Button } from '@/chadcn/Button';
import { Input } from '@/chadcn/Input';
// import { useAuthenticationProviders } from '@/hooks/useAuthenticationProviders';
import { useCollection } from '@/hooks/useCollection';
import { Typography } from '@/chadcn/Typography';
import { useAuth } from '@/providers/Authentication.jsx';

export function Landpage() {
	// Hooks
	const navigate = useNavigate(); // Get the navigate function
	const { user, login, logout } = useAuth();
	const { checkAvailableUsername } = useCollection('users');

	// State
	const [username, setUsername] = React.useState('');
	const [isUsernameAvailable, setUsernameAvailable] = React.useState(null);
	const [isChecking, setChecking] = React.useState(false);

	// Refs
	const debounceRef = React.useRef(null);

	const handleSignIn = (type) => {
		// TODO: firebase functions or lambda functions when using aws to create a documents for the user
		login();
	};

	const handleUsernameChange = ({ target }) => {
		setChecking(true);
		debounceRef.current?.cancel();

		// Declare
		const newUsername = target.value;
		const handleDebounce = () => {
			checkAvailableUsername(newUsername).then((value) => {
				setUsernameAvailable(value);
				setChecking(false);
			});
		};

		// Set input
		setUsername(newUsername);

		// start debouncing
		const debounceInstance = _.debounce(handleDebounce, 500);
		debounceRef.current = debounceInstance;
		debounceInstance();
	};

	return (
		<div className="flex flex-col h-screen items-center justify-center">
			<div className="flex flex-col gap-2 ">
				<Button
					onClick={() => navigate(`/${user.username}`)} // Navigate to the camera route
					disabled={!user}
				>
					GO TO PROFILE – DEMO
				</Button>

				<div className="h-60" />

				{/* {!user && (
          <div className=" flex flex-col gap-2 mt-6 rounded-sm bg-slate-300 p-4">
            <div>What's the username you want ot use?</div>

            <Input onChange={handleUsernameChange} type="text" id="myInput" data-lpignore="true" className="bg-white" />
            {isChecking && (
              <div className="flex flex-row justify-center items-center gap-2 text-primary">
                <Icon className="" icon="eos-icons:loading" />
                <Typography variant="small">Checking username on server</Typography>
              </div>
            )}

            {isUsernameAvailable === false && username.length > 3 && !isChecking && (
              <div className="flex flex-row justify-center items-center gap-2 text-primary">
                <Typography variant="small">User already exists</Typography>
              </div>
            )}

            {isUsernameAvailable && !isChecking && (
              <div className="flex flex-row justify-center items-center gap-2 text-green-600">
                <Icon className="" icon="gg:check-o" />
                <Typography variant="small">Valid user</Typography>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => handleSignIn("SignIn")} // Navigate to the camera route
              disabled={!(username.length > 3 && isUsernameAvailable && !isChecking)}
            >
              Google – Sign In
            </Button>
          </div>
        )} */}

				<div className="flex flex-col gap-1">
					{!user && (
						<div className="flex flex-col gap-2 rounded-sm text-center ">
							{/* or */}
							<Button
								onClick={() => handleSignIn('LogIn')} // Navigate to the camera route
								className="px-20"
							>
								Log In – Google
							</Button>
						</div>
					)}
					{!user && (
						<div className="flex flex-col gap-2 rounded-sm text-center">
							{/* or */}
							<Button variant="link" className="text-primary" onClick={() => handleSignIn('SignIn')}>
								or Sign In – Google
							</Button>
						</div>
					)}
				</div>

				{user && (
					<Button variant="outline" className="text-primary" onClick={logout}>
						Sign out
					</Button>
				)}
			</div>
			<div className="w-[90vw] overflow-y-auto bg-slate-400 mt-4 p-4 rounded-lg">
				<pre>{user ? JSON.stringify(user, null, 2) : 'no user'}</pre>
			</div>
		</div>
	);
}
