import { Button } from '@/chadcn/Button';
import { Typography } from '@/chadcn/Typography';
import DefaultImage from '@/assets/404/404.png';
import { useNavigate } from 'react-router-dom';

export const Page404 = () => {
	const navigate = useNavigate();
	return (
		<div className="relative overflow-hidden">
			<div className="absolute w-full h-full pointer-events-auto bg-[#2B8DFF]">
				<div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-transparent via-transparent to-blue-200 opacity-50" />

				<div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-transparent via-transparent to-blue-200 opacity-50" />

				<Typography variant="h2" className="text-white absolute top-10 left-10">
					Observe
				</Typography>
			</div>

			<div className="relative flex flex-col items-center justify-center min-h-screen md:grid md:grid-cols-2 md:gap-4 lg:gap-8 z-10">
				<div className="flex flex-col items-center justify-center p-4 md:p-12 text-white">
					<div className="flex flex-col gap-5">
						<Typography variant="h1">Uh-oh, 404 Not Found</Typography>

						<Typography variant="h3" className="max-w-[600px]">
							There seems to be a problem. Let me go find it for you. We recommend 'going back' to try again.
						</Typography>

						<Typography variant="h4" className="max-w-[600px] ">
							If the problem persists, please contact <span className="font-bold">support@observeyourfuture.com</span>
						</Typography>

						<div>
							<Button variant="secondary" onClick={() => navigate('/')}>
								Return Home
							</Button>
						</div>
					</div>
				</div>

				<img
					alt="Mascot"
					className="aspect-square overflow-hidden rounded-lg object-contain object-center"
					src={DefaultImage}
				/>
			</div>
		</div>
	);
};
